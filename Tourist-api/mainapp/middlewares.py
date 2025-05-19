import json
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.core.mail import send_mail
from django.http import QueryDict
from django.http.multipartparser import MultiPartParser
from io import BytesIO

def parse_multipart_put(request):
    content_type = request.META.get('CONTENT_TYPE', '')
    if content_type.startswith('multipart/'):
        parser = MultiPartParser(request.META, BytesIO(request.body), request.upload_handlers, request.encoding)
        data, files = parser.parse()
        return data, files
    return {}, {}



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
            print(f"Access numbers for approval: {access_numbers}")  # Debugging line
            for number in access_numbers:
                send_message_to_mobile(number, "Your community application has been approved.")
        elif path.startswith('/verify_application/reject/') and method == "DELETE":
            # For reject, access comes in request.body as JSON
            access_numbers = self._extract_access(request)
            print(f"Access numbers for rejection: {access_numbers}")  # Debugging line
            for number in access_numbers:
                send_message_to_mobile(number, "Your community application has been rejected.")

        # Always return None to let request proceed
        return None

    def _extract_access(self, request):
        
        if request.method == "PUT":
            # data, files = parse_multipart_put(request)
            # access = [v for k, v in data.items() if k.startswith('access[')]
            # return access
            return []
    
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
