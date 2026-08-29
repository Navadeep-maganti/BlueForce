from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Application, ApplicationTimelineEvent, Interview
from apps.jobs.models import Job
from apps.workers.models import WorkerProfile
from apps.employers.models import EmployerProfile
from apps.notifications.models import Notification
from apps.matching.services import calculate_job_match
from .serializers import (
    ApplicationSerializer,
    ApplicationStageUpdateSerializer,
    ScheduleInterviewSerializer,
    InterviewSerializer,
)
from common.responses import success_response, error_response
from common.permissions import IsWorker, IsEmployer

class ApplyJobView(APIView):
    """
    POST /api/v1/jobs/<id>/apply/
    Validates:
    1. Authenticated user is Worker
    2. Job is active / open
    3. Duplicate check: has worker already applied?
    4. Profile completeness check
    Creates Application + Initial Timeline Event + Notifications.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    @transaction.atomic
    def post(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk)

        # 1. Job Active Check
        if job.status != 'active':
            return error_response(
                message="This job opening is no longer accepting applications (status: closed/paused).",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # 2. Duplicate Application Check
        if Application.objects.filter(job=job, worker=worker).exists():
            return error_response(
                message="You have already submitted an application for this position.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # 3. Profile Completeness Check
        if worker.trust_score_total < 40:
            return error_response(
                message="Your profile strength is below the minimum verification threshold (40/100). Please add skills or proof of work before applying.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # 4. Compute AI Match Compatibility
        match_data = calculate_job_match(worker, job)
        match_score = match_data.get('match_percentage', 88)

        # 5. Create Application
        application = Application.objects.create(
            job=job,
            worker=worker,
            current_stage=Application.StageChoices.APPLIED,
            match_score=match_score
        )

        # 6. Create Initial Timeline Event
        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=Application.StageChoices.APPLIED,
            note=f"Application submitted with verified Trust Score ({worker.trust_score_total}/100) and {match_score}% AI trade compatibility.",
            completed=True
        )

        # 7. Create In-App Notifications
        Notification.objects.create(
            user=job.employer.user,
            title=f"New Candidate Applied: {worker.full_name}",
            message=f"{worker.full_name} ({worker.primary_trade}) applied for {job.title} with a {match_score}% match score.",
            notification_type='application_update',
            action_url='/employer/pipeline'
        )

        Notification.objects.create(
            user=request.user,
            title="Application Sent Successfully",
            message=f"Your application for {job.title} at {job.employer.company_name} was delivered.",
            notification_type='application_update',
            action_url='/worker/applications'
        )

        return success_response(
            data=ApplicationSerializer(application).data,
            message="Application submitted successfully!",
            status_code=status.HTTP_201_CREATED
        )

class WorkerApplicationListView(APIView):
    """
    GET /api/v1/applications/my/
    Lists all job applications submitted by the authenticated worker with full timelines.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        applications = Application.objects.filter(worker=worker).select_related('job', 'job__employer')
        serializer = ApplicationSerializer(applications, many=True)
        return success_response(
            data=serializer.data,
            message="Worker applications retrieved successfully."
        )

class EmployerApplicationListView(APIView):
    """
    GET /api/v1/applications/employer/
    Lists candidate applications for employer's jobs with filters:
    - job_id
    - stage
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        applications = Application.objects.filter(job__employer=employer).select_related('worker', 'worker__user', 'job')

        job_id = request.query_params.get('job_id')
        if job_id:
            applications = applications.filter(job_id=job_id)

        stage = request.query_params.get('stage')
        if stage and stage.lower() != 'all':
            applications = applications.filter(current_stage__iexact=stage)

        serializer = ApplicationSerializer(applications, many=True)
        return success_response(
            data=serializer.data,
            message="Recruitment pipeline applications retrieved successfully."
        )

class ApplicationDetailView(APIView):
    """
    GET /api/v1/applications/<id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        application = get_object_or_404(
            Application.objects.select_related('worker', 'worker__user', 'job', 'job__employer'),
            pk=pk
        )
        serializer = ApplicationSerializer(application)
        return success_response(data=serializer.data)

class ApplicationStageUpdateView(APIView):
    """
    PATCH /api/v1/applications/<id>/stage/
    Enforces strict State Transition Logic Matrix and generates timeline event + notifications.
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    @transaction.atomic
    def patch(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        application = get_object_or_404(Application, pk=pk, job__employer=employer)

        serializer = ApplicationStageUpdateSerializer(
            data=request.data,
            context={'application': application}
        )
        if not serializer.is_valid():
            return error_response(
                message="Stage transition error.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        new_stage = serializer.validated_data['stage']
        note = serializer.validated_data.get('note') or f"Application moved to {new_stage}."
        rejection_reason = serializer.validated_data.get('rejection_reason')

        # Update application
        application.current_stage = new_stage
        if rejection_reason:
            application.rejection_reason = rejection_reason
        application.save()

        # Create Timeline Event
        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=new_stage,
            note=note,
            completed=True
        )

        # Send Worker Notification
        Notification.objects.create(
            user=application.worker.user,
            title=f"Application Update: {new_stage}",
            message=f"Your application for {application.job.title} at {application.job.employer.company_name} is now: {new_stage}.",
            notification_type='application_update',
            action_url='/worker/applications'
        )

        return success_response(
            data=ApplicationSerializer(application).data,
            message=f"Application successfully transitioned to {new_stage}."
        )

class ScheduleInterviewView(APIView):
    """
    POST /api/v1/applications/<id>/schedule-interview/
    Schedules an interview, sets stage to Interview, creates timeline event, and notifies worker.
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    @transaction.atomic
    def post(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        application = get_object_or_404(Application, pk=pk, job__employer=employer)

        serializer = ScheduleInterviewSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Interview scheduling validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        # Create or update interview record
        interview, created = Interview.objects.update_or_create(
            application=application,
            defaults=serializer.validated_data
        )

        # Transition stage to Interview
        application.current_stage = Application.StageChoices.INTERVIEW
        application.save()

        # Add timeline event
        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=Application.StageChoices.INTERVIEW,
            note=f"Interview scheduled ({interview.interview_type}) on {interview.date} at {interview.time}.",
            completed=True
        )

        # Send High-Priority Notification
        Notification.objects.create(
            user=application.worker.user,
            title="Interview Scheduled! 📅",
            message=f"{application.job.employer.company_name} scheduled an interview for {application.job.title} on {interview.date} at {interview.time}.",
            notification_type='interview',
            action_url='/worker/applications'
        )

        return success_response(
            data=ApplicationSerializer(application).data,
            message="Interview scheduled and candidate notified.",
            status_code=status.HTTP_201_CREATED
        )
