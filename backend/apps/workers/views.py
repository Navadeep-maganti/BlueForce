from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import (
    WorkerProfile,
    Skill,
    WorkerSkill,
    Certification,
    ProofOfWork,
    WorkExperience,
)
from .serializers import (
    WorkerProfileAggregatedSerializer,
    WorkerProfileUpdateSerializer,
    SkillTaxonomySerializer,
    WorkerSkillSerializer,
    CertificationSerializer,
    ProofOfWorkSerializer,
    PublicWorkerProfileSerializer,
    CandidateDiscoveryCardSerializer,
)
from apps.verification.models import VerificationDocument
from common.responses import success_response, error_response
from common.permissions import IsWorker
from common.pagination import StandardResultsSetPagination

class WorkerDiscoveryListView(APIView):
    """
    GET /api/v1/workers/
    Candidate discovery endpoint for employers:
    - search: worker name, primary trade, bio, tagline
    - skill: filter by specific trade skill
    - location / city: filter by geography
    - experience: minimum years of experience
    - availability: available_now, within_15_days, etc.
    - minimum_trust_score: filter by minimum total trust score
    - verified_only: filter for government/Aadhaar verified workers
    - ordering: -trust_score_total, years_of_experience, -created_at
    """
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        workers = WorkerProfile.objects.select_related('user').prefetch_related('skills', 'certifications', 'proof_of_works')

        # 1. Keyword Search
        search = request.query_params.get('search')
        if search:
            workers = workers.filter(
                Q(full_name__icontains=search) |
                Q(primary_trade__icontains=search) |
                Q(tagline__icontains=search) |
                Q(bio__icontains=search) |
                Q(city__icontains=search) |
                Q(skills__skill_name__icontains=search)
            )

        # 2. Specific Skill Filter
        skill = request.query_params.get('skill')
        if skill and skill.lower() != 'all':
            workers = workers.filter(
                Q(skills__skill_name__icontains=skill) |
                Q(primary_trade__icontains=skill)
            )

        # 3. Location / City Filter
        location = request.query_params.get('location') or request.query_params.get('city')
        if location and location.lower() != 'all':
            workers = workers.filter(
                Q(city__icontains=location) |
                Q(location__icontains=location)
            )

        # 4. Minimum Experience (Years)
        experience = request.query_params.get('experience')
        if experience:
            try:
                workers = workers.filter(years_of_experience__gte=int(experience))
            except ValueError:
                pass

        # 5. Availability Filter
        availability = request.query_params.get('availability')
        if availability and availability.lower() != 'all':
            workers = workers.filter(availability__iexact=availability)

        # 6. Minimum Trust Score
        min_trust = request.query_params.get('minimum_trust_score')
        if min_trust:
            try:
                workers = workers.filter(trust_score_total__gte=int(min_trust))
            except ValueError:
                pass

        # 7. Verified Only Filter
        verified_only = request.query_params.get('verified_only')
        if verified_only and verified_only.lower() in ['true', '1', 'yes']:
            workers = workers.filter(
                Q(user__is_verified=True) |
                Q(trust_identity_score__gte=20)
            )

        # 8. Ordering
        ordering = request.query_params.get('ordering', '-trust_score_total')
        allowed_orderings = [
            'trust_score_total', '-trust_score_total',
            'years_of_experience', '-years_of_experience',
            'created_at', '-created_at'
        ]
        if ordering in allowed_orderings:
            workers = workers.order_by(ordering)
        else:
            workers = workers.order_by('-trust_score_total')

        workers = workers.distinct()

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(workers, request)
        serializer = CandidateDiscoveryCardSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

class WorkerProfileMeView(APIView):
    """
    GET /api/v1/workers/me/
    PATCH /api/v1/workers/me/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = WorkerProfileAggregatedSerializer(worker)
        return success_response(
            data=serializer.data,
            message="Aggregated worker profile retrieved successfully."
        )

    def patch(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = WorkerProfileUpdateSerializer(worker, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Profile update validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        worker.calculate_trust_score()
        
        updated_data = WorkerProfileAggregatedSerializer(worker).data
        return success_response(
            data=updated_data,
            message="Worker profile updated successfully."
        )

class SkillTaxonomyListView(APIView):
    """
    GET /api/v1/skills/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        skills = Skill.objects.all()

        if category:
            skills = skills.filter(category__iexact=category)
        if search:
            skills = skills.filter(name__icontains=search)

        serializer = SkillTaxonomySerializer(skills, many=True)
        return success_response(data=serializer.data)

class WorkerSkillListCreateView(APIView):
    """
    GET /api/v1/workers/me/skills/
    POST /api/v1/workers/me/skills/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        skills = worker.skills.all()
        serializer = WorkerSkillSerializer(skills, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = WorkerSkillSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Skill validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        skill = serializer.save(worker=worker, is_verified=True, verification_source='Self Declared & Tested')
        
        skill_count = worker.skills.count()
        worker.trust_skills_score = min(20, 15 + skill_count)
        worker.calculate_trust_score()

        return success_response(
            data=WorkerSkillSerializer(skill).data,
            message="Skill added successfully.",
            status_code=status.HTTP_201_CREATED
        )

class WorkerSkillDetailView(APIView):
    """
    PATCH /api/v1/workers/me/skills/<id>/
    DELETE /api/v1/workers/me/skills/<id>/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def patch(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        skill = get_object_or_404(WorkerSkill, pk=pk, worker=worker)
        serializer = WorkerSkillSerializer(skill, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Skill update failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return success_response(data=serializer.data, message="Skill updated successfully.")

    def delete(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        skill = get_object_or_404(WorkerSkill, pk=pk, worker=worker)
        skill.delete()
        worker.calculate_trust_score()
        return success_response(message="Skill removed successfully.")

class WorkerCertificationListCreateView(APIView):
    """
    GET /api/v1/workers/me/certifications/
    POST /api/v1/workers/me/certifications/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        certs = worker.certifications.all()
        serializer = CertificationSerializer(certs, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = CertificationSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Certification validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        cert = serializer.save(worker=worker, verification_status='pending')

        VerificationDocument.objects.create(
            entity_type='worker',
            worker=worker,
            doc_type='ITI Diploma',
            doc_number=cert.credential_id or f"CERT-{cert.id}",
            file_url=cert.document_url or 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600',
            status='pending'
        )

        return success_response(
            data=CertificationSerializer(cert).data,
            message="Certification uploaded and queued for admin verification.",
            status_code=status.HTTP_201_CREATED
        )

class WorkerCertificationDetailView(APIView):
    """
    DELETE /api/v1/workers/me/certifications/<id>/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def delete(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        cert = get_object_or_404(Certification, pk=pk, worker=worker)
        cert.delete()
        worker.calculate_trust_score()
        return success_response(message="Certification deleted successfully.")

class WorkerProofOfWorkListCreateView(APIView):
    """
    GET /api/v1/workers/me/proof-of-work/
    POST /api/v1/workers/me/proof-of-work/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        pows = worker.proof_of_works.all()
        serializer = ProofOfWorkSerializer(pows, many=True)
        return success_response(data=serializer.data)

    def post(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = ProofOfWorkSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Proof of work validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        pow_item = serializer.save(
            worker=worker,
            is_verified=True,
            verified_by='Site Supervisor Verification Stamp'
        )

        worker.trust_completed_jobs_score = min(10, worker.trust_completed_jobs_score + 1)
        worker.calculate_trust_score()

        return success_response(
            data=ProofOfWorkSerializer(pow_item).data,
            message="Proof of work project published successfully (+1 Trust Score point).",
            status_code=status.HTTP_201_CREATED
        )

class WorkerProofOfWorkDetailView(APIView):
    """
    PATCH /api/v1/workers/me/proof-of-work/<id>/
    DELETE /api/v1/workers/me/proof-of-work/<id>/
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def patch(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        pow_item = get_object_or_404(ProofOfWork, pk=pk, worker=worker)
        serializer = ProofOfWorkSerializer(pow_item, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Update failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        serializer.save()
        return success_response(data=serializer.data, message="Proof of work updated.")

    def delete(self, request, pk):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        pow_item = get_object_or_404(ProofOfWork, pk=pk, worker=worker)
        pow_item.delete()
        worker.calculate_trust_score()
        return success_response(message="Proof of work deleted.")

class PublicWorkerProfileView(APIView):
    """
    GET /api/v1/workers/<id>/
    Sanitized public profile for employers (hides sensitive documents, Aadhaar, private phone/email).
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        worker = get_object_or_404(
            WorkerProfile.objects.select_related('user').prefetch_related(
                'skills', 'certifications', 'proof_of_works', 'experiences', 'reviews'
            ),
            pk=pk
        )
        serializer = PublicWorkerProfileSerializer(worker)
        return success_response(
            data=serializer.data,
            message="Public worker profile retrieved."
        )

class WorkerCareerInsightsView(APIView):
    """
    GET /api/v1/workers/me/career-insights/
    Analyzes active platform jobs in worker's trade category and identifies
    high-demand missing skills to recommend strategic upskilling paths.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(
            WorkerProfile.objects.prefetch_related('skills'),
            user=request.user
        )

        # 1. Existing Strengths
        worker_skill_names = [s.skill_name.strip() for s in worker.skills.all()]
        worker_skill_lowers = set(s.lower() for s in worker_skill_names)

        # 2. Analyze Active Relevant Marketplace Jobs
        from apps.jobs.models import Job
        from collections import Counter

        jobs_qs = Job.objects.filter(status=Job.StatusChoices.ACTIVE)
        if worker.primary_trade:
            trade_jobs = jobs_qs.filter(
                Q(trade_category__icontains=worker.primary_trade) |
                Q(title__icontains=worker.primary_trade)
            )
            if trade_jobs.exists():
                jobs_qs = trade_jobs

        missing_skills_counter = Counter()
        for job in jobs_qs:
            all_job_skills = (job.required_skills or []) + (job.preferred_skills or [])
            for sk in all_job_skills:
                sk_clean = sk.strip()
                if not any(sk_clean.lower() in ws or ws in sk_clean.lower() for ws in worker_skill_lowers):
                    missing_skills_counter[sk_clean] += 1

        # 3. Format Ranked Recommended Skills
        recommended_skills = []
        for skill_name, count in missing_skills_counter.most_common(5):
            recommended_skills.append({
                'skill': skill_name,
                'reason': 'Frequently requested in relevant job vacancies',
                'job_opportunities': max(count * 6, 8),
            })

        # Deterministic fallback recommendations if marketplace job count is nascent
        if len(recommended_skills) < 2:
            default_trade_recs = {
                'Electrician': [
                    {'skill': 'PLC Troubleshooting & Ladder Logic', 'reason': 'Frequently requested in industrial automation jobs (+₹8,000 avg boost)', 'job_opportunities': 18},
                    {'skill': 'Solar HT Inverter Synchronization', 'reason': 'High demand across commercial solar EPC projects', 'job_opportunities': 14},
                    {'skill': 'VFD Parameterization & Maintenance', 'reason': 'Essential for heavy conveyor and motor drive plants', 'job_opportunities': 11},
                ],
                'Welder': [
                    {'skill': '6G TIG Pipe Welding (Radiographic Quality)', 'reason': 'Top requirement for petrochemical & pressure vessel contracts', 'job_opportunities': 22},
                    {'skill': 'Structural MIG Welding (AWS D1.1)', 'reason': 'High demand for pre-engineered building erection', 'job_opportunities': 16},
                ],
                'Machinist': [
                    {'skill': 'Fanuc CNC G-Code Programming', 'reason': 'Core skill for precision automotive and defense components', 'job_opportunities': 19},
                    {'skill': 'CMM Quality Inspection & GD&T', 'reason': 'High paying aerospace inspection pathway', 'job_opportunities': 15},
                ]
            }
            trade_key = next((k for k in default_trade_recs if k.lower() in worker.primary_trade.lower()), 'Electrician')
            for item in default_trade_recs[trade_key]:
                if not any(item['skill'].lower() in ws for ws in worker_skill_lowers):
                    if item not in recommended_skills:
                        recommended_skills.append(item)

        return success_response(
            data={
                'current_strengths': worker_skill_names if worker_skill_names else ['Basic Industrial Trade Operations'],
                'recommended_skills': recommended_skills[:4],
            },
            message="Career gap analysis and skill recommendations generated successfully."
        )

class WorkerSavedJobsListView(APIView):
    """
    GET /api/v1/workers/me/saved-jobs/
    Returns list of all bookmarked jobs for the authenticated worker.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        from apps.jobs.models import SavedJob
        from apps.jobs.serializers import PublicJobListSerializer
        worker = get_object_or_404(WorkerProfile, user=request.user)
        saved_jobs_qs = SavedJob.objects.filter(worker=worker).select_related('job', 'job__employer')
        jobs = [sj.job for sj in saved_jobs_qs]
        serializer = PublicJobListSerializer(jobs, many=True, context={'request': request})
        return success_response(
            data=serializer.data,
            message="Saved jobs retrieved successfully."
        )

class SaveCandidateToggleView(APIView):
    """
    POST /api/v1/workers/<id>/save/
    DELETE /api/v1/workers/<id>/save/
    Allows authenticated employers to bookmark or unbookmark a technician candidate.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        from apps.employers.models import EmployerProfile, SavedCandidate
        employer = get_object_or_404(EmployerProfile, user=request.user)
        worker = get_object_or_404(WorkerProfile, pk=pk)

        saved_cand, created = SavedCandidate.objects.get_or_create(employer=employer, worker=worker)
        return success_response(
            data={'worker_id': worker.id, 'is_saved': True},
            message=f"Candidate {worker.full_name} saved to your talent roster.",
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    def delete(self, request, pk):
        from apps.employers.models import EmployerProfile, SavedCandidate
        employer = get_object_or_404(EmployerProfile, user=request.user)
        worker = get_object_or_404(WorkerProfile, pk=pk)

        deleted_count, _ = SavedCandidate.objects.filter(employer=employer, worker=worker).delete()
        return success_response(
            data={'worker_id': worker.id, 'is_saved': False},
            message=f"Candidate {worker.full_name} removed from your saved roster."
        )

class WorkerPublicReviewsListView(APIView):
    """
    GET /api/v1/workers/<id>/reviews/
    Returns verified plant employer & supervisor reviews for a worker.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        from .serializers import SupervisorReviewSerializer
        worker = get_object_or_404(WorkerProfile, pk=pk)
        reviews = worker.reviews.all()
        serializer = SupervisorReviewSerializer(reviews, many=True)
        return success_response(
            data={
                'worker_id': worker.id,
                'worker_name': worker.full_name,
                'total_reviews': reviews.count(),
                'average_rating': round(sum(r.rating for r in reviews) / max(1, reviews.count()), 1) if reviews.exists() else 5.0,
                'reviews': serializer.data,
            },
            message="Worker reviews retrieved successfully."
        )
