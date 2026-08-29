from django.urls import path
from .views import (
    WorkerDocumentSubmitView,
    WorkerMyDocumentsListView,
    AdminVerificationQueueListView,
    AdminVerificationApproveView,
    AdminVerificationRejectView,
)

urlpatterns = [
    # Worker Document Submissions
    path('submit/', WorkerDocumentSubmitView.as_view(), name='verification-submit'),
    path('my-documents/', WorkerMyDocumentsListView.as_view(), name='verification-my-docs'),

    # Admin Moderation Queue
    path('queue/', AdminVerificationQueueListView.as_view(), name='verification-queue'),
    path('queue/<int:pk>/approve/', AdminVerificationApproveView.as_view(), name='verification-approve'),
    path('queue/<int:pk>/reject/', AdminVerificationRejectView.as_view(), name='verification-reject'),
]
