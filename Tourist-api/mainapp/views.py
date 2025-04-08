from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import viewsets, status
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import  AllowAny
from django.contrib.auth import get_user_model, login
from django.conf import settings
from django.core.mail import send_mail
import logging
import random
from django.utils import timezone
from mainapp.models import Site, Artist, UserFeedback, MoreImage, Video, OTP
from mainapp.permissions import IsAuthenticated, IsUser, IsArtist, IsArtistForSite
from mainapp.serializers import (
    MapSerializer, 
    DetailSerializer, 
    UserFeedbackSerializer,
    CustomUserSerializer,
    LoginSerializer,
    ArtistSerializer,
)

class SiteView(APIView):
    parser_classes = (MultiPartParser, FormParser)  # Support multipart/form-data for file uploads
    def get_permissions(self):
        """
        Dynamically set permissions based on the request method.
        """
        if self.request.method == 'POST':  # Create
            return [AllowAny()]
        elif self.request.method == 'GET':  # Retrieve
            return [IsAuthenticated()]
        elif self.request.method in ['PUT', 'DELETE']:  # Update, Delete
            return [IsArtist(), IsArtistForSite()]
        return [AllowAny()]  # Default (shouldn’t hit this)
    def get(self, request, pk=None, *args, **kwargs):
        """
        Retrieve a Site instance by ID (replaces DetailView).
        """
        if pk is None:
            return Response({"error": "Site ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            site = Site.objects.prefetch_related('artists', 'moreImages', 'videos').get(pk=pk)
            serializer = DetailSerializer(site)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Site.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        serializer = DetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                site = serializer.save()
                return Response(DetailSerializer(site).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("serializer errors", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk, *args, **kwargs):
        """
        Update an existing Site instance (replaces SiteUpdateView).
        """
        try:
            site = Site.objects.get(pk=pk)
        except Site.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = DetailSerializer(instance=site, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            try:
                updated_site = serializer.save()
                return Response(DetailSerializer(updated_site).data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, pk, *args, **kwargs):
        """
        Delete an existing Site instance.
        """
        try:
            site = Site.objects.get(pk=pk)
            site.delete()
            return Response({"message": "Site deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Site.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MapView(ListAPIView):
    serializer_class = MapSerializer
    def get_queryset(self):
        queryset = Site.objects.all()  
        community = self.request.query_params.get('community', None)
        search= self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(groupName__icontains=search)
        if community:
            queryset = queryset.filter(community__icontains=community)
        return queryset


class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer


class GroupNameCheck(APIView):
    def get(self, request):
        groupName = request.query_params.get('groupName', None)
        community = request.query_params.get('community', None)
        if groupName:
            if Site.objects.filter(community=community, groupName=groupName).exists():
                return Response({"exists": True})
            else:
                return Response({"exists": False})
        else:
            return Response({"error": "No groupName provided"}, status=status.HTTP_400_BAD_REQUEST)
        


User = get_user_model()

@csrf_exempt
class CustomUserProfile(APIView):
    permission_classes = [AllowAny]  # Default, overridden in get_permissions

    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]  # For PUT/DELETE

    def post(self, request, *args, **kwargs):
        print("Signup request data:", request.data)
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            request.session['is_authenticated'] = True
            request.session['role'] = 'user'
            request.session['id'] = user.id
            request.session.set_expiry(86400)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, *args, **kwargs):
        print("Update request data:", request.data)
        user = User.objects.get(id=request.session.get('id'))
        serializer = CustomUserSerializer(instance=user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        user = User.objects.get(id=request.session.get('id'))
        user.delete()
        request.session.flush()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class LoginView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        print("Login request data:", request.data)
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)  # Log the user in with Django’s auth
        # Set session
        request.session['is_authenticated'] = True
        request.session['role'] = 'user'
        request.session['id'] = user.id
        request.session.set_expiry(86400)  # 24 hours
        user_serializer = CustomUserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data,
        }, status=status.HTTP_200_OK)



logger = logging.getLogger(__name__)

class SendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile_no = request.data.get('mobileNo')

        if not mobile_no or len(mobile_no) != 10 or not mobile_no.isdigit():
            return Response({'error': 'Invalid mobile number'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if mobile number exists in any Site's access array
        sites = Site.objects.all()
        authorized = False
        for site in sites:
            if mobile_no in site.access:
                authorized = True
                break

        if not authorized:
            return Response({'error': 'Mobile number not authorized for any site'}, status=status.HTTP_403_FORBIDDEN)

        # Check if OTP exists for this mobile number, update or create
        try:
            otp_instance = OTP.objects.get(mobile_number=mobile_no)
            otp_instance.otp = str(random.randint(100000, 999999))
            otp_instance.expires_at = timezone.now() + timezone.timedelta(minutes=5)
            otp_instance.save()
        except OTP.DoesNotExist:
            otp_instance = OTP(mobile_number=mobile_no)
            otp_instance.save()

        # Send OTP via email
        try:
            send_mail(
                subject='Your OTP Code',
                message=f"Your OTP is {otp_instance.otp}. Valid for 5 minutes.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['b22ee050@iitj.ac.in'],
                fail_silently=False,
            )
            logger.info(f"OTP emailed to b22ee050@iitj.ac.in for {mobile_no}: {otp_instance.otp}")
            return Response({'message': 'OTP sent successfully to email'}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Email error: {str(e)}")
            return Response({'error': 'Failed to send OTP email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        mobile_no = request.data.get('mobileNo')
        otp = request.data.get('otp')

        if not mobile_no or not otp:
            return Response({'error': 'Mobile number and OTP required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_instance = OTP.objects.get(mobile_number=mobile_no, otp=otp)

            if not otp_instance.is_valid():
                otp_instance.delete()
                return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

            # OTP is valid, set session
            request.session['is_authenticated'] = True
            request.session['role'] = 'artist'
            request.session['mobile_no'] = mobile_no
            request.session.set_expiry(86400)  # 24 hours

            # Get sites the artist has access to (fixed lookup)
            sites = Site.objects.all()
            site_id = None
            for site in sites:
                if mobile_no in site.access:
                    site_id = site.id
                    break

            otp_instance.delete()  # Clean up OTP
            logger.info(f"Artist {mobile_no} authenticated with OTP")
            request.session['site_id'] = site_id
            return Response({
                'message': 'Login successful',
                'site_id': site_id  # Return accessible site IDs
            }, status=status.HTTP_200_OK)
        except OTP.DoesNotExist:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)