from django.urls import path
from .views import (
    WorkerDashboardAggregationView,
    EmployerDashboardAggregationView,
)

urlpatterns = [
    path('worker/', WorkerDashboardAggregationView.as_view(), name='dashboard-worker-aggregated'),
    path('employer/', EmployerDashboardAggregationView.as_view(), name='dashboard-employer-aggregated'),
]
