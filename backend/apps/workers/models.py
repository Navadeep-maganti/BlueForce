from django.db import models
from django.conf import settings

class Skill(models.Model):
    name = models.CharField(max_length=150, unique=True, db_index=True)
    category = models.CharField(max_length=100, default='General Trade', db_index=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.category})"

class WorkerProfile(models.Model):
    class AvailabilityChoices(models.TextChoices):
        AVAILABLE_NOW = 'available_now', 'Available Immediately'
        IN_TWO_WEEKS = 'in_two_weeks', 'Available in 2 Weeks'
        EMPLOYED_OPEN = 'employed_open', 'Employed but Open to Offers'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='worker_profile'
    )
    full_name = models.CharField(max_length=200, db_index=True)
    primary_trade = models.CharField(max_length=200, db_index=True, help_text='e.g. Industrial Electrician, CNC Machinist')
    tagline = models.CharField(max_length=300, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=255, default='Vijayawada, Andhra Pradesh')
    city = models.CharField(max_length=100, default='Vijayawada', db_index=True)
    state = models.CharField(max_length=100, default='Andhra Pradesh')
    pin_code = models.CharField(max_length=10, default='520001')
    preferred_radius_km = models.PositiveIntegerField(default=25)
    
    availability = models.CharField(
        max_length=30,
        choices=AvailabilityChoices.choices,
        default=AvailabilityChoices.AVAILABLE_NOW,
        db_index=True
    )
    expected_salary_min = models.PositiveIntegerField(default=25000)
    expected_salary_max = models.PositiveIntegerField(default=32000)
    years_of_experience = models.PositiveIntegerField(default=5, db_index=True)
    education = models.CharField(max_length=255, default='ITI Electrical Diploma')
    languages = models.JSONField(default=list, help_text='List of spoken languages')
    profile_strength_percent = models.PositiveIntegerField(default=88)

    # 100-Point Algorithmic Trust Score Components
    trust_score_total = models.PositiveIntegerField(default=91, db_index=True)
    trust_identity_score = models.PositiveIntegerField(default=20, help_text='Max 20 pts (Aadhaar biometric validation)')
    trust_certifications_score = models.PositiveIntegerField(default=18, help_text='Max 20 pts (NCVT/CEIG verified certs)')
    trust_skills_score = models.PositiveIntegerField(default=19, help_text='Max 20 pts (Standardized trade assessments)')
    trust_experience_score = models.PositiveIntegerField(default=15, help_text='Max 15 pts (Employer-verified tenures)')
    trust_reviews_score = models.PositiveIntegerField(default=10, help_text='Max 15 pts (Supervisor ratings)')
    trust_completed_jobs_score = models.PositiveIntegerField(default=9, help_text='Max 10 pts (Authenticated photo proof of works)')

    bookmarked_job_ids = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-trust_score_total', '-created_at']
        indexes = [
            models.Index(fields=['primary_trade', 'city']),
            models.Index(fields=['trust_score_total', 'availability']),
        ]

    def calculate_trust_score(self):
        """Calculates and updates the cumulative Trust Score out of 100 points via verification service."""
        try:
            from apps.verification.services import calculate_trust_score as calc_ts
            res = calc_ts(self)
            bd = res.get('breakdown', {})
            self.trust_identity_score = bd.get('identity_verification', 15)
            self.trust_certifications_score = bd.get('certifications', 20)
            self.trust_skills_score = bd.get('skills', 20)
            self.trust_experience_score = bd.get('experience', 15)
            self.trust_reviews_score = bd.get('reviews', 15)
            self.trust_completed_jobs_score = bd.get('proof_of_work', 15)
            self.trust_score_total = res.get('score', 91)
        except Exception:
            total = (
                min(15, self.trust_identity_score) +
                min(20, self.trust_certifications_score) +
                min(20, self.trust_skills_score) +
                min(15, self.trust_experience_score) +
                min(15, self.trust_reviews_score) +
                min(15, self.trust_completed_jobs_score)
            )
            self.trust_score_total = min(100, total)
        
        self.save(update_fields=[
            'trust_score_total',
            'trust_identity_score',
            'trust_certifications_score',
            'trust_skills_score',
            'trust_experience_score',
            'trust_reviews_score',
            'trust_completed_jobs_score',
            'updated_at'
        ])
        return self.trust_score_total

    def __str__(self):
        return f"{self.full_name} — {self.primary_trade} (Trust: {self.trust_score_total})"

class WorkerSkill(models.Model):
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=150, db_index=True)
    category = models.CharField(max_length=100, default='Electrical')
    level = models.PositiveSmallIntegerField(default=5, help_text='Star rating 1 to 5')
    years_experience = models.PositiveIntegerField(default=4)
    is_verified = models.BooleanField(default=True, db_index=True)
    verification_source = models.CharField(max_length=200, blank=True, null=True, help_text='e.g. NCVT Trade Assessment')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-level', '-years_experience']

    def __str__(self):
        return f"{self.worker.full_name} - {self.skill_name} ({self.level}★)"

class Certification(models.Model):
    class StatusChoices(models.TextChoices):
        VERIFIED = 'verified', 'Verified ✓'
        PENDING = 'pending', 'Pending Verification'
        REJECTED = 'rejected', 'Rejected'

    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='certifications')
    title = models.CharField(max_length=255)
    issuing_body = models.CharField(max_length=255, help_text='e.g. NCVT, SCGJ, CEIG')
    issue_date = models.DateField()
    expiry_date = models.DateField(blank=True, null=True)
    credential_id = models.CharField(max_length=150, unique=True, db_index=True)
    document_url = models.URLField(max_length=500, blank=True, null=True)
    verification_status = models.CharField(
        max_length=20,
        choices=StatusChoices.choices,
        default=StatusChoices.VERIFIED,
        db_index=True
    )
    verified_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-issue_date']

    def __str__(self):
        return f"{self.title} - {self.worker.full_name}"

class WorkExperience(models.Model):
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='experiences')
    job_title = models.CharField(max_length=200)
    company_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField()
    skills_used = models.JSONField(default=list)
    is_employer_verified = models.BooleanField(default=True, db_index=True)
    verifier_contact = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"

class ProofOfWork(models.Model):
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='proof_of_works')
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=150, default='Industrial Electrical', db_index=True)
    images = models.JSONField(default=list, help_text='List of image URLs of completed machinery/installations')
    skills_demonstrated = models.JSONField(default=list)
    client_or_employer = models.CharField(max_length=255)
    location = models.CharField(max_length=200)
    completion_date = models.DateField()
    is_verified = models.BooleanField(default=True, db_index=True)
    verified_by = models.CharField(max_length=200, blank=True, null=True)
    rating = models.FloatField(default=5.0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-completion_date']

    def __str__(self):
        return f"Proof: {self.title} by {self.worker.full_name}"

class SupervisorReview(models.Model):
    reviewer = models.ForeignKey(
        'employers.EmployerProfile',
        on_delete=models.SET_NULL,
        related_name='submitted_reviews',
        blank=True,
        null=True
    )
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='reviews')
    application = models.ForeignKey(
        'applications.Application',
        on_delete=models.SET_NULL,
        related_name='reviews',
        blank=True,
        null=True
    )
    reviewer_name = models.CharField(max_length=200, default='Plant Supervisor')
    reviewer_company = models.CharField(max_length=255, default='Industrial Employer')
    rating = models.FloatField(default=5.0)
    skill_rating = models.FloatField(default=5.0)
    reliability_rating = models.FloatField(default=5.0)
    comment = models.TextField()
    date = models.DateField(auto_now_add=True)
    verified_hire = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review ({self.rating}★) for {self.worker.full_name} by {self.reviewer_name}"

class CareerRecommendation(models.Model):
    worker = models.ForeignKey(WorkerProfile, on_delete=models.CASCADE, related_name='career_recommendations')
    recommended_skill = models.CharField(max_length=200)
    unlocks_jobs_count = models.PositiveIntegerField(default=18)
    avg_salary_boost = models.CharField(max_length=100, default='+₹8,000 / month')
    course_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-unlocks_jobs_count']

    def __str__(self):
        return f"Rec for {self.worker.full_name}: {self.recommended_skill}"
