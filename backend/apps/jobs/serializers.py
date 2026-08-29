from rest_framework import serializers
from .models import Job
from apps.employers.models import EmployerProfile
from apps.matching.services import calculate_job_match

class EmployerJobSerializer(serializers.ModelSerializer):
    applications_count = serializers.SerializerMethodField()
    shortlisted_count = serializers.SerializerMethodField()
    interview_count = serializers.SerializerMethodField()
    hired_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'trade_category',
            'location',
            'city',
            'distance_km',
            'salary_min',
            'salary_max',
            'salary_period',
            'experience_required_years',
            'job_type',
            'shift',
            'openings',
            'joining_date',
            'deadline_date',
            'required_skills',
            'preferred_skills',
            'required_certifications',
            'description',
            'benefits',
            'work_address',
            'status',
            'applications_count',
            'shortlisted_count',
            'interview_count',
            'hired_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'applications_count', 'shortlisted_count', 'interview_count', 'hired_count', 'created_at', 'updated_at']

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_shortlisted_count(self, obj):
        return obj.applications.filter(current_stage='Shortlisted').count()

    def get_interview_count(self, obj):
        return obj.applications.filter(current_stage='Interview').count()

    def get_hired_count(self, obj):
        return obj.applications.filter(current_stage='Hired').count()

    def validate_status(self, value):
        valid_transitions = {
            'draft': ['active', 'closed'],
            'active': ['paused', 'closed'],
            'paused': ['active', 'closed'],
            'closed': ['active'],
        }
        if self.instance and self.instance.status != value:
            allowed = valid_transitions.get(self.instance.status, [])
            if value not in allowed:
                raise serializers.ValidationError(
                    f"Invalid status transition from '{self.instance.status}' to '{value}'. Allowed: {allowed}"
                )
        return value

class PublicJobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='employer.company_name', read_only=True)
    company_logo_url = serializers.CharField(source='employer.logo_url', read_only=True)
    is_company_verified = serializers.BooleanField(source='employer.is_verified', read_only=True)
    verification_badge = serializers.CharField(source='employer.verification_badge', read_only=True)
    match_data = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'trade_category',
            'location',
            'city',
            'distance_km',
            'salary_min',
            'salary_max',
            'salary_period',
            'experience_required_years',
            'job_type',
            'shift',
            'openings',
            'joining_date',
            'deadline_date',
            'required_skills',
            'description',
            'status',
            'company_name',
            'company_logo_url',
            'is_company_verified',
            'verification_badge',
            'match_data',
            'created_at',
        ]

    def get_match_data(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'worker_profile'):
            return calculate_job_match(request.user.worker_profile, obj)
        return None

class PublicJobDetailSerializer(serializers.ModelSerializer):
    employer_info = serializers.SerializerMethodField()
    match_data = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'trade_category',
            'location',
            'city',
            'distance_km',
            'salary_min',
            'salary_max',
            'salary_period',
            'experience_required_years',
            'job_type',
            'shift',
            'openings',
            'joining_date',
            'deadline_date',
            'required_skills',
            'preferred_skills',
            'required_certifications',
            'description',
            'benefits',
            'work_address',
            'status',
            'employer_info',
            'match_data',
            'created_at',
            'updated_at',
        ]

    def get_employer_info(self, obj):
        emp = obj.employer
        return {
            'id': emp.id,
            'company_name': emp.company_name,
            'trade_industry': emp.trade_industry,
            'tagline': emp.tagline,
            'description': emp.description,
            'location': emp.location,
            'city': emp.city,
            'logo_url': emp.logo_url,
            'is_verified': emp.is_verified,
            'verification_badge': emp.verification_badge,
            'employee_count': emp.employee_count,
            'established_year': emp.established_year,
            'contact_person': emp.contact_person,
        }

    def get_match_data(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and hasattr(request.user, 'worker_profile'):
            return calculate_job_match(request.user.worker_profile, obj)
        return None
