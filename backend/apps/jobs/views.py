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
            message="Job posting created and activated successfully.",
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
        return success_response(
            data=serializer.data,
            message="Job details retrieved successfully."
        )

    def patch(self, request, pk):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        job = get_object_or_404(Job, pk=pk, employer=employer)
        serializer = EmployerJobSerializer(job, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Job update validation failed.",
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
    Public job discovery engine with high-performance filtering:
    - search: title, description, trade category, company name, city
    - location / city: geographic location
    - minimum_salary / min_salary: lower salary bound
    - maximum_salary / max_salary: upper salary bound
    - experience: max experience required
    - job_type: Full-time, Contract, Shift-based, Part-time
    - shift: Day Shift, Night Shift, Rotational, Flexible
    - skills: required / preferred skills filter
    - status: active (default), draft, paused, closed, all
    - ordering: -created_at, salary_max, -salary_min, experience_required_years, -openings
    """
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        status_param = request.query_params.get('status', 'active')
        if status_param.lower() == 'all':
            jobs = Job.objects.all().select_related('employer')
        else:
            jobs = Job.objects.filter(status=status_param).select_related('employer')

        # 1. Multi-Field Keyword Search
        search = request.query_params.get('search')
        if search:
            jobs = jobs.filter(
                Q(title__icontains=search) |
                Q(trade_category__icontains=search) |
                Q(description__icontains=search) |
                Q(employer__company_name__icontains=search) |
                Q(city__icontains=search) |
                Q(location__icontains=search)
            )

        # 2. Location & City Filter
        location = request.query_params.get('location') or request.query_params.get('city')
        if location and location.lower() != 'all':
            jobs = jobs.filter(
                Q(city__icontains=location) |
                Q(location__icontains=location)
            )

        # 3. Trade Category Filter
        category = request.query_params.get('category') or request.query_params.get('trade')
        if category and category.lower() != 'all':
            jobs = jobs.filter(trade_category__icontains=category)

        # 4. Salary Bounds (Supports min_salary / minimum_salary & max_salary / maximum_salary)
        min_salary = request.query_params.get('minimum_salary') or request.query_params.get('min_salary')
        if min_salary:
            try:
                min_val = int(min_salary)
                jobs = jobs.filter(Q(salary_max__gte=min_val) | Q(salary_min__gte=min_val))
            except ValueError:
                pass

        max_salary = request.query_params.get('maximum_salary') or request.query_params.get('max_salary')
        if max_salary:
            try:
                max_val = int(max_salary)
                jobs = jobs.filter(salary_min__lte=max_val)
            except ValueError:
                pass

        # 5. Experience Filter
        experience = request.query_params.get('experience')
        if experience:
            try:
                jobs = jobs.filter(experience_required_years__lte=int(experience))
            except ValueError:
                pass

        # 6. Shift & Job Type Filters
        shift = request.query_params.get('shift')
        if shift and shift.lower() != 'all':
            jobs = jobs.filter(shift__iexact=shift)

        job_type = request.query_params.get('job_type')
        if job_type and job_type.lower() != 'all':
            jobs = jobs.filter(job_type__iexact=job_type)

        # 7. Skills Filter (Supports comma-separated or single skill)
        skills = request.query_params.get('skills') or request.query_params.get('skill')
        if skills and skills.lower() != 'all':
            skill_list = [s.strip() for s in skills.split(',') if s.strip()]
            for sk in skill_list:
                jobs = jobs.filter(
                    Q(required_skills__icontains=sk) |
                    Q(preferred_skills__icontains=sk) |
                    Q(title__icontains=sk)
                )

        # 8. Radius Filter
        radius = request.query_params.get('radius')
        if radius:
            try:
                jobs = jobs.filter(distance_km__lte=float(radius))
            except ValueError:
                pass

        # 9. Dynamic Ordering
        ordering = request.query_params.get('ordering', '-created_at')
        allowed_orderings = [
            'created_at', '-created_at',
            'salary_max', '-salary_max',
            'salary_min', '-salary_min',
            'experience_required_years', '-experience_required_years',
            'distance_km', '-distance_km',
            'openings', '-openings',
        ]
        if ordering in allowed_orderings:
            jobs = jobs.order_by(ordering)
        else:
            jobs = jobs.order_by('-created_at')

        jobs = jobs.distinct()

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
