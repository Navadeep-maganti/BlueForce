from django.db import models
from django.conf import settings

class PlatformReport(models.Model):
    class EntityTypeChoices(models.TextChoices):
        JOB = 'job', 'Job Posting'
        EMPLOYER = 'employer', 'Employer / Plant'
        WORKER = 'worker', 'Worker'
        CERTIFICATE = 'certificate', 'Certificate'

    class ReasonChoices(models.TextChoices):
        FAKE_JOB = 'Fake Job', 'Fake / Bogus Job Posting'
        FRAUDULENT_CERT = 'Fraudulent Certificate', 'Fraudulent Certificate'
        UNSAFE = 'Unsafe Workplace', 'Unsafe Workplace'
        HARASSMENT = 'Harassment', 'Harassment'
        PAYMENT_DEFAULT = 'Payment Default', 'Payment Default / Wage Delay'

    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'Pending Review'
        RESOLVED = 'resolved', 'Resolved / Suspended'
        DISMISSED = 'dismissed', 'Dismissed'

    reporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='filed_reports'
    )
    reporter_name = models.CharField(max_length=200, default='Community Member')
    reported_entity_name = models.CharField(max_length=255, db_index=True)
    reported_entity_type = models.CharField(
        max_length=30,
        choices=EntityTypeChoices.choices,
        default=EntityTypeChoices.EMPLOYER,
        db_index=True
    )
    reason_category = models.CharField(
        max_length=50,
        choices=ReasonChoices.choices,
        default=ReasonChoices.FAKE_JOB,
        db_index=True
    )
    description = models.TextField()
    evidence_url = models.URLField(max_length=500, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING,
        db_index=True
    )
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reported_at']
        indexes = [
            models.Index(fields=['status', 'reason_category']),
        ]

    def __str__(self):
        return f"Report against {self.reported_entity_name} ({self.reason_category})"
