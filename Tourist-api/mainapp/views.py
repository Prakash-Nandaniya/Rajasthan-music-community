from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model, login
from mainapp.models import Site, Artist, UserFeedback, MoreImage, Video
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

class UserProfile(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    def get_permissions(self):
        # Allow anyone to create (register), but require authentication for other actions
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        # Only allow users to access their own profile
        return User.objects.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        # Handle profile update
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # Allow partial updates
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        # Handle profile deletion
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    


class LoginView(APIView):
    authentication_classes = []  
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)  # Log the user in
        request.session.set_expiry(86400)  # Set session to 24 hours
        user_serializer = CustomUserSerializer(user)
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data,
        }, status=200)
