from django.contrib import admin
from .models import (
    WorkerProfile,
    WorkerSkill,
    Certification,
    WorkExperience,
    ProofOfWork,
    SupervisorReview,
    CareerRecommendation,
    Skill,
)

class WorkerSkillInline(admin.TabularInline):
    model = WorkerSkill
    extra = 1

class CertificationInline(admin.TabularInline):
    model = Certification
    extra = 1

class WorkExperienceInline(admin.StackedInline):
    model = WorkExperience
    extra = 1

class ProofOfWorkInline(admin.StackedInline):
    model = ProofOfWork
    extra = 1

@admin.register(WorkerProfile)
class WorkerProfileAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'primary_trade', 'city', 'trust_score_total', 'availability', 'years_of_experience')
    list_filter = ('primary_trade', 'availability', 'city')
    search_fields = ('full_name', 'primary_trade', 'city')
    inlines = [WorkerSkillInline, CertificationInline, WorkExperienceInline, ProofOfWorkInline]

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)
    search_fields = ('name',)

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'worker', 'issuing_body', 'credential_id', 'verification_status')
    list_filter = ('verification_status', 'issuing_body')

@admin.register(ProofOfWork)
class ProofOfWorkAdmin(admin.ModelAdmin):
    list_display = ('title', 'worker', 'category', 'client_or_employer', 'is_verified')
    list_filter = ('is_verified', 'category')
