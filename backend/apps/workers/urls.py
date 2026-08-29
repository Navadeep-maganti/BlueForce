from django.urls import path
from .views import (
    WorkerDiscoveryListView,
    WorkerProfileMeView,
    SkillTaxonomyListView,
    WorkerSkillListCreateView,
    WorkerSkillDetailView,
    WorkerCertificationListCreateView,
    WorkerCertificationDetailView,
    WorkerProofOfWorkListCreateView,
    WorkerProofOfWorkDetailView,
    PublicWorkerProfileView,
    WorkerCareerInsightsView,
    WorkerSavedJobsListView,
    SaveCandidateToggleView,
    WorkerPublicReviewsListView,
)

urlpatterns = [
    # Candidate Discovery for Employers (Phase 6)
    path('', WorkerDiscoveryListView.as_view(), name='worker-discovery-list'),

    # Aggregated & Update Me
    path('me/', WorkerProfileMeView.as_view(), name='worker-me'),
    path('me/career-insights/', WorkerCareerInsightsView.as_view(), name='worker-career-insights'),
    path('me/saved-jobs/', WorkerSavedJobsListView.as_view(), name='worker-saved-jobs'),

    # Skills
    path('me/skills/', WorkerSkillListCreateView.as_view(), name='worker-skills-list-create'),
    path('me/skills/<int:pk>/', WorkerSkillDetailView.as_view(), name='worker-skills-detail'),

    # Certifications
    path('me/certifications/', WorkerCertificationListCreateView.as_view(), name='worker-certs-list-create'),
    path('me/certifications/<int:pk>/', WorkerCertificationDetailView.as_view(), name='worker-certs-detail'),

    # Proof of Work
    path('me/proof-of-work/', WorkerProofOfWorkListCreateView.as_view(), name='worker-pow-list-create'),
    path('me/proof-of-work/<int:pk>/', WorkerProofOfWorkDetailView.as_view(), name='worker-pow-detail'),

    # Save Candidate Toggle (Phase 13)
    path('<int:pk>/save/', SaveCandidateToggleView.as_view(), name='worker-save-candidate-toggle'),

    # Public Profile & Reviews (Phase 14)
    path('<int:pk>/', PublicWorkerProfileView.as_view(), name='worker-public-detail'),
    path('<int:pk>/reviews/', WorkerPublicReviewsListView.as_view(), name='worker-public-reviews'),
]
