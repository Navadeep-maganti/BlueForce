from django.contrib import admin
from .models import Application, ApplicationTimelineEvent, Interview

class ApplicationTimelineEventInline(admin.TabularInline):
    model = ApplicationTimelineEvent
    extra = 1

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('worker', 'job', 'current_stage', 'match_score', 'created_at')
    list_filter = ('current_stage', 'created_at')
    search_fields = ('worker__full_name', 'job__title', 'job__employer__company_name')
    inlines = [ApplicationTimelineEventInline]

@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ('application', 'date', 'time', 'interview_type', 'status', 'interviewer_name')
    list_filter = ('status', 'interview_type', 'date')
