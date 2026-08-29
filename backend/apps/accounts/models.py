from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        WORKER = 'worker', 'Worker'
        EMPLOYER = 'employer', 'Employer'
        ADMIN = 'admin', 'Admin'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.WORKER,
        db_index=True,
        help_text='Designates the role of the user on KaushalConnect'
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True, help_text='City, State')
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    language_preference = models.CharField(
        max_length=10,
        choices=[('en', 'English'), ('te', 'Telugu'), ('hi', 'Hindi')],
        default='en'
    )
    is_verified = models.BooleanField(
        default=False, 
        db_index=True,
        help_text='Government ID or GST verification status'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['role', 'is_verified']),
        ]

    def __str__(self):
        return f"{self.username} ({self.role})"
