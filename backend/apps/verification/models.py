from django.db import models

class VerificationDocument(models.Model):
    class EntityTypeChoices(models.TextChoices):
        WORKER = 'worker', 'Worker'
        EMPLOYER = 'employer', 'Employer'

    class DocTypeChoices(models.TextChoices):
        AADHAAR = 'Aadhaar / National ID', 'Aadhaar / National ID'
        ITI_DIPLOMA = 'ITI Diploma', 'ITI Diploma'
        TRADE_LICENSE = 'Trade License', 'Trade License'
        GST = 'GST Certificate', 'GST Certificate'
        EXPERIENCE_LETTER = 'Experience Letter', 'Experience Letter'

    class StatusChoices(models.TextChoices):
        VERIFIED = 'verified', 'Verified ✓'
        PENDING = 'pending', 'Pending Review'
        REJECTED = 'rejected', 'Rejected'

    entity_type = models.CharField(
        max_length=20,
        choices=EntityTypeChoices.choices,
        default=EntityTypeChoices.WORKER,
        db_index=True
    )
    worker = models.ForeignKey(
        'workers.WorkerProfile',
        on_delete=models.CASCADE,
        related_name='verification_documents',
        blank=True,
        null=True
    )
    employer = models.ForeignKey(
        'employers.EmployerProfile',
        on_delete=models.CASCADE,
        related_name='verification_documents',
        blank=True,
        null=True
    )
    doc_type = models.CharField(
        max_length=50,
        choices=DocTypeChoices.choices,
        default=DocTypeChoices.AADHAAR,
        db_index=True
    )
    doc_number = models.CharField(max_length=150, db_index=True)
    file_url = models.URLField(max_length=500)
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING,
        db_index=True
    )
    reviewed_by = models.CharField(max_length=150, blank=True, null=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['status', 'entity_type']),
            models.Index(fields=['doc_type', 'status']),
        ]

    def __str__(self):
        entity_name = self.worker.full_name if self.worker else (self.employer.company_name if self.employer else 'Unknown')
        return f"{self.doc_type} for {entity_name} ({self.status})"
