from django.contrib import admin
from .models import EmployerProfile

@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'trade_industry', 'city', 'is_verified', 'contact_person')
    list_filter = ('is_verified', 'city', 'trade_industry')
    search_fields = ('company_name', 'gst_or_cin_number', 'contact_person')
