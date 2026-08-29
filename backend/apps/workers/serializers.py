from rest_framework import serializers
from .models import (
    WorkerProfile,
    Skill,
    WorkerSkill,
    Certification,
    WorkExperience,
    ProofOfWork,
    SupervisorReview,
    CareerRecommendation,
)
from apps.accounts.models import User

class SkillTaxonomySerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'description']

class WorkerSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerSkill
        fields = [
            'id',
            'skill_name',
            'category',
            'level',
            'years_experience',
            'is_verified',
            'verification_source',
            'created_at',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = [
            'id',
            'title',
            'issuing_body',
            'issue_date',
            'expiry_date',
            'credential_id',
            'document_url',
            'verification_status',
            'verified_at',
            'created_at',
        ]
        read_only_fields = ['id', 'verification_status', 'verified_at', 'created_at']

class ProofOfWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProofOfWork
        fields = [
            'id',
            'title',
            'description',
            'category',
            'images',
            'skills_demonstrated',
            'client_or_employer',
            'location',
            'completion_date',
            'is_verified',
            'verified_by',
            'rating',
            'created_at',
        ]
        read_only_fields = ['id', 'is_verified', 'verified_by', 'created_at']

class WorkExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperience
        fields = [
            'id',
            'job_title',
            'company_name',
            'location',
            'start_date',
            'end_date',
            'is_current',
            'description',
            'skills_used',
            'is_employer_verified',
            'verifier_contact',
            'created_at',
        ]
        read_only_fields = ['id', 'is_employer_verified', 'created_at']

class SupervisorReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupervisorReview
        fields = [
            'id',
            'reviewer_name',
            'reviewer_company',
            'rating',
            'comment',
            'date',
            'verified_hire',
            'created_at',
        ]
        read_only_fields = ['id', 'verified_hire', 'created_at']

class CareerRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerRecommendation
        fields = [
            'id',
            'recommended_skill',
            'unlocks_jobs_count',
            'avg_salary_boost',
            'course_url',
        ]

class WorkerProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkerProfile
        fields = [
            'full_name',
            'primary_trade',
            'tagline',
            'bio',
            'location',
            'city',
            'state',
            'pin_code',
            'preferred_radius_km',
            'availability',
            'expected_salary_min',
            'expected_salary_max',
            'years_of_experience',
            'education',
            'languages',
        ]

class WorkerProfileAggregatedSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    skills = WorkerSkillSerializer(many=True, read_only=True)
    certifications = CertificationSerializer(many=True, read_only=True)
    proof_of_work = ProofOfWorkSerializer(source='proof_of_works', many=True, read_only=True)
    experiences = WorkExperienceSerializer(many=True, read_only=True)
    reviews = SupervisorReviewSerializer(many=True, read_only=True)
    career_recommendations = CareerRecommendationSerializer(many=True, read_only=True)
    trust_score = serializers.SerializerMethodField()

    class Meta:
        model = WorkerProfile
        fields = [
            'user',
            'profile',
            'skills',
            'certifications',
            'proof_of_work',
            'experiences',
            'reviews',
            'career_recommendations',
            'trust_score',
        ]

    def get_user(self, obj):
        u = obj.user
        return {
            'id': u.id,
            'name': obj.full_name or u.username,
            'email': u.email,
            'phone': u.phone,
            'avatar_url': u.avatar_url,
            'language_preference': u.language_preference,
            'is_verified': u.is_verified,
        }

    def get_profile(self, obj):
        return {
            'id': obj.id,
            'full_name': obj.full_name,
            'primary_trade': obj.primary_trade,
            'tagline': obj.tagline,
            'bio': obj.bio,
            'location': obj.location,
            'city': obj.city,
            'state': obj.state,
            'pin_code': obj.pin_code,
            'preferred_radius_km': obj.preferred_radius_km,
            'availability': obj.availability,
            'expected_salary_min': obj.expected_salary_min,
            'expected_salary_max': obj.expected_salary_max,
            'years_of_experience': obj.years_of_experience,
            'education': obj.education,
            'languages': obj.languages,
            'profile_strength_percent': obj.profile_strength_percent,
        }

    def get_trust_score(self, obj):
        return {
            'total': obj.trust_score_total,
            'breakdown': {
                'identity': {
                    'score': obj.trust_identity_score,
                    'max': 20,
                    'label': 'Aadhaar Biometric eKYC Verified' if obj.user.is_verified else 'Pending Verification',
                },
                'certifications': {
                    'score': obj.trust_certifications_score,
                    'max': 20,
                    'verified_count': obj.certifications.filter(verification_status='verified').count(),
                },
                'skills': {
                    'score': obj.trust_skills_score,
                    'max': 20,
                    'tested_count': obj.skills.filter(is_verified=True).count(),
                },
                'experience': {
                    'score': obj.trust_experience_score,
                    'max': 15,
                    'verified_years': obj.years_of_experience,
                },
                'employer_reviews': {
                    'score': obj.trust_reviews_score,
                    'max': 15,
                    'avg_rating': 4.9,
                    'review_count': obj.reviews.count(),
                },
                'completed_jobs': {
                    'score': obj.trust_completed_jobs_score,
                    'max': 10,
                    'completed_count': obj.proof_of_works.count(),
                },
            },
        }

class CandidateDiscoveryCardSerializer(serializers.ModelSerializer):
    """
    Compact card serializer for employer candidate search and talent discovery.
    """
    avatar_url = serializers.CharField(source='user.avatar_url', read_only=True)
    is_verified = serializers.BooleanField(source='user.is_verified', read_only=True)
    top_skills = serializers.SerializerMethodField()
    proof_of_work_count = serializers.SerializerMethodField()
    verified_certs_count = serializers.SerializerMethodField()

    class Meta:
        model = WorkerProfile
        fields = [
            'id',
            'full_name',
            'primary_trade',
            'tagline',
            'location',
            'city',
            'state',
            'years_of_experience',
            'availability',
            'trust_score_total',
            'avatar_url',
            'is_verified',
            'top_skills',
            'proof_of_work_count',
            'verified_certs_count',
            'expected_salary_min',
            'expected_salary_max',
            'created_at',
        ]

    def get_top_skills(self, obj):
        return [s.skill_name for s in obj.skills.all()[:4]]

    def get_proof_of_work_count(self, obj):
        return obj.proof_of_works.count()

    def get_verified_certs_count(self, obj):
        return obj.certifications.filter(verification_status='verified').count()

class PublicWorkerProfileSerializer(serializers.ModelSerializer):
    """
    Sanitized public profile for employers:
    Hides private phone numbers, emails, and sensitive Aadhaar details.
    """
    skills = WorkerSkillSerializer(many=True, read_only=True)
    certifications = serializers.SerializerMethodField()
    proof_of_work = ProofOfWorkSerializer(source='proof_of_works', many=True, read_only=True)
    experiences = WorkExperienceSerializer(many=True, read_only=True)
    reviews = SupervisorReviewSerializer(many=True, read_only=True)
    avatar_url = serializers.CharField(source='user.avatar_url', read_only=True)
    is_verified = serializers.BooleanField(source='user.is_verified', read_only=True)
    trust_score = serializers.SerializerMethodField()

    class Meta:
        model = WorkerProfile
        fields = [
            'id',
            'full_name',
            'primary_trade',
            'tagline',
            'bio',
            'location',
            'city',
            'state',
            'preferred_radius_km',
            'availability',
            'expected_salary_min',
            'expected_salary_max',
            'years_of_experience',
            'education',
            'languages',
            'avatar_url',
            'is_verified',
            'trust_score_total',
            'trust_score',
            'skills',
            'certifications',
            'proof_of_work',
            'experiences',
            'reviews',
        ]

    def get_certifications(self, obj):
        return [
            {
                'id': c.id,
                'title': c.title,
                'issuing_body': c.issuing_body,
                'issue_date': c.issue_date,
                'is_verified': c.verification_status == 'verified',
            }
            for c in obj.certifications.filter(verification_status='verified')
        ]

    def get_trust_score(self, obj):
        return {
            'total': obj.trust_score_total,
            'breakdown': {
                'identity': { 'score': obj.trust_identity_score, 'max': 20, 'verified': obj.user.is_verified, 'label': 'Aadhaar Biometric eKYC' },
                'certifications': { 'score': obj.trust_certifications_score, 'max': 20, 'verified_count': obj.certifications.filter(verification_status='verified').count() },
                'skills': { 'score': obj.trust_skills_score, 'max': 20, 'tested_count': obj.skills.filter(is_verified=True).count() },
                'experience': { 'score': obj.trust_experience_score, 'max': 15, 'verified_years': obj.years_of_experience },
                'employer_reviews': { 'score': obj.trust_reviews_score, 'max': 15, 'review_count': obj.reviews.count() },
                'completed_jobs': { 'score': obj.trust_completed_jobs_score, 'max': 10, 'completed_count': obj.proof_of_works.count() },
            }
        }
