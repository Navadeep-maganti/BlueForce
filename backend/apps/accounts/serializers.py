from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import transaction
from .models import User
from apps.workers.models import WorkerProfile
from apps.employers.models import EmployerProfile

class UserSerializer(serializers.ModelSerializer):
    profile_id = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    profile_data = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'phone',
            'location',
            'avatar_url',
            'language_preference',
            'is_verified',
            'profile_id',
            'display_name',
            'profile_data',
            'created_at',
        ]
        read_only_fields = ['id', 'is_verified', 'created_at']

    def get_profile_id(self, obj):
        if obj.role == User.Role.WORKER and hasattr(obj, 'worker_profile'):
            return obj.worker_profile.id
        elif obj.role == User.Role.EMPLOYER and hasattr(obj, 'employer_profile'):
            return obj.employer_profile.id
        return None

    def get_display_name(self, obj):
        if obj.role == User.Role.WORKER and hasattr(obj, 'worker_profile'):
            return obj.worker_profile.full_name
        elif obj.role == User.Role.EMPLOYER and hasattr(obj, 'employer_profile'):
            return obj.employer_profile.company_name
        return obj.username

    def get_profile_data(self, obj):
        if obj.role == User.Role.WORKER and hasattr(obj, 'worker_profile'):
            p = obj.worker_profile
            return {
                'id': p.id,
                'full_name': p.full_name,
                'primary_trade': p.primary_trade,
                'city': p.city,
                'trust_score_total': p.trust_score_total,
                'availability': p.availability,
                'years_of_experience': p.years_of_experience,
                'profile_strength_percent': p.profile_strength_percent,
            }
        elif obj.role == User.Role.EMPLOYER and hasattr(obj, 'employer_profile'):
            p = obj.employer_profile
            return {
                'id': p.id,
                'company_name': p.company_name,
                'trade_industry': p.trade_industry,
                'city': p.city,
                'is_verified': p.is_verified,
                'verification_badge': p.verification_badge,
            }
        return None

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, min_length=6)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.WORKER)
    phone = serializers.CharField(required=False, allow_blank=True, default='')
    location = serializers.CharField(required=False, allow_blank=True, default='Vijayawada, AP')
    avatar_url = serializers.URLField(required=False, allow_blank=True)

    # Worker specific fields
    full_name = serializers.CharField(required=False, allow_blank=True)
    primary_trade = serializers.CharField(required=False, allow_blank=True)
    years_of_experience = serializers.IntegerField(required=False, default=3)
    education = serializers.CharField(required=False, allow_blank=True, default='ITI Diploma')

    # Employer specific fields
    company_name = serializers.CharField(required=False, allow_blank=True)
    trade_industry = serializers.CharField(required=False, allow_blank=True)
    gst_or_cin_number = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value.lower()

    def validate(self, attrs):
        role = attrs.get('role', User.Role.WORKER)
        if role == User.Role.WORKER:
            if not attrs.get('full_name'):
                attrs['full_name'] = attrs['email'].split('@')[0].replace('.', ' ').title()
            if not attrs.get('primary_trade'):
                attrs['primary_trade'] = 'Skilled Trade Technician'
        elif role == User.Role.EMPLOYER:
            if not attrs.get('company_name'):
                attrs['company_name'] = attrs['email'].split('@')[0].title() + " Enterprises"
            if not attrs.get('trade_industry'):
                attrs['trade_industry'] = 'Manufacturing & Engineering'
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data.get('username') or email
        password = validated_data['password']
        role = validated_data.get('role', User.Role.WORKER)
        phone = validated_data.get('phone', '')
        location = validated_data.get('location', 'Vijayawada, AP')
        avatar_url = validated_data.get('avatar_url') or (
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            if role == User.Role.WORKER else
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
        )

        # 1. Create Base User
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            phone=phone,
            location=location,
            avatar_url=avatar_url,
            is_verified=True
        )

        # 2. Automatically Create Specific Role Profile
        city = location.split(',')[0].strip() if ',' in location else location
        if role == User.Role.WORKER:
            WorkerProfile.objects.create(
                user=user,
                full_name=validated_data.get('full_name', username.title()),
                primary_trade=validated_data.get('primary_trade', 'Industrial Electrician'),
                location=location,
                city=city,
                years_of_experience=validated_data.get('years_of_experience', 3),
                education=validated_data.get('education', 'ITI Trade Certificate'),
                trust_score_total=75,
                trust_identity_score=20,
                trust_certifications_score=15,
                trust_skills_score=15,
                trust_experience_score=10,
                trust_reviews_score=10,
                trust_completed_jobs_score=5
            )
        elif role == User.Role.EMPLOYER:
            EmployerProfile.objects.create(
                user=user,
                company_name=validated_data.get('company_name', username.title()),
                trade_industry=validated_data.get('trade_industry', 'Precision Manufacturing'),
                location=location,
                city=city,
                gst_or_cin_number=validated_data.get('gst_or_cin_number', 'GSTIN: PENDING'),
                is_verified=True,
                verification_badge='Verified Employer'
            )

        return user

class LoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        identifier = attrs.get('username_or_email')
        password = attrs.get('password')

        # Authenticate via username or email
        user = None
        if '@' in identifier:
            user_obj = User.objects.filter(email__iexact=identifier).first()
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)
        else:
            user = authenticate(username=identifier, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email/username or password.")

        if not user.is_active:
            raise serializers.ValidationError("This user account is inactive or suspended.")

        attrs['user'] = user
        return attrs
