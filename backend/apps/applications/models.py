from django.db import models

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
        TRADE_TEST = 'In-person Trade Test', 'In-person Trade Test (Plant Workshop)'
        VIDEO_CALL = 'Video Call', 'Video Technical Screening'
        PHONE = 'Phone Screening', 'Phone Screening'
        PLANT_VISIT = 'Plant Visit', 'Plant Walkthrough'

    class StatusChoices(models.TextChoices):
        SCHEDULED = 'scheduled', 'Scheduled'
        COMPLETED = 'completed', 'Completed'
        RESCHEDULED = 'rescheduled', 'Rescheduled'
        CANCELLED = 'cancelled', 'Cancelled'

    application = models.OneToOneField(Application, on_delete=models.CASCADE, related_name='interview')
    date = models.DateField(db_index=True)
    time = models.CharField(max_length=50, default='10:00 AM IST')
    interview_type = models.CharField(
        max_length=50,
        choices=InterviewTypeChoices.choices,
        default=InterviewTypeChoices.TRADE_TEST
    )
    location_or_link = models.CharField(max_length=300, default='ABC Industries Main Plant, Maintenance Bay 4, Autonagar, Vijayawada')
    instructions = models.TextField(default='Please bring original trade certificates and safety boots.')
    interviewer_name = models.CharField(max_length=200, default='K. Satyanarayana (General Manager - Operations)')
    status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.SCHEDULED,
        db_index=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return f"Interview for {self.application.worker.full_name} on {self.date}"
