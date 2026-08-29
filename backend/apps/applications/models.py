from django.db import models
from django.conf import settings

class Application(models.Model):
    class StageChoices(models.TextChoices):
        APPLIED = 'Applied', 'Applied'
        SCREENING = 'Screening', 'Under Screening'
        SHORTLISTED = 'Shortlisted', 'Shortlisted'
        INTERVIEW = 'Interview', 'Interview / Trade Test'
        SELECTED = 'Selected', 'Selected'
        HIRED = 'Hired', 'Hired'
        REJECTED = 'Rejected', 'Rejected'
        WITHDRAWN = 'Withdrawn', 'Withdrawn'

    job = models.ForeignKey('jobs.Job', on_delete=models.CASCADE, related_name='applications')
    worker = models.ForeignKey('workers.WorkerProfile', on_delete=models.CASCADE, related_name='applications')
    current_stage = models.CharField(
        max_length=30,
        choices=StageChoices.choices,
        default=StageChoices.APPLIED,
        db_index=True
    )
    match_score = models.PositiveIntegerField(default=92, db_index=True, help_text='AI calculated compatibility percentage')
    employer_notes = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('job', 'worker')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['job', 'current_stage']),
            models.Index(fields=['worker', 'current_stage']),
            models.Index(fields=['current_stage', 'match_score']),
        ]

    def __str__(self):
        return f"{self.worker.full_name} for {self.job.title} ({self.current_stage})"

class ApplicationTimelineEvent(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='timeline_events')
    stage = models.CharField(max_length=30, choices=Application.StageChoices.choices)
    timestamp = models.DateTimeField(auto_now_add=True)
    note = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.application} - {self.stage}"

class Interview(models.Model):
    class InterviewTypeChoices(models.TextChoices):
        TRADE_TEST = 'TRADE_TEST', 'In-person Trade Test'
        VIDEO_CALL = 'VIDEO_CALL', 'Video Technical Screening'
        IN_PERSON = 'IN_PERSON', 'In-person Interview'
        PLANT_VISIT = 'PLANT_VISIT', 'Plant Walkthrough'
        PHONE = 'PHONE', 'Phone Screening'

    class StatusChoices(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        NO_SHOW = 'NO_SHOW', 'No Show'

    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='interview')
    scheduled_at = models.DateTimeField(null=True, blank=True, db_index=True)
    date = models.DateField(null=True, blank=True, db_index=True)
    time = models.CharField(max_length=50, default='10:00 AM IST')
    interview_type = models.CharField(
        max_length=50,
        choices=InterviewTypeChoices.choices,
        default=InterviewTypeChoices.TRADE_TEST,
        db_index=True
    )
    location = models.CharField(max_length=300, default='Plant Maintenance Workshop, Vijayawada')
    meeting_link = models.CharField(max_length=500, blank=True, null=True)
    location_or_link = models.CharField(max_length=500, blank=True, null=True)
    instructions = models.TextField(default='Please bring original trade certificates and government ID.')
    interviewer_name = models.CharField(max_length=200, default='Plant Operations Team')
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.SCHEDULED,
        db_index=True
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='scheduled_interviews'
    )
    feedback = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Interview for {self.application.worker.full_name} ({self.status})"
