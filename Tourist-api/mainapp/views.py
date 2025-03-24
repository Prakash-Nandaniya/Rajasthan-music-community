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

class SiteCreateView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        serializer = DetailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            print("1")
            try:
                site = serializer.save()
                return Response(DetailSerializer(site).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print("Error during save:", str(e))  # Log the error
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("2")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

class DetailView(RetrieveAPIView):
    queryset = Site.objects.prefetch_related('artists', 'moreImages', 'videos')  
    serializer_class = DetailSerializer  
    lookup_field = 'id'

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
