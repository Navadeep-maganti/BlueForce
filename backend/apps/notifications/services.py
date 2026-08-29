"""
Notification Service Layer
Location: apps/notifications/services.py
"""
from typing import Optional
from .models import Notification

def create_notification(
    user,
    notification_type: str,
    title: str,
    message: str,
    related_object_id: Optional[int] = None,
    action_url: Optional[str] = None
) -> Notification:
    """
    Creates and persists a database notification for an authenticated user.
    """
    if not user:
        return None

    # Resolve action URL if not provided
    if not action_url:
        if notification_type in ['APPLICATION_RECEIVED', 'SHORTLISTED']:
            action_url = '/employer/pipeline'
        elif notification_type in ['APPLICATION_STATUS_CHANGED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_CANCELLED']:
            action_url = '/worker/applications'
        elif notification_type in ['VERIFICATION_APPROVED', 'VERIFICATION_REJECTED']:
            action_url = '/worker/profile'
        elif notification_type in ['JOB_RECOMMENDATION']:
            action_url = '/worker/jobs'
        else:
            action_url = '/'

    notification = Notification.objects.create(
        user=user,
        notification_type=notification_type,
        title=title,
        message=message,
        related_object_id=related_object_id,
        action_url=action_url
    )
    return notification
