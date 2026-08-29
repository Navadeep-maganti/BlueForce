from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from common.responses import success_response, error_response

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    """
    POST /api/v1/auth/register/
    Registers a new User and automatically creates their associated WorkerProfile or EmployerProfile.
    Returns JWT tokens + User data.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Registration validation failed.",
                errors=serializer.errors,
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return success_response(
            data={
                'tokens': tokens,
                'user': user_data,
            },
            message="User registration successful and profile created.",
            status_code=status.HTTP_201_CREATED
        )

class LoginView(APIView):
    """
    POST /api/v1/auth/login/
    Validates user credentials and returns JWT tokens + User profile data.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message="Invalid credentials.",
                errors=serializer.errors,
                status_code=status.HTTP_401_UNAUTHORIZED
            )

        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        user_data = UserSerializer(user).data

        return success_response(
            data={
                'tokens': tokens,
                'user': user_data,
            },
            message="Login successful."
        )

class TokenRefreshCustomView(APIView):
    """
    POST /api/v1/auth/refresh/
    Exchanges refresh token for a new access token.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return error_response(
                message="Refresh token is required.",
                status_code=status.HTTP_400_BAD_REQUEST
            )

        try:
            refresh = RefreshToken(refresh_token)
            data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
            return success_response(data=data, message="Token refreshed successfully.")
        except (InvalidToken, TokenError) as e:
            return error_response(
                message="Invalid or expired refresh token.",
                errors=str(e),
                status_code=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/
    Blacklists the given refresh token.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        return success_response(message="Logged out successfully.")

class CurrentUserView(APIView):
    """
    GET /api/v1/auth/me/
    Returns the currently authenticated user's profile information.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_data = UserSerializer(request.user).data
        return success_response(
            data={'user': user_data},
            message="Current user profile retrieved successfully."
        )
