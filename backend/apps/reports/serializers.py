from rest_framework import serializers
from .models import PlatformReport

class PlatformReportSerializer(serializers.ModelSerializer):
    report_type_display = serializers.CharField(source='get_report_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    entity_type_display = serializers.CharField(source='get_reported_entity_type_display', read_only=True)

    class Meta:
        model = PlatformReport
        fields = [
            'id',
            'reporter_name',
            'reported_entity_name',
            'reported_entity_type',
            'entity_type_display',
            'reported_entity_id',
            'report_type',
            'report_type_display',
            'description',
            'evidence_url',
            'status',
            'status_display',
            'resolution_notes',
            'action_taken',
            'reported_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'reporter_name', 'reported_at', 'updated_at']

class PlatformReportCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformReport
        fields = [
            'reported_entity_name',
            'reported_entity_type',
            'reported_entity_id',
            'report_type',
            'description',
            'evidence_url',
        ]

    def validate_report_type(self, value):
        if value not in PlatformReport.ReportTypeChoices.values:
            raise serializers.ValidationError(
                f"Invalid report type '{value}'. Choices: {PlatformReport.ReportTypeChoices.values}"
            )
        return value

class AdminReportUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformReport
        fields = [
            'status',
            'resolution_notes',
            'action_taken',
        ]

    def validate_status(self, value):
        if value not in PlatformReport.StatusChoices.values:
            raise serializers.ValidationError(
                f"Invalid status '{value}'. Choices: {PlatformReport.StatusChoices.values}"
            )
        return value
