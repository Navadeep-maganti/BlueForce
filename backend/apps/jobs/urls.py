from django.urls import path
from .views import (
    EmployerJobListCreateView,
    EmployerJobDetailView,
    PublicJobListView,
    PublicJobDetailView,
)
from apps.applications.views import ApplyJobView
from apps.matching.views import WorkerRecommendedJobsView

urlpatterns = [
    # AI Recommended Jobs for Worker (Phase 11)
    path('recommended/', WorkerRecommendedJobsView.as_view(), name='jobs-recommended'),

    # Public Job Discovery & Detail
    path('', PublicJobListView.as_view(), name='public-job-list'),
    path('<int:pk>/', PublicJobDetailView.as_view(), name='public-job-detail'),
    path('<int:pk>/apply/', ApplyJobView.as_view(), name='job-apply'),

    # Employer Job CRUD
    path('employer/', EmployerJobListCreateView.as_view(), name='employer-job-list-create'),
    path('employer/<int:pk>/', EmployerJobDetailView.as_view(), name='employer-job-detail'),
]
