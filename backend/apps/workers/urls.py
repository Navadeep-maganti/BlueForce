from django.urls import path
from .views import (
    WorkerProfileMeView,
    SkillTaxonomyListView,
    WorkerSkillListCreateView,
    WorkerSkillDetailView,
    WorkerCertificationListCreateView,
    WorkerCertificationDetailView,
    WorkerProofOfWorkListCreateView,
    WorkerProofOfWorkDetailView,
    PublicWorkerProfileView,
)

urlpatterns = [
    # Aggregated & Update Me
    path('me/', WorkerProfileMeView.as_view(), name='worker-me'),

    # Skills
    path('me/skills/', WorkerSkillListCreateView.as_view(), name='worker-skills-list-create'),
    path('me/skills/<int:pk>/', WorkerSkillDetailView.as_view(), name='worker-skills-detail'),

    # Certifications
    path('me/certifications/', WorkerCertificationListCreateView.as_view(), name='worker-certs-list-create'),
    path('me/certifications/<int:pk>/', WorkerCertificationDetailView.as_view(), name='worker-certs-detail'),

    # Proof of Work
    path('me/proof-of-work/', WorkerProofOfWorkListCreateView.as_view(), name='worker-pow-list-create'),
    path('me/proof-of-work/<int:pk>/', WorkerProofOfWorkDetailView.as_view(), name='worker-pow-detail'),

    # Public Profile for Employers
    path('<int:pk>/', PublicWorkerProfileView.as_view(), name='worker-public-detail'),
]
