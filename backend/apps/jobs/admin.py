from django.contrib import admin
from .models import Job

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'trade_category', 'city', 'salary_min', 'salary_max', 'status')
    list_filter = ('trade_category', 'status', 'job_type', 'city')
    search_fields = ('title', 'employer__company_name', 'city')
