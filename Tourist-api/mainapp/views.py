from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from mainapp.models import Site, Artist, UserFeedback, MoreImage, Video
from mainapp.serializers import (
    MapSerializer, 
    DetailSerializer, 
    UserFeedbackSerializer,
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