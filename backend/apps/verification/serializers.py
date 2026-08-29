from rest_framework import serializers
from .models import VerificationDocument

ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png']
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 # 10 MB

class VerificationDocumentSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationDocument
        fields = [
            'doc_type',
            'doc_number',
            'file_url',
            'document_file',
            'notes',
        ]

    def validate_document_file(self, value):
        if value:
            import os
            ext = os.path.splitext(value.name)[1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise serializers.ValidationError(
                    f"Unsupported file format '{ext}'. Allowed formats: {ALLOWED_EXTENSIONS}"
                )
            if value.size > MAX_FILE_SIZE_BYTES:
                raise serializers.ValidationError("File size exceeds 10MB limit.")
        return value

    def validate(self, attrs):
        if not attrs.get('document_file') and not attrs.get('file_url'):
            raise serializers.ValidationError("Please provide either a document file upload or a valid document URL.")
        return attrs

class VerificationDocumentSerializer(serializers.ModelSerializer):
    entity_name = serializers.SerializerMethodField()
    entity_trade = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    submitted_date = serializers.SerializerMethodField()

    class Meta:
        model = VerificationDocument
        fields = [
            'id',
            'entity_type',
            'worker',
            'employer',
            'entity_name',
            'entity_trade',
            'avatar_url',
            'doc_type',
            'doc_number',
            'file_url',
            'document_file',
            'notes',
            'status',
            'reviewed_by',
            'reviewed_at',
            'rejection_reason',
            'submitted_date',
            'submitted_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'entity_type', 'worker', 'employer', 'status',
            'reviewed_by', 'reviewed_at', 'submitted_at', 'updated_at'
        ]

    def get_entity_name(self, obj):
        if obj.worker:
            return obj.worker.full_name
        elif obj.employer:
            return obj.employer.company_name
        return "Unknown Entity"

    def get_entity_trade(self, obj):
        if obj.worker:
            return obj.worker.primary_trade
        elif obj.employer:
            return obj.employer.trade_industry
        return ""

    def get_avatar_url(self, obj):
        if obj.worker and obj.worker.user:
            return obj.worker.user.avatar_url
        elif obj.employer:
            return obj.employer.logo_url
        return None

    def get_submitted_date(self, obj):
        return obj.submitted_at.strftime("%b %d, %Y")

class VerificationReviewSerializer(serializers.Serializer):
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
