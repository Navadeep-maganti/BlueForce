from rest_framework.permissions import BasePermission

class IsWorker(BasePermission):
    """
    Allows access only to authenticated users with the 'worker' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'worker'
        )

class IsEmployer(BasePermission):
    """
    Allows access only to authenticated users with the 'employer' role.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'employer'
        )

class IsAdmin(BasePermission):
    """
    Allows access only to platform admins and staff members.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser)
        )

class IsOwner(BasePermission):
    """
    Object-level permission to only allow owners of an object to access/edit it.
    Supports objects referencing user directly, or via worker.user / employer.user.
    """
    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False

        # If user is admin/staff, permit access
        if request.user.role == 'admin' or request.user.is_staff or request.user.is_superuser:
            return True

        # Check direct user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user

        # Check worker.user attribute
        if hasattr(obj, 'worker') and hasattr(obj.worker, 'user'):
            return obj.worker.user == request.user

        # Check employer.user attribute
        if hasattr(obj, 'employer') and hasattr(obj.employer, 'user'):
            return obj.employer.user == request.user

        return False
