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
    EmployerRecruitmentAnalyticsView,
)
from apps.matching.views import (
    WorkerRecommendedJobsView,
    EmployerRecommendedCandidatesView,
)
from apps.employers.views import EmployerSavedCandidatesListView
from apps.reports.views import (
    ReportSubmitView,
    AdminReportQueueListView,
    AdminReportUpdateView,
)

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # OpenAPI 3 Schema & Interactive Documentation (Phase 20)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API v1 Versioning
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/workers/', include('apps.workers.urls')),
    path('api/v1/skills/', SkillTaxonomyListView.as_view(), name='skill-taxonomy-list'),
    path('api/v1/employers/', include('apps.employers.urls')),
    
    # Public & Employer Job System
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/employer/jobs/', EmployerJobListCreateView.as_view(), name='employer-jobs-list-create'),
    path('api/v1/employer/jobs/<int:pk>/', EmployerJobDetailView.as_view(), name='employer-jobs-detail'),
    path('api/v1/employer/saved-candidates/', EmployerSavedCandidatesListView.as_view(), name='employer-saved-candidates-root'),
    path('api/v1/employer/analytics/', EmployerRecruitmentAnalyticsView.as_view(), name='employer-recruitment-analytics-root'),

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

    # Platform Reports & Moderation (Phase 16)
    path('api/v1/reports/', ReportSubmitView.as_view(), name='reports-submit-root'),
    path('api/v1/admin/reports/', AdminReportQueueListView.as_view(), name='admin-reports-queue-root'),
    path('api/v1/admin/reports/<int:pk>/', AdminReportUpdateView.as_view(), name='admin-report-update-root'),

    # Dashboard Aggregation APIs (Phase 10 & 15)
    path('api/v1/dashboard/worker/', WorkerDashboardAggregationView.as_view(), name='dashboard-worker-root'),
    path('api/v1/dashboard/employer/', EmployerDashboardAggregationView.as_view(), name='dashboard-employer-root'),
    path('api/v1/dashboard/', include('apps.analytics.urls')),

    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
