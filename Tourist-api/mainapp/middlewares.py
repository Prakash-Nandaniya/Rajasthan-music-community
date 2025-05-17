import json
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.core.mail import send_mail

def send_message_to_mobile(number, message):
    send_mail(
        subject="Community application verification message",
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=["b22ee050@iitj.ac.in"],  # always sends to this email
        fail_silently=False,
    )

class CommunityApplicationNotificationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        path = request.path
        method = request.method.upper()

        # Only target approve/reject endpoints
        if path.startswith('/verify_application/approve/') and method == "PUT":
            # For approve, access comes in request.POST or request.body as JSON
            access_numbers = self._extract_access(request)
            for number in access_numbers:
                send_message_to_mobile(number, "Your community application has been approved.")
        elif path.startswith('/verify_application/reject/') and method == "DELETE":
            # For reject, access comes in request.body as JSON
            access_numbers = self._extract_access(request)
            for number in access_numbers:
                send_message_to_mobile(number, "Your community application has been rejected.")

        # Always return None to let request proceed
        return None

    def _extract_access(self, request):
        # Try DRF's request.data if available (for APIView, not plain MiddlewareMixin)
        if hasattr(request, 'data'):
            data = request.data
            # For form-data, access might be sent as access[0], access[1], ...
            access = []
            for key in data:
                if key.startswith('access['):
                    access.append(data[key])
            # If access is sent as a JSON array (for DELETE), handle that too
            if not access and 'access' in data and isinstance(data['access'], list):
                access = data['access']
            return access

        # Fallback for multipart/form-data (Django's request.POST)
        if request.method in ['POST', 'PUT']:
            access = []
            for key in request.POST:
                if key.startswith('access['):
                    access.append(request.POST[key])
            return access

        # Fallback for JSON body (DELETE, etc.)
        try:
            if request.body:
                body_str = request.body.decode('utf-8')
                data = json.loads(body_str)
                access = data.get('access', [])
                if isinstance(access, list):
                    return access
        except Exception as e:
            print(f"Error extracting access list: {e}")

        return []
