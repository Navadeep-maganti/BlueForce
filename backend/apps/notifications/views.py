from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Notification
from .serializers import NotificationSerializer
from common.responses import success_response, error_response
from common.pagination import StandardResultsSetPagination

class NotificationListView(APIView):
    """
    GET /api/v1/notifications/
    Returns list of notifications and total unread count for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        notifications = Notification.objects.filter(user=user)

        # Filters
        is_read_param = request.query_params.get('is_read')
        if is_read_param is not None:
            is_read_bool = is_read_param.lower() in ['true', '1']
            notifications = notifications.filter(is_read=is_read_bool)

        notif_type = request.query_params.get('notification_type')
        if notif_type and notif_type.lower() != 'all':
            notifications = notifications.filter(notification_type__iexact=notif_type)

        unread_count = Notification.objects.filter(user=user, is_read=False).count()
        serializer = NotificationSerializer(notifications[:50], many=True)

        return success_response(
            data={
                'notifications': serializer.data,
                'unread_count': unread_count,
                'total_count': notifications.count(),
            },
            message="Notifications retrieved successfully."
        )

class NotificationMarkReadView(APIView):
    """
    PATCH /api/v1/notifications/<id>/read/
    Marks an individual notification as read.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save(update_fields=['is_read', 'updated_at'])

        unread_count = Notification.objects.filter(user=request.user, is_read=False).count()

        return success_response(
            data={
                'notification': NotificationSerializer(notification).data,
                'unread_count': unread_count,
            },
            message="Notification marked as read."
        )

class NotificationReadAllView(APIView):
    """
    POST /api/v1/notifications/read-all/
    Marks all notifications for the authenticated user as read.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)

        return success_response(
            data={
                'updated_count': updated_count,
                'unread_count': 0,
            },
            message=f"{updated_count} notifications marked as read."
        )
