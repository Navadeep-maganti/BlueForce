from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import PlatformReport
from .serializers import (
    PlatformReportSerializer,
    PlatformReportCreateSerializer,
    AdminReportUpdateSerializer,
)
from common.responses import success_response, error_response
from common.permissions import IsAdmin

class ReportSubmitView(APIView):
    """
    POST /api/v1/reports/
    Allows authenticated users (workers or employers) to file a trust & safety report
    against fake jobs, fake certificates, fraud, or inappropriate behavior.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PlatformReportCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Report submission validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        reporter_name = getattr(request.user, 'full_name', '') or getattr(request.user, 'name', '') or request.user.email
        report = serializer.save(
            reporter=request.user,
            reporter_name=reporter_name,
            status=PlatformReport.StatusChoices.OPEN
        )

        return success_response(
            data=PlatformReportSerializer(report).data,
            message="Platform report submitted successfully. Our trust and safety team will review it.",
            status_code=status.HTTP_201_CREATED
        )

class AdminReportQueueListView(APIView):
    """
    GET /api/v1/admin/reports/
    Returns trust & safety moderation queue for admin operators.
    Supports filters:
    - ?status=OPEN | UNDER_REVIEW | RESOLVED | DISMISSED
    - ?report_type=FAKE_JOB | FAKE_CERTIFICATE | FRAUD | INAPPROPRIATE_CONTENT | OTHER
    - ?entity_type=job | employer | worker | certificate
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        reports = PlatformReport.objects.all()

        status_param = request.query_params.get('status')
        if status_param and status_param.upper() != 'ALL':
            reports = reports.filter(status__iexact=status_param)

        type_param = request.query_params.get('report_type')
        if type_param and type_param.upper() != 'ALL':
            reports = reports.filter(report_type__iexact=type_param)

        entity_param = request.query_params.get('entity_type')
        if entity_param and entity_param.lower() != 'all':
            reports = reports.filter(reported_entity_type__iexact=entity_param)

        serializer = PlatformReportSerializer(reports, many=True)
        return success_response(
            data=serializer.data,
            message="Admin moderation reports queue retrieved successfully."
        )

class AdminReportUpdateView(APIView):
    """
    PATCH /api/v1/admin/reports/<id>/
    Updates moderation report status (OPEN -> UNDER_REVIEW -> RESOLVED -> DISMISSED)
    with admin resolution notes and enforcement action taken.
    """
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, pk):
        report = get_object_or_404(PlatformReport, pk=pk)
        serializer = AdminReportUpdateSerializer(report, data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message="Report status update failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )

        updated_report = serializer.save(resolved_by=request.user)
        return success_response(
            data=PlatformReportSerializer(updated_report).data,
            message=f"Report #{report.id} updated to '{updated_report.get_status_display()}'."
        )
