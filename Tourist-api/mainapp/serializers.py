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
    artistMoreImages = MoreImageSerializer(many=True, read_only=True)  
    artistVideos = VideoSerializer(many=True, read_only=True)  
    class Meta:
        model = Artist
        fields = '__all__'

class DetailSerializer(serializers.ModelSerializer):
    moreImages = MoreImageSerializer(many=True, required=False)  
    videos = VideoSerializer(many=True, required=False)  
    artists = ArtistSerializer(many=True, required=False)

    class Meta:
        model = Site
        fields = '__all__'

    def create(self, validated_data):
        # Get the request data from context
        more_images_data = self.context['request'].FILES.getlist('moreImages[]')
        videos_data = self.context['request'].FILES.getlist('videos[]')
        artists_data = validated_data.pop('artists', [])

        # Create the Site object
        site = Site.objects.create(**validated_data)

        # Add Artists (if any)
        for artist_data in artists_data:
            artist = Artist.objects.create(site=site, **artist_data)

            # You can optionally handle artist-specific media here:
            artist_more_images = artist_data.get('artistMoreImages', [])
            artist_videos = artist_data.get('artistVideos', [])

            # Add More Images for Artist
            for artist_image in artist_more_images:
                MoreImage.objects.create(artist=artist, image=artist_image)

            # Add Videos for Artist
            for artist_video in artist_videos:
                Video.objects.create(artist=artist, video=artist_video)

        # Add More Images for Site
        for file in more_images_data:
            MoreImage.objects.create(site=site, image=file)

        # Add Videos for Site
        for file in videos_data:
            Video.objects.create(site=site, video=file)

        return site


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        


