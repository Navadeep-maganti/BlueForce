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
    InterviewUpdateSerializer,
    InterviewCompleteSerializer,
)
from common.responses import success_response, error_response
from common.permissions import IsWorker, IsEmployer

class ApplyJobView(APIView):
    """
    POST /api/v1/jobs/<id>/apply/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    @transaction.atomic
    def post(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk)

        if job.status != 'active':
            return error_response(
                message="This job opening is no longer accepting applications (status: closed/paused).",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if Application.objects.filter(job=job, worker=worker).exists():
            return error_response(
                message="You have already submitted an application for this position.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        if worker.trust_score_total < 40:
            return error_response(
                message="Your profile strength is below the minimum verification threshold (40/100). Please add skills or proof of work before applying.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        match_data = calculate_job_match(worker, job)
        match_score = match_data.get('match_percentage', 88)

        application = Application.objects.create(
            job=job,
            worker=worker,
            current_stage=Application.StageChoices.APPLIED,
            match_score=match_score
        )

        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=Application.StageChoices.APPLIED,
            note=f"Application submitted with verified Trust Score ({worker.trust_score_total}/100) and {match_score}% AI trade compatibility.",
            completed=True
        )

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

        application.current_stage = new_stage
        if rejection_reason:
            application.rejection_reason = rejection_reason
        application.save()

        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=new_stage,
            note=note,
            completed=True
        )

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
    POST /api/v1/applications/<application_id>/schedule-interview/
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

        validated = serializer.validated_data.copy()
        validated['created_by'] = request.user
        validated['status'] = Interview.StatusChoices.SCHEDULED
        if not validated.get('location_or_link'):
            validated['location_or_link'] = validated.get('location') or validated.get('meeting_link')

        interview, created = Interview.objects.update_or_create(
            application=application,
            defaults=validated
        )

        application.current_stage = Application.StageChoices.INTERVIEW
        application.save()

        ApplicationTimelineEvent.objects.create(
            application=application,
            stage=Application.StageChoices.INTERVIEW,
            note=f"Interview scheduled ({interview.get_interview_type_display()}) on {interview.date or interview.scheduled_at} at {interview.time}.",
            completed=True
        )

        Notification.objects.create(
            user=application.worker.user,
            title="Interview Scheduled! 📅",
            message=f"{application.job.employer.company_name} scheduled an interview for {application.job.title} on {interview.date or interview.scheduled_at} at {interview.time}.",
            notification_type='interview',
            action_url='/worker/applications'
        )

        return success_response(
            data=InterviewSerializer(interview).data,
            message="Interview scheduled and candidate notified.",
            status_code=status.HTTP_201_CREATED
        )

class InterviewListView(APIView):
    """
    GET /api/v1/interviews/
    Lists interviews relevant to authenticated user:
    - Workers: interviews for their applications
    - Employers: interviews for their jobs
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_param = request.query_params.get('status')
        if hasattr(request.user, 'worker_profile'):
            interviews = Interview.objects.filter(application__worker=request.user.worker_profile)
        elif hasattr(request.user, 'employer_profile'):
            interviews = Interview.objects.filter(application__job__employer=request.user.employer_profile)
        elif request.user.is_staff:
            interviews = Interview.objects.all()
        else:
            interviews = Interview.objects.none()

        if status_param and status_param.lower() != 'all':
            interviews = interviews.filter(status__iexact=status_param)

        interviews = interviews.select_related(
            'application',
            'application__job',
            'application__job__employer',
            'application__worker',
            'application__worker__user'
        )
        serializer = InterviewSerializer(interviews, many=True)
        return success_response(
            data=serializer.data,
            message="Interviews retrieved successfully."
        )

class InterviewDetailView(APIView):
    """
    GET /api/v1/interviews/<id>/
    PATCH /api/v1/interviews/<id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        interview = get_object_or_404(
            Interview.objects.select_related(
                'application',
                'application__job',
                'application__job__employer',
                'application__worker',
                'application__worker__user'
            ),
            pk=pk
        )
        
        # Privacy & ownership check
        if (hasattr(request.user, 'worker_profile') and interview.application.worker != request.user.worker_profile) and \
           (hasattr(request.user, 'employer_profile') and interview.application.job.employer != request.user.employer_profile) and \
           not request.user.is_staff:
            return error_response(
                message="You do not have permission to view this interview.",
                status_code=status.HTTP_403_FORBIDDEN
            )

        serializer = InterviewSerializer(interview)
        return success_response(data=serializer.data)

    def patch(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        interview = get_object_or_404(Interview, pk=pk, application__job__employer=employer)

        serializer = InterviewUpdateSerializer(interview, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Interview update validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()

        # Add timeline event on reschedule
        ApplicationTimelineEvent.objects.create(
            application=interview.application,
            stage=Application.StageChoices.INTERVIEW,
            note=f"Interview updated/rescheduled to {interview.date or interview.scheduled_at} at {interview.time}.",
            completed=True
        )

        return success_response(
            data=InterviewSerializer(interview).data,
            message="Interview details updated successfully."
        )

class InterviewCancelView(APIView):
    """
    POST /api/v1/interviews/<id>/cancel/
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    @transaction.atomic
    def post(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        interview = get_object_or_404(Interview, pk=pk, application__job__employer=employer)

        reason = request.data.get('reason', 'Interview cancelled by employer.')
        interview.status = Interview.StatusChoices.CANCELLED
        interview.feedback = f"Cancelled: {reason}"
        interview.save()

        ApplicationTimelineEvent.objects.create(
            application=interview.application,
            stage=Application.StageChoices.INTERVIEW,
            note=f"Interview cancelled. Reason: {reason}",
            completed=False
        )

        Notification.objects.create(
            user=interview.application.worker.user,
            title="Interview Notice",
            message=f"Your scheduled interview for {interview.application.job.title} was cancelled: {reason}",
            notification_type='interview',
            action_url='/worker/applications'
        )

        return success_response(
            data=InterviewSerializer(interview).data,
            message="Interview cancelled and history preserved."
        )

class InterviewCompleteView(APIView):
    """
    POST /api/v1/interviews/<id>/complete/
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    @transaction.atomic
    def post(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        interview = get_object_or_404(Interview, pk=pk, application__job__employer=employer)

        serializer = InterviewCompleteSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Complete validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        feedback = serializer.validated_data.get('feedback', 'Candidate successfully completed trade test.')
        rating = serializer.validated_data.get('rating')
        move_to_selected = serializer.validated_data.get('move_to_selected', True)

        interview.status = Interview.StatusChoices.COMPLETED
        interview.feedback = feedback
        interview.save()

        if rating:
            interview.application.rating = rating

        if move_to_selected:
            interview.application.current_stage = Application.StageChoices.SELECTED
            interview.application.save()

            ApplicationTimelineEvent.objects.create(
                application=interview.application,
                stage=Application.StageChoices.SELECTED,
                note=f"Trade test completed successfully. Feedback: {feedback}",
                completed=True
            )

            Notification.objects.create(
                user=interview.application.worker.user,
                title="Congratulations! Trade Test Passed 🎉",
                message=f"You have been selected following your interview for {interview.application.job.title}.",
                notification_type='application_update',
                action_url='/worker/applications'
            )
        else:
            ApplicationTimelineEvent.objects.create(
                application=interview.application,
                stage=Application.StageChoices.INTERVIEW,
                note=f"Interview marked completed. Feedback: {feedback}",
                completed=True
            )

        return success_response(
            data=InterviewSerializer(interview).data,
            message="Interview marked as completed."
        )
