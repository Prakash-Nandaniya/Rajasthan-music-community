from rest_framework import serializers
from .models import Site, Artist, UserFeedback, MoreImage, Video,CustomUser
from django.db import transaction
from django.contrib.auth import get_user_model,authenticate
from django.contrib.auth.password_validation import validate_password

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
        fields = ['id', 'mainImage', 'community', 'groupName','instruments', 'latitude', 'longitude']  

class ArtistSerializer(serializers.ModelSerializer):
    artistMoreImages = MoreImageSerializer(many=True)
    artistVideos = VideoSerializer(many=True)

    class Meta:
        model = Artist
        fields = '__all__'

    def create(self, validated_data):
        print("Validated Data:", validated_data)
        more_images_data = validated_data.pop('artistMoreImages', [])
        videos_data = validated_data.pop('artistVideos', [])
        print("More Images Data:", more_images_data)
        print("Videos Data:", videos_data)

        artist = Artist.objects.create(**validated_data)

        for image_data in more_images_data:
            MoreImage.objects.create(artist=artist, **image_data)
        for video_data in videos_data:
            Video.objects.create(artist=artist, **video_data)

        return artist

class DetailSerializer(serializers.ModelSerializer):
    moreImages = MoreImageSerializer(many=True, required=False)
    videos = VideoSerializer(many=True, required=False)
    artists = ArtistSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Site
        fields = '__all__'

    @transaction.atomic
    def create(self, validated_data):
        request = self.context['request']

        # Handle site-related fields
        main_image = request.FILES.get('mainImage')
        more_images = [request.FILES[key] for key in request.FILES if 'media.images' in key]
        videos = [request.FILES[key] for key in request.FILES if 'media.videos' in key]
        access_data = ','.join([value for key, value in request.data.items() if key.startswith('access')])
        instruments = ','.join([value for key, value in request.data.items() if key.startswith('instruments')])
        validated_data.pop('mainImage', None)

        site = Site.objects.create(
            **validated_data,
            mainImage=main_image,
            access=access_data,
            instruments=instruments
        )

        for image_file in more_images:
            MoreImage.objects.create(site=site, image=image_file)
        for video_file in videos:
            Video.objects.create(site=site, video=video_file)

        # Parse artist data
        artists_data = {}
        for key, value in request.data.items():
            if key.startswith('artists['):
                try:
                    parts = key.split('.')
                    index = parts[0].replace('artists[', '').replace(']', '')
                    field = parts[1]
                    artists_data.setdefault(index, {})[field] = value
                except IndexError:
                    continue

        for key, file in request.FILES.items():
            if key.startswith('artists['):
                try:
                    parts = key.split('.')
                    index = parts[0].replace('artists[', '').replace(']', '')
                    field = parts[1]
                    if field == 'profilePicture':
                        artists_data.setdefault(index, {})[field] = file
                    elif field == 'media':
                        # Handle direct 'media' key based on content type
                        if file.content_type.startswith('image/'):
                            artists_data.setdefault(index, {}).setdefault('media.images', []).append(file)
                        elif file.content_type.startswith('video/'):
                            artists_data.setdefault(index, {}).setdefault('media.videos', []).append(file)
                    elif field == 'media' and len(parts) > 2:
                        subfield = parts[2]
                        if subfield == 'images':
                            artists_data.setdefault(index, {}).setdefault('media.images', []).append(file)
                        elif subfield == 'videos':
                            artists_data.setdefault(index, {}).setdefault('media.videos', []).append(file)
                except IndexError:
                    continue

        # Create artists
        for artist_data in artists_data.values():
            artist_data['site'] = site.id
            profile_picture = artist_data.pop('profilePicture', None)
            if profile_picture:
                artist_data['profilePicture'] = profile_picture

            artist_media_images = artist_data.pop('media.images', [])
            artist_media_videos = artist_data.pop('media.videos', [])
            artist_data['artistMoreImages'] = [{'image': img} for img in artist_media_images]
            artist_data['artistVideos'] = [{'video': vid} for vid in artist_media_videos]
            print("Artist data:", artist_data)

            artist_serializer = ArtistSerializer(data=artist_data, context={'request': request})
            if artist_serializer.is_valid():
                artist_serializer.save()
            else:
                print("Errors:", artist_serializer.errors)
                raise serializers.ValidationError(artist_serializer.errors)

        return site


class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'
        

CustomUser = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password')
        else:
            raise serializers.ValidationError('Email and password are required')

        data['user'] = user
        return data

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'country', 'password', 'is_staff', 'is_superuser')
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'is_staff': {'read_only': True},
            'is_superuser': {'read_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            country=validated_data.get('country', ''),
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.country = validated_data.get('country', instance.country)
        password = validated_data.get('password')
        if password:
            instance.set_password(password)
        instance.save()
        return instance