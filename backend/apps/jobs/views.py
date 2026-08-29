from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Job
from apps.employers.models import EmployerProfile
from .serializers import (
    EmployerJobSerializer,
    PublicJobListSerializer,
    PublicJobDetailSerializer,
)
from common.responses import success_response, error_response
from common.permissions import IsEmployer
from common.pagination import StandardResultsSetPagination

class EmployerJobListCreateView(APIView):
    """
    GET /api/v1/employer/jobs/
    Lists all job openings posted by the authenticated employer.

    POST /api/v1/employer/jobs/
    Posts a new job opening for the authenticated employer.
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        status_param = request.query_params.get('status')
        jobs = Job.objects.filter(employer=employer)

        if status_param:
            jobs = jobs.filter(status=status_param)

        serializer = EmployerJobSerializer(jobs, many=True)
        return success_response(
            data=serializer.data,
            message="Employer jobs retrieved successfully."
        )

    def post(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        serializer = EmployerJobSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Job creation validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        job = serializer.save(employer=employer)
        return success_response(
            data=EmployerJobSerializer(job).data,
            message="Job posted successfully.",
            status_code=status.HTTP_201_CREATED
        )

class EmployerJobDetailView(APIView):
    """
    GET /api/v1/employer/jobs/<id>/
    PATCH /api/v1/employer/jobs/<id>/
    DELETE /api/v1/employer/jobs/<id>/
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk, employer=employer)
        serializer = EmployerJobSerializer(job)
        return success_response(data=serializer.data)

    def patch(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk, employer=employer)
        serializer = EmployerJobSerializer(job, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Job update failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return success_response(data=serializer.data, message="Job updated successfully.")

    def delete(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk, employer=employer)
        job.status = 'closed'
        job.save()
        return success_response(message="Job closed successfully.")

class PublicJobListView(APIView):
    """
    GET /api/v1/jobs/
    Public job discovery endpoint with multi-parameter filtering:
    - search (keyword search over title, trade, description, required skills, company)
    - location / city
    - radius (max distance in km)
    - min_salary
    - max_salary
    - experience (max experience required)
    - shift
    - job_type
    - skills
    """
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        jobs = Job.objects.filter(status='active').select_related('employer')

        # 1. Search Query
        search = request.query_params.get('search')
        if search:
            jobs = jobs.filter(
                Q(title__icontains=search) |
                Q(trade_category__icontains=search) |
                Q(description__icontains=search) |
                Q(employer__company_name__icontains=search) |
                Q(city__icontains=search)
            )

        # 2. Location Filter
        location = request.query_params.get('location') or request.query_params.get('city')
        if location and location.lower() != 'all':
            jobs = jobs.filter(
                Q(city__icontains=location) |
                Q(location__icontains=location)
            )

        # 3. Trade Category
        category = request.query_params.get('category') or request.query_params.get('trade')
        if category and category.lower() != 'all':
            jobs = jobs.filter(trade_category__icontains=category)

        # 4. Salary Bounds
        min_salary = request.query_params.get('min_salary')
        if min_salary:
            try:
                jobs = jobs.filter(salary_max__gte=int(min_salary))
            except ValueError:
                pass

        max_salary = request.query_params.get('max_salary')
        if max_salary:
            try:
                jobs = jobs.filter(salary_min__lte=int(max_salary))
            except ValueError:
                pass

        # 5. Experience
        experience = request.query_params.get('experience')
        if experience:
            try:
                jobs = jobs.filter(experience_required_years__lte=int(experience))
            except ValueError:
                pass

        # 6. Shift & Job Type
        shift = request.query_params.get('shift')
        if shift and shift.lower() != 'all':
            jobs = jobs.filter(shift__iexact=shift)

        job_type = request.query_params.get('job_type')
        if job_type and job_type.lower() != 'all':
            jobs = jobs.filter(job_type__iexact=job_type)

        # 7. Radius Filter
        radius = request.query_params.get('radius')
        if radius:
            try:
                jobs = jobs.filter(distance_km__lte=float(radius))
            except ValueError:
                pass

        # Paginate results
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(jobs, request)
        serializer = PublicJobListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class PublicJobDetailView(APIView):
    """
    GET /api/v1/jobs/<id>/
    Returns comprehensive public job specs, plant location, benefits, and employer details.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        job = get_object_or_404(Job.objects.select_related('employer'), pk=pk)
        serializer = PublicJobDetailSerializer(job, context={'request': request})
        return success_response(
            data=serializer.data,
            message="Job details retrieved successfully."
        )

class SaveJobToggleView(APIView):
    """
    POST /api/v1/jobs/<id>/save/
    DELETE /api/v1/jobs/<id>/save/
    Allows authenticated workers to bookmark or unbookmark a job opening.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        from apps.workers.models import WorkerProfile
        from .models import SavedJob
        worker = get_object_or_404(WorkerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk)

        saved_job, created = SavedJob.objects.get_or_create(worker=worker, job=job)
        return success_response(
            data={'job_id': job.id, 'is_saved': True},
            message="Job saved to your bookmarks.",
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    def delete(self, request, pk):
        from apps.workers.models import WorkerProfile
        from .models import SavedJob
        worker = get_object_or_404(WorkerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk)

        deleted_count, _ = SavedJob.objects.filter(worker=worker, job=job).delete()
        return success_response(
            data={'job_id': job.id, 'is_saved': False},
            message="Job removed from your bookmarks."
        )
