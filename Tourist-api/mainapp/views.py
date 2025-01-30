from rest_framework.generics import ListAPIView
from rest_framework import viewsets
from mainapp.models import SiteData, UserFeedback
from mainapp.serializers import SiteDataSerializer, UserFeedbackSerializer

class SiteMapView(ListAPIView):
    serializer_class = SiteDataSerializer

    def get_queryset(self):
        queryset = SiteData.objects.all()  
        
        #filter processing
        # name = self.request.query_params.get('name', None)
        # age = self.request.query_params.get('age', None)
        # if name:
        #     queryset = queryset.filter(name__icontains=name)
        # if age:
        #     queryset = queryset.filter(age=age)
        
        return queryset

class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer