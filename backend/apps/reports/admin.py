from django.contrib import admin
from .models import PlatformReport

@admin.register(PlatformReport)
class PlatformReportAdmin(admin.ModelAdmin):
    list_display = ('reported_entity_name', 'reported_entity_type', 'report_type', 'status', 'reported_at')
    list_filter = ('status', 'report_type', 'reported_entity_type')
    search_fields = ('reported_entity_name', 'reporter_name', 'description')
