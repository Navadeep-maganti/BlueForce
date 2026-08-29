from django.db import models

class Job(models.Model):
    class JobTypeChoices(models.TextChoices):
        FULL_TIME = 'Full-time', 'Full-time'
        CONTRACT = 'Contract', 'Contract'
        PART_TIME = 'Part-time', 'Part-time'
        SHIFT_BASED = 'Shift-based', 'Shift-based'

    class ShiftChoices(models.TextChoices):
        DAY = 'Day Shift', 'Day Shift'
        NIGHT = 'Night Shift', 'Night Shift'
        ROTATIONAL = 'Rotational', 'Rotational'
        FLEXIBLE = 'Flexible', 'Flexible'

    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        ACTIVE = 'active', 'Active / Open'
        PAUSED = 'paused', 'Paused'
        CLOSED = 'closed', 'Closed'

    employer = models.ForeignKey(
        'employers.EmployerProfile',
        on_delete=models.CASCADE,
        related_name='jobs'
    )
    title = models.CharField(max_length=255, db_index=True)
    trade_category = models.CharField(max_length=100, default='Electrical', db_index=True)
    location = models.CharField(max_length=255, default='Autonagar, Vijayawada')
    city = models.CharField(max_length=100, default='Vijayawada', db_index=True)
    distance_km = models.FloatField(default=6.0)
    salary_min = models.PositiveIntegerField(default=25000, db_index=True)
    salary_max = models.PositiveIntegerField(default=32000, db_index=True)
    salary_period = models.CharField(max_length=20, default='monthly')
    experience_required_years = models.PositiveIntegerField(default=4)
    job_type = models.CharField(
        max_length=30,
        choices=JobTypeChoices.choices,
        default=JobTypeChoices.FULL_TIME,
        db_index=True
    )
    shift = models.CharField(
        max_length=30,
        choices=ShiftChoices.choices,
        default=ShiftChoices.DAY
    )
    openings = models.PositiveIntegerField(default=4)
    joining_date = models.CharField(max_length=100, default='Immediate / Within 15 Days')
    deadline_date = models.CharField(max_length=100, default='2026-04-30')
    required_skills = models.JSONField(default=list)
    preferred_skills = models.JSONField(default=list, blank=True)
    required_certifications = models.JSONField(default=list, blank=True)
    description = models.TextField()
    benefits = models.JSONField(default=list)
    work_address = models.CharField(max_length=300, default='Plot 42, Phase-2, Autonagar Industrial Area, Vijayawada, AP')
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.ACTIVE,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['trade_category', 'city', 'status']),
            models.Index(fields=['salary_min', 'salary_max']),
            models.Index(fields=['job_type', 'shift']),
            models.Index(fields=['experience_required_years']),
        ]

    def __str__(self):
        return f"{self.title} at {self.employer.company_name} ({self.status})"

class SavedJob(models.Model):
    """
    Bookmark relationship between a worker and a saved job opening.
    """
    worker = models.ForeignKey(
        'workers.WorkerProfile',
        on_delete=models.CASCADE,
        related_name='saved_jobs'
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='saved_by_workers'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['worker', 'job'], name='unique_worker_saved_job')
        ]

    def __str__(self):
        return f"{self.worker.full_name} saved {self.job.title}"
