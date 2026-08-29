from django.urls import path
from .views import (
    WorkerRecommendedJobsView,
    EmployerRecommendedCandidatesView,
)

urlpatterns = [
    path('jobs/recommended/', WorkerRecommendedJobsView.as_view(), name='matching-recommended-jobs'),
    path('candidates/recommended/', EmployerRecommendedCandidatesView.as_view(), name='matching-recommended-candidates'),
]
