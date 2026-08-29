from django.urls import path
from .views import (
    ApplyJobView,
    WorkerApplicationListView,
    EmployerApplicationListView,
    ApplicationDetailView,
    ApplicationStageUpdateView,
    ScheduleInterviewView,
)

urlpatterns = [
    # Worker applied jobs
    path('my/', WorkerApplicationListView.as_view(), name='worker-applications'),
    path('apply/<int:pk>/', ApplyJobView.as_view(), name='apply-job-alt'),

    # Employer pipeline
    path('employer/', EmployerApplicationListView.as_view(), name='employer-applications'),

    # Application details, stage updates & interview scheduling
    path('<int:pk>/', ApplicationDetailView.as_view(), name='application-detail'),
    path('<int:pk>/stage/', ApplicationStageUpdateView.as_view(), name='application-stage-update'),
    path('<int:pk>/schedule-interview/', ScheduleInterviewView.as_view(), name='application-schedule-interview'),
]
