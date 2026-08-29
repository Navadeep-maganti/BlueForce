"""
Root URL Configuration for KaushalConnect API (v1)
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API v1 Versioning
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/workers/', include('apps.workers.urls')),
    path('api/v1/employers/', include('apps.employers.urls')),
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/applications/', include('apps.applications.urls')),
    path('api/v1/verification/', include('apps.verification.urls')),
    path('api/v1/matching/', include('apps.matching.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/analytics/', include('apps.analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
