from rest_framework import serializers
from .models import Site, Artist, UserFeedback, MoreImage, Video

class MoreImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoreImage
        fields = ['id', 'image']  


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['id', 'video']  


class MapSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'mainImage', 'community', 'groupName', 'quickInfo', 'latitude', 'longitude']  

class ArtistSerializer(serializers.ModelSerializer):
    moreImages = MoreImageSerializer(many=True, read_only=True)  
    videos = VideoSerializer(many=True, read_only=True)  
    class Meta:
        model = Artist
        fields = '__all__'

class DetailSerializer(serializers.ModelSerializer):
    moreImages = MoreImageSerializer(many=True, read_only=True)  
    videos = VideoSerializer(many=True, read_only=True)  
    artists = ArtistSerializer(many=True, read_only=True)
    class Meta:
        model = Site
        fields = '__all__'  


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        
