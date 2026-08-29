from django.db import models

class VerificationDocument(models.Model):
    class EntityTypeChoices(models.TextChoices):
        WORKER = 'worker', 'Worker'
        EMPLOYER = 'employer', 'Employer'

    class DocTypeChoices(models.TextChoices):
        IDENTITY = 'IDENTITY', 'Identity / National ID'
        CERTIFICATE = 'CERTIFICATE', 'Trade / Technical Certificate'
        TRADE_LICENSE = 'TRADE_LICENSE', 'Trade License'
        OTHER = 'OTHER', 'Other Document'
        # Legacy Aliases
        AADHAAR = 'Aadhaar / National ID', 'Aadhaar / National ID'
        ITI_DIPLOMA = 'ITI Diploma', 'ITI Diploma'
        GST = 'GST Certificate', 'GST Certificate'
        EXPERIENCE_LETTER = 'Experience Letter', 'Experience Letter'

    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        APPROVED = 'APPROVED', 'Approved / Verified'
        REJECTED = 'REJECTED', 'Rejected'
        # Legacy Aliases
        VERIFIED_LEGACY = 'verified', 'Verified ✓'
        PENDING_LEGACY = 'pending', 'Pending Review'
        REJECTED_LEGACY = 'rejected', 'Rejected'

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
        default=DocTypeChoices.IDENTITY,
        db_index=True
    )
    doc_number = models.CharField(max_length=150, db_index=True)
    file_url = models.CharField(max_length=500, blank=True, null=True)
    document_file = models.FileField(upload_to='verification_docs/%Y/%m/', blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
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

    def is_approved(self):
        return self.status in [self.StatusChoices.APPROVED, self.StatusChoices.VERIFIED_LEGACY]

    def __str__(self):
        entity_name = self.worker.full_name if self.worker else (self.employer.company_name if self.employer else 'Unknown')
        return f"{self.doc_type} for {entity_name} ({self.status})"
