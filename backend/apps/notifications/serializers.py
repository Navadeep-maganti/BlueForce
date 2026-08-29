from rest_framework import serializers
from django.utils.timesince import timesince
from django.utils import timezone
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField()
    type = serializers.CharField(source='notification_type', read_only=True)

    class Meta:
        model = Notification
        fields = [
            'id',
            'title',
            'message',
            'notification_type',
            'type',
            'related_object_id',
            'is_read',
            'action_url',
            'created_at',
            'timestamp',
        ]
        read_only_fields = ['id', 'title', 'message', 'notification_type', 'type', 'related_object_id', 'action_url', 'created_at', 'timestamp']

    def get_timestamp(self, obj):
        now = timezone.now()
        diff = now - obj.created_at
        if diff.total_seconds() < 60:
            return "Just now"
        return f"{timesince(obj.created_at, now).split(',')[0]} ago"
