from django.db import models
from django.conf import settings

class PlatformReport(models.Model):
    class ReportTypeChoices(models.TextChoices):
        FAKE_JOB = 'FAKE_JOB', 'Fake / Misleading Job Posting'
        FAKE_CERTIFICATE = 'FAKE_CERTIFICATE', 'Fake / Tampered Certificate'
        FRAUD = 'FRAUD', 'Fraud / Extortion / Delayed Payment'
        INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT', 'Inappropriate / Offensive Content'
        OTHER = 'OTHER', 'Other Safety Issue'

    class StatusChoices(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        UNDER_REVIEW = 'UNDER_REVIEW', 'Under Review'
        RESOLVED = 'RESOLVED', 'Resolved'
        DISMISSED = 'DISMISSED', 'Dismissed'

    class EntityTypeChoices(models.TextChoices):
        JOB = 'job', 'Job Posting'
        EMPLOYER = 'employer', 'Employer / Plant'
        WORKER = 'worker', 'Worker'
        CERTIFICATE = 'certificate', 'Certificate'
        OTHER = 'other', 'Other'

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
    reported_entity_id = models.CharField(max_length=100, blank=True, null=True)
    report_type = models.CharField(
        max_length=50,
        choices=ReportTypeChoices.choices,
        default=ReportTypeChoices.FAKE_JOB,
        db_index=True
    )
    description = models.TextField()
    evidence_url = models.URLField(max_length=500, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.OPEN,
        db_index=True
    )
    resolution_notes = models.TextField(blank=True, null=True)
    action_taken = models.CharField(max_length=255, blank=True, null=True)
    resolved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='resolved_reports'
    )
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reported_at']
        indexes = [
            models.Index(fields=['status', 'report_type']),
        ]

    def __str__(self):
        return f"[{self.status}] {self.get_report_type_display()} against {self.reported_entity_name}"
