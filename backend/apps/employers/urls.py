from django.urls import path
from .views import (
    EmployerSavedCandidatesListView,
    EmployerProfileMeView,
)

urlpatterns = [
    path('me/', EmployerProfileMeView.as_view(), name='employer-me'),
    path('saved-candidates/', EmployerSavedCandidatesListView.as_view(), name='employer-saved-candidates'),
]
