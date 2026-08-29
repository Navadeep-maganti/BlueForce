from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import EmployerProfile, SavedCandidate
from apps.workers.models import WorkerProfile
from apps.workers.serializers import CandidateDiscoveryCardSerializer
from common.responses import success_response, error_response
from common.permissions import IsEmployer

class EmployerSavedCandidatesListView(APIView):
    """
    GET /api/v1/employer/saved-candidates/
    Returns all bookmarked candidates for the authenticated employer.
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        saved_qs = SavedCandidate.objects.filter(employer=employer).select_related('worker', 'worker__user').prefetch_related('worker__skills', 'worker__certifications', 'worker__proof_of_works')
        workers = [sc.worker for sc in saved_qs]
        serializer = CandidateDiscoveryCardSerializer(workers, many=True)
        return success_response(
            data=serializer.data,
            message="Saved candidates roster retrieved successfully."
        )

class EmployerProfileMeView(APIView):
    """
    GET /api/v1/employers/me/
    PATCH /api/v1/employers/me/
    """
    permission_classes = [IsAuthenticated, IsEmployer]

    def get(self, request):
        employer = get_object_or_404(EmployerProfile, user=request.user)
        return success_response(
            data={
                'id': employer.id,
                'company_name': employer.company_name,
                'trade_industry': employer.trade_industry,
                'tagline': employer.tagline,
                'description': employer.description,
                'gst_or_cin_number': employer.gst_or_cin_number,
                'location': employer.location,
                'city': employer.city,
                'state': employer.state,
                'logo_url': employer.logo_url,
                'is_verified': employer.is_verified,
                'verification_badge': employer.verification_badge,
                'employee_count': employer.employee_count,
                'contact_person': employer.contact_person,
                'contact_email': employer.contact_email,
                'contact_phone': employer.contact_phone,
                'website': employer.website,
            },
            message="Employer profile retrieved successfully."
        )
