from django.urls import path
from .views import (
    ReportSubmitView,
    AdminReportQueueListView,
    AdminReportUpdateView,
)

urlpatterns = [
    # Submit report
    path('', ReportSubmitView.as_view(), name='report-submit'),

    # Admin moderation queue & update
    path('admin/', AdminReportQueueListView.as_view(), name='admin-reports-queue'),
    path('admin/<int:pk>/', AdminReportUpdateView.as_view(), name='admin-report-update'),
]
