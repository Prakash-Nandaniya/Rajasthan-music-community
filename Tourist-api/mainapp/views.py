from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import viewsets
from mainapp.models import Site, Artist, UserFeedback
from mainapp.serializers import (
    MapSerializer, 
    DetailSerializer, 
    UserFeedbackSerializer,
    ArtistSerializer,
)

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
