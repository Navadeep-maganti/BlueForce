from django.urls import path
from .views import (
    WorkerDashboardAggregationView,
    EmployerDashboardAggregationView,
    EmployerRecruitmentAnalyticsView,
)

urlpatterns = [
    path('worker/', WorkerDashboardAggregationView.as_view(), name='dashboard-worker-aggregated'),
    path('employer/', EmployerDashboardAggregationView.as_view(), name='dashboard-employer-aggregated'),
    path('employer/recruitment/', EmployerRecruitmentAnalyticsView.as_view(), name='dashboard-employer-recruitment'),
]
