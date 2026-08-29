from rest_framework import serializers
from .models import Application, ApplicationTimelineEvent, Interview
from apps.workers.serializers import PublicWorkerProfileSerializer

class ApplicationTimelineEventSerializer(serializers.ModelSerializer):
    formatted_date = serializers.SerializerMethodField()

    class Meta:
        model = ApplicationTimelineEvent
        fields = ['id', 'stage', 'timestamp', 'formatted_date', 'note', 'completed']

    def get_formatted_date(self, obj):
        return obj.timestamp.strftime("%b %d, %H:%M")

class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            'id',
            'date',
            'time',
            'interview_type',
            'location_or_link',
            'instructions',
            'interviewer_name',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company_name = serializers.CharField(source='job.employer.company_name', read_only=True)
    company_logo_url = serializers.CharField(source='job.employer.logo_url', read_only=True)
    job_location = serializers.CharField(source='job.location', read_only=True)
    worker_name = serializers.CharField(source='worker.full_name', read_only=True)
    worker_trade = serializers.CharField(source='worker.primary_trade', read_only=True)
    worker_avatar_url = serializers.CharField(source='worker.user.avatar_url', read_only=True)
    worker_trust_score = serializers.IntegerField(source='worker.trust_score_total', read_only=True)
    worker_experience_years = serializers.IntegerField(source='worker.years_of_experience', read_only=True)
    worker_city = serializers.CharField(source='worker.city', read_only=True)
    timeline = ApplicationTimelineEventSerializer(source='timeline_events', many=True, read_only=True)
    interview = InterviewSerializer(read_only=True)
    applied_date = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'worker',
            'job_title',
            'company_name',
            'company_logo_url',
            'job_location',
            'worker_name',
            'worker_trade',
            'worker_avatar_url',
            'worker_trust_score',
            'worker_experience_years',
            'worker_city',
            'current_stage',
            'match_score',
            'applied_date',
            'timeline',
            'interview',
            'employer_notes',
            'rating',
            'rejection_reason',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'job', 'worker', 'match_score', 'applied_date',
            'created_at', 'updated_at'
        ]

    def get_applied_date(self, obj):
        return obj.created_at.strftime("%b %d, %Y")

class ApplicationStageUpdateSerializer(serializers.Serializer):
    stage = serializers.ChoiceField(choices=Application.StageChoices.choices)
    note = serializers.CharField(required=False, allow_blank=True)
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    # State Transition Logic Rule Matrix
    ALLOWED_TRANSITIONS = {
        'Applied': ['Screening', 'Rejected', 'Withdrawn'],
        'Screening': ['Shortlisted', 'Rejected', 'Withdrawn'],
        'Shortlisted': ['Interview', 'Rejected', 'Withdrawn'],
        'Interview': ['Selected', 'Rejected', 'Withdrawn'],
        'Selected': ['Hired', 'Rejected', 'Withdrawn'],
        'Hired': [], # Terminal
        'Rejected': [], # Terminal
        'Withdrawn': [], # Terminal
    }

    def validate(self, attrs):
        new_stage = attrs.get('stage')
        application = self.context.get('application')
        current_stage = application.current_stage

        if current_stage == new_stage:
            return attrs

        allowed = self.ALLOWED_TRANSITIONS.get(current_stage, [])
        if new_stage not in allowed:
            raise serializers.ValidationError(
                f"Invalid stage transition from '{current_stage}' to '{new_stage}'. Allowed transitions: {allowed}"
            )
        return attrs

class ScheduleInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            'date',
            'time',
            'interview_type',
            'location_or_link',
            'instructions',
            'interviewer_name',
        ]
