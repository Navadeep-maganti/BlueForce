from django.urls import path
from .views import (
    ApplyJobView,
    WorkerApplicationListView,
    EmployerApplicationListView,
    ApplicationDetailView,
    ApplicationStageUpdateView,
    ScheduleInterviewView,
    InterviewListView,
    InterviewDetailView,
    InterviewCancelView,
    InterviewCompleteView,
    ApplicationReviewWorkerView,
)

urlpatterns = [
    # Worker applied jobs
    path('my/', WorkerApplicationListView.as_view(), name='worker-applications'),
    path('apply/<int:pk>/', ApplyJobView.as_view(), name='apply-job-alt'),

    # Employer pipeline
    path('employer/', EmployerApplicationListView.as_view(), name='employer-applications'),

    # Application details, stage updates, review & interview scheduling
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:pk>/stage/', ApplicationStageUpdateView.as_view(), name='application-stage-update'),
    path('<int:pk>/schedule-interview/', ScheduleInterviewView.as_view(), name='application-schedule-interview'),
    path('<int:pk>/review-worker/', ApplicationReviewWorkerView.as_view(), name='application-review-worker'),

    # Interviews Management System (Phase 5)
    path('interviews/', InterviewListView.as_view(), name='interviews-list'),
    path('interviews/<int:pk>/', InterviewDetailView.as_view(), name='interviews-detail'),
    path('interviews/<int:pk>/cancel/', InterviewCancelView.as_view(), name='interviews-cancel'),
    path('interviews/<int:pk>/complete/', InterviewCompleteView.as_view(), name='interviews-complete'),
]
