from rest_framework import serializers
from .models import SiteData, UserFeedback

class SiteDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteData
        fields = '__all__'

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'