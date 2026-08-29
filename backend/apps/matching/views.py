from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from apps.workers.models import WorkerProfile
from apps.employers.models import EmployerProfile
from apps.jobs.models import Job
from .recommendations import get_recommended_jobs_for_worker, get_ranked_candidates_for_job
from common.responses import success_response, error_response
from common.permissions import IsWorker, IsEmployer

class WorkerRecommendedJobsView(APIView):
    """
    GET /api/v1/jobs/recommended/
    Returns AI-scored recommended jobs tailored to the authenticated worker's verified trade profile.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(
            WorkerProfile.objects.select_related('user').prefetch_related('skills', 'certifications'),
            user=request.user
        )
        limit = int(request.query_params.get('limit', 10))
        recommendations = get_recommended_jobs_for_worker(worker, limit=limit)

        return success_response(
            data=recommendations,
            message="Recommended jobs retrieved successfully with explainable match breakdown."
        )

class EmployerRecommendedCandidatesView(APIView):
    """
    GET /api/v1/employer/candidates/recommended/?job_id=<job_id>
    Ranks qualified candidates for an employer's specific job posting.
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        job_id = request.query_params.get('job_id')

        if not job_id:
            # Fallback to the employer's first active job
            job = Job.objects.filter(employer=employer, status=Job.StatusChoices.ACTIVE).first()
            if not job:
                job = Job.objects.filter(employer=employer).first()
        else:
            job = get_object_or_404(Job, pk=job_id, employer=employer)

        if not job:
            return error_response(
                message="No job posting found to match candidates against. Please post a job first.",
                status_code=status.HTTP_404_NOT_FOUND
            )

        limit = int(request.query_params.get('limit', 20))
        candidates = get_ranked_candidates_for_job(job, limit=limit)

        return success_response(
            data={
                'job_id': job.id,
                'job_title': job.title,
                'trade_category': job.trade_category,
                'required_skills': job.required_skills,
                'candidates': candidates,
            },
            message="Ranked candidates retrieved successfully with explainable compatibility."
        )
