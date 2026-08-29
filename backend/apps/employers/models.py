from django.db import models
from django.conf import settings

class EmployerProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='employer_profile'
    )
    company_name = models.CharField(max_length=255, db_index=True)
    trade_industry = models.CharField(max_length=255, db_index=True, help_text='e.g. Industrial Precision Manufacturing, Solar Energy Solutions')
    tagline = models.CharField(max_length=300, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    gst_or_cin_number = models.CharField(max_length=50, blank=True, null=True, db_index=True, help_text='GSTIN or Corporate ID')
    location = models.CharField(max_length=255, default='Autonagar Industrial Area, Vijayawada, AP')
    city = models.CharField(max_length=100, default='Vijayawada', db_index=True)
    state = models.CharField(max_length=100, default='Andhra Pradesh')
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    is_verified = models.BooleanField(default=True, db_index=True)
    verification_badge = models.CharField(max_length=100, default='Verified Enterprise Employer')
    employee_count = models.CharField(max_length=50, default='500-1000 Employees')
    established_year = models.PositiveIntegerField(default=2008)
    contact_person = models.CharField(max_length=200, default='K. Satyanarayana (General Manager - Operations)')
    contact_email = models.EmailField(default='careers@abcindustries.in')
    contact_phone = models.CharField(max_length=50, default='+91 866 2489000')
    website = models.URLField(max_length=300, blank=True, null=True)
    bookmarked_worker_ids = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company_name', 'city']),
            models.Index(fields=['trade_industry', 'is_verified']),
        ]

    def __str__(self):
        return f"{self.company_name} ({self.city})"

class SavedCandidate(models.Model):
    """
    Bookmark relationship between an employer and a saved technician candidate.
    """
    employer = models.ForeignKey(
        EmployerProfile,
        on_delete=models.CASCADE,
        related_name='saved_candidates'
    )
    worker = models.ForeignKey(
        'workers.WorkerProfile',
        on_delete=models.CASCADE,
        related_name='saved_by_employers'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['employer', 'worker'], name='unique_employer_saved_worker')
        ]

    def __str__(self):
        return f"{self.employer.company_name} saved candidate {self.worker.full_name}"
