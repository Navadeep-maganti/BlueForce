from django.db import models
from django.conf import settings

class Notification(models.Model):
    class TypeChoices(models.TextChoices):
        APPLICATION_RECEIVED = 'APPLICATION_RECEIVED', 'Application Received'
        APPLICATION_STATUS_CHANGED = 'APPLICATION_STATUS_CHANGED', 'Application Status Changed'
        SHORTLISTED = 'SHORTLISTED', 'Candidate Shortlisted'
        INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED', 'Interview Scheduled'
        INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED', 'Interview Cancelled'
        VERIFICATION_APPROVED = 'VERIFICATION_APPROVED', 'Verification Approved'
        VERIFICATION_REJECTED = 'VERIFICATION_REJECTED', 'Verification Rejected'
        JOB_RECOMMENDATION = 'JOB_RECOMMENDATION', 'Job Recommendation'
        GENERAL = 'GENERAL', 'General Notice'
        # Legacy aliases
        JOB_MATCH = 'job_match', 'High Match Job Alert'
        APPLICATION_UPDATE = 'application_update', 'Application Status Update'
        INTERVIEW = 'interview', 'Interview Scheduled'
        VERIFICATION = 'verification', 'Trust Score / Document Update'
        SYSTEM = 'system', 'System Notice'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=50,
        choices=TypeChoices.choices,
        default=TypeChoices.GENERAL,
        db_index=True
    )
    related_object_id = models.PositiveIntegerField(blank=True, null=True, db_index=True)
    is_read = models.BooleanField(default=False, db_index=True)
    action_url = models.CharField(max_length=300, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['notification_type', 'created_at']),
        ]

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title} ({self.notification_type})"
