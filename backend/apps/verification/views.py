from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from .models import VerificationDocument
from apps.workers.models import WorkerProfile, Certification
from apps.employers.models import EmployerProfile
from apps.notifications.models import Notification
from apps.notifications.services import create_notification
from .serializers import (
    VerificationDocumentSubmitSerializer,
    VerificationDocumentSerializer,
    VerificationReviewSerializer,
)
from common.responses import success_response, error_response
from common.permissions import IsWorker, IsAdmin
from common.pagination import StandardResultsSetPagination

class WorkerDocumentSubmitView(APIView):
    """
    POST /api/v1/verification/submit/
    Worker uploads an identity document, technical certification, or trade license.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def post(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        serializer = VerificationDocumentSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Document submission validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        doc = serializer.save(
            entity_type='worker',
            worker=worker,
            status=VerificationDocument.StatusChoices.PENDING
        )

        Notification.objects.create(
            user=request.user,
            title="Document Submitted for Verification 📄",
            message=f"Your {doc.doc_type} ({doc.doc_number}) was received and is in the moderator queue.",
            notification_type='verification',
            action_url='/worker/profile'
        )

        return success_response(
            data=VerificationDocumentSerializer(doc).data,
            message="Document submitted successfully and queued for verification.",
            status_code=status.HTTP_201_CREATED
        )

class WorkerMyDocumentsListView(APIView):
    """
    GET /api/v1/verification/my-documents/
    Returns all verification documents submitted by the authenticated worker.
    """
    permission_classes = [IsAuthenticated, IsWorker]

    def get(self, request):
        worker = get_object_or_404(WorkerProfile, user=request.user)
        documents = VerificationDocument.objects.filter(worker=worker)
        serializer = VerificationDocumentSerializer(documents, many=True)
        return success_response(
            data=serializer.data,
            message="Verification documents retrieved."
        )

class AdminVerificationQueueListView(APIView):
    """
    GET /api/v1/admin/verifications/
    Retrieves the document verification moderation queue for administrators.
    Supports filters:
    - ?status= (PENDING, APPROVED, REJECTED, all)
    - ?doc_type=
    - ?entity_type= (worker, employer)
    """
    permission_classes = [IsAuthenticated, IsAdmin]
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        status_param = request.query_params.get('status')
        doc_type_param = request.query_params.get('doc_type')
        entity_type_param = request.query_params.get('entity_type')

        docs = VerificationDocument.objects.all().select_related('worker', 'worker__user', 'employer')

        if status_param and status_param.lower() != 'all':
            if status_param.upper() in ['APPROVED', 'VERIFIED']:
                docs = docs.filter(status__in=[VerificationDocument.StatusChoices.APPROVED, 'verified'])
            elif status_param.upper() in ['PENDING']:
                docs = docs.filter(status__in=[VerificationDocument.StatusChoices.PENDING, 'pending'])
            elif status_param.upper() in ['REJECTED']:
                docs = docs.filter(status__in=[VerificationDocument.StatusChoices.REJECTED, 'rejected'])
            else:
                docs = docs.filter(status__iexact=status_param)

        if doc_type_param and doc_type_param.lower() != 'all':
            docs = docs.filter(doc_type__icontains=doc_type_param)

        if entity_type_param and entity_type_param.lower() != 'all':
            docs = docs.filter(entity_type__iexact=entity_type_param)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(docs, request)
        serializer = VerificationDocumentSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)

class AdminVerificationApproveView(APIView):
    """
    POST /api/v1/admin/verifications/<id>/approve/
    Admin approves a document, updates worker trust score, and dispatches notification.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        doc = get_object_or_404(VerificationDocument.objects.select_related('worker', 'worker__user', 'employer'), pk=pk)

        doc.status = VerificationDocument.StatusChoices.APPROVED
        doc.reviewed_by = request.user.username
        doc.reviewed_at = timezone.now()
        doc.rejection_reason = None
        doc.save()

        # Update entity and recalculate trust score
        if doc.worker:
            worker = doc.worker
            if 'IDENTITY' in doc.doc_type.upper() or 'AADHAAR' in doc.doc_type.upper():
                worker.user.is_verified = True
                worker.user.save(update_fields=['is_verified'])
                worker.trust_identity_score = 15

            elif 'CERTIFICATE' in doc.doc_type.upper() or 'DIPLOMA' in doc.doc_type.upper() or 'LICENSE' in doc.doc_type.upper():
                cert = Certification.objects.filter(worker=worker, credential_id=doc.doc_number).first()
                if cert:
                    cert.verification_status = 'verified'
                    cert.verified_at = timezone.now()
                    cert.save()

            # Recalculate 100-point trust score
            worker.calculate_trust_score()

            # Send Notification
            create_notification(
                user=worker.user,
                notification_type='VERIFICATION_APPROVED',
                title="Document Verified! ✓ 🛡️",
                message=f"Your {doc.doc_type} has been verified by platform administrators (+Trust Score updated to {worker.trust_score_total}).",
                related_object_id=doc.id,
                action_url='/worker/profile'
            )

        elif doc.employer:
            employer = doc.employer
            employer.is_verified = True
            employer.verification_badge = 'Verified Plant Employer'
            employer.save(update_fields=['is_verified', 'verification_badge'])

        return success_response(
            data=VerificationDocumentSerializer(doc).data,
            message="Document approved successfully and Trust Score recalculated."
        )

class AdminVerificationRejectView(APIView):
    """
    POST /api/v1/admin/verifications/<id>/reject/
    Admin rejects a document with an explainable reason.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        doc = get_object_or_404(VerificationDocument.objects.select_related('worker', 'worker__user', 'employer'), pk=pk)

        serializer = VerificationReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Reject validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        reason = serializer.validated_data.get('rejection_reason') or 'Document image was unreadable or credentials could not be validated.'
        doc.status = VerificationDocument.StatusChoices.REJECTED
        doc.reviewed_by = request.user.username
        doc.reviewed_at = timezone.now()
        doc.rejection_reason = reason
        doc.save()

        if doc.worker:
            doc.worker.calculate_trust_score()
            create_notification(
                user=doc.worker.user,
                notification_type='VERIFICATION_REJECTED',
                title="Document Verification Notice ⚠️",
                message=f"Your {doc.doc_type} could not be verified: {reason}. Please re-upload a clear copy.",
                related_object_id=doc.id,
                action_url='/worker/profile'
            )

        return success_response(
            data=VerificationDocumentSerializer(doc).data,
            message="Document marked as rejected."
        )
