from rest_framework import serializers
from .models import Site, Artist, UserFeedback

class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'mainImage', 'community', 'groupName', 'quickInfo', 'latitude', 'longitude']  
        
class DetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        
class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = '__all__'
