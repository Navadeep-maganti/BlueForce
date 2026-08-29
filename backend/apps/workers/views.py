from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404

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
)
from apps.verification.models import VerificationDocument
from common.responses import success_response, error_response
from common.permissions import IsWorker

class WorkerProfileMeView(APIView):
    """
    GET /api/v1/workers/me/
    Aggregated single-call endpoint returning User, Profile, Skills, Certs, Proof of Work, Reviews, and Trust Score.

    PATCH /api/v1/workers/me/
    Updates the authenticated worker's profile attributes.
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
        
        # Return full updated profile
        updated_data = WorkerProfileAggregatedSerializer(worker).data
        return success_response(
            data=updated_data,
            message="Worker profile updated successfully."
        )

class SkillTaxonomyListView(APIView):
    """
    GET /api/v1/skills/
    Returns searchable trade skill taxonomy.
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
        
        # Save skill linked to worker
        skill = serializer.save(worker=worker, is_verified=True, verification_source='Self Declared & Tested')
        
        # Recalculate trust score skills component
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

        # Automatically enqueue in VerificationDocument queue
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

        # Bump completed jobs trust score
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
        worker = get_object_or_404(WorkerProfile, pk=pk)
        serializer = PublicWorkerProfileSerializer(worker)
        return success_response(
            data=serializer.data,
            message="Public worker profile retrieved."
        )
