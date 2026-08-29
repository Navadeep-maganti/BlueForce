from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'role', 'phone', 'location', 'is_verified', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_active')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('KaushalConnect Profile', {'fields': ('role', 'phone', 'location', 'avatar_url', 'language_preference', 'is_verified')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('KaushalConnect Profile', {'fields': ('role', 'phone', 'location', 'avatar_url', 'language_preference', 'is_verified')}),
    )
