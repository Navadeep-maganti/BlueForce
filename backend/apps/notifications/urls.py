from django.urls import path
from .views import (
    NotificationListView,
    NotificationMarkReadView,
    NotificationReadAllView,
)

urlpatterns = [
    # Authenticated user notifications
    path('', NotificationListView.as_view(), name='notifications-list'),
    path('<int:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('read-all/', NotificationReadAllView.as_view(), name='notification-read-all'),
]
