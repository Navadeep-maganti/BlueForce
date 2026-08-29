"""
Root URL Configuration for KaushalConnect API (v1)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from apps.workers.views import SkillTaxonomyListView
from apps.jobs.views import EmployerJobListCreateView, EmployerJobDetailView
from apps.applications.views import (
    InterviewListView,
    InterviewDetailView,
    InterviewCancelView,
    InterviewCompleteView,
)
from apps.verification.views import (
    AdminVerificationQueueListView,
    AdminVerificationApproveView,
    AdminVerificationRejectView,
)
from apps.analytics.views import (
    WorkerDashboardAggregationView,
    EmployerDashboardAggregationView,
)
from apps.matching.views import (
    WorkerRecommendedJobsView,
    EmployerRecommendedCandidatesView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1 Versioning
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/workers/', include('apps.workers.urls')),
    path('api/v1/skills/', SkillTaxonomyListView.as_view(), name='skill-taxonomy-list'),
    path('api/v1/employers/', include('apps.employers.urls')),
    
    # Public & Employer Job System
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/employer/jobs/', EmployerJobListCreateView.as_view(), name='employer-jobs-list-create'),
    path('api/v1/employer/jobs/<int:pk>/', EmployerJobDetailView.as_view(), name='employer-jobs-detail'),

    # Explainable Matching Engine (Phase 11)
    path('api/v1/jobs/recommended/', WorkerRecommendedJobsView.as_view(), name='root-jobs-recommended'),
    path('api/v1/employer/candidates/recommended/', EmployerRecommendedCandidatesView.as_view(), name='root-candidates-recommended'),
    path('api/v1/matching/', include('apps.matching.urls')),

    # Applications System
    path('api/v1/applications/', include('apps.applications.urls')),

    # Interviews Management System (Phase 5)
    path('api/v1/interviews/', InterviewListView.as_view(), name='interviews-root-list'),
    path('api/v1/interviews/<int:pk>/', InterviewDetailView.as_view(), name='interviews-root-detail'),
    path('api/v1/interviews/<int:pk>/cancel/', InterviewCancelView.as_view(), name='interviews-root-cancel'),
    path('api/v1/interviews/<int:pk>/complete/', InterviewCompleteView.as_view(), name='interviews-root-complete'),

    # Verification Workflow (Phase 8)
    path('api/v1/verification/', include('apps.verification.urls')),
    path('api/v1/admin/verifications/', AdminVerificationQueueListView.as_view(), name='admin-verifications-list'),
    path('api/v1/admin/verifications/<int:pk>/approve/', AdminVerificationApproveView.as_view(), name='admin-verifications-approve'),
    path('api/v1/admin/verifications/<int:pk>/reject/', AdminVerificationRejectView.as_view(), name='admin-verifications-reject'),

    # Dashboard Aggregation APIs (Phase 10)
    path('api/v1/dashboard/worker/', WorkerDashboardAggregationView.as_view(), name='dashboard-worker-root'),
    path('api/v1/dashboard/employer/', EmployerDashboardAggregationView.as_view(), name='dashboard-employer-root'),
    path('api/v1/dashboard/', include('apps.analytics.urls')),

    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
