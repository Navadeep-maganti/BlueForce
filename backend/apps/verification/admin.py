from django.contrib import admin
from .models import VerificationDocument

@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ('doc_type', 'entity_type', 'doc_number', 'status', 'submitted_at', 'reviewed_by')
    list_filter = ('status', 'doc_type', 'entity_type', 'submitted_at')
    search_fields = ('doc_number', 'worker__full_name', 'employer__company_name')
