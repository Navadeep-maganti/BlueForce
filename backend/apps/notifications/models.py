from django.db import models
from django.conf import settings

class Notification(models.Model):
    class TypeChoices(models.TextChoices):
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
        max_length=30,
        choices=TypeChoices.choices,
        default=TypeChoices.SYSTEM,
        db_index=True
    )
    is_read = models.BooleanField(default=False, db_index=True)
    action_url = models.CharField(max_length=300, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"
