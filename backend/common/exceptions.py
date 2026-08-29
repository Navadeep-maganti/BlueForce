from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler to ensure standard { success: False, message: "...", errors: ... } response format.
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_message = "Validation or processing error."
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                error_message = str(response.data['detail'])
            else:
                # First error message in dict
                first_key = next(iter(response.data))
                error_message = f"{first_key}: {response.data[first_key]}"
        elif isinstance(response.data, list) and len(response.data) > 0:
            error_message = str(response.data[0])

        response.data = {
            'success': False,
            'message': error_message,
            'errors': response.data
        }

    return response
