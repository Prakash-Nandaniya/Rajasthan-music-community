from django.db import models
from django.contrib.auth.models import User
from .storage_backend import MainImageStorage, MoreImagesStorage, VideosStorage

class Site(models.Model):
    id = models.AutoField(primary_key=True)
    mainImage = models.ImageField(storage=MainImageStorage(), upload_to='main_images/', blank=False, null=False)
    community = models.CharField(max_length=255, blank=False, null=False)
    groupName = models.CharField(max_length=255, blank=False, null=False)
    quickInfo = models.TextField(blank=False, null=False)
    detail = models.TextField(blank=True, null=True)
    address = models.TextField(blank=False, null=False)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    def __str__(self):
        return f"Site ID: {self.id} - Title: {self.groupName}"

class Artist(models.Model):
    id = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name="artists")  
    name = models.CharField(max_length=255, blank=False, null=False)
    profilePicture = models.ImageField(storage=MainImageStorage(), upload_to='artist_profiles/', blank=False, null=False)
    instrument = models.CharField(max_length=255, blank=False, null=False)
    detail = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class MoreImage(models.Model):
    image = models.ImageField(storage=MoreImagesStorage(), upload_to='more_images/')
    site = models.ForeignKey(Site, related_name='moreImages', on_delete=models.CASCADE, null=True, blank=True)
    artist = models.ForeignKey(Artist, related_name='artistMoreImages', on_delete=models.CASCADE, null=True, blank=True)
    def __str__(self):
        return self.image.url

class Video(models.Model):
    video = models.FileField(storage=VideosStorage(), upload_to='videos/')
    site = models.ForeignKey(Site, related_name='videos', on_delete=models.CASCADE, null=True, blank=True)
    artist = models.ForeignKey(Artist, related_name='artistVideos', on_delete=models.CASCADE, null=True, blank=True)  
    def __str__(self):
        return self.video.url

class UserFeedback(models.Model):
    id = models.AutoField(primary_key=True)  
    rating = models.PositiveIntegerField()  
    comment = models.TextField(blank=True, null=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    site = models.ForeignKey(Site, on_delete=models.CASCADE)  

    def __str__(self):
        return f"Feedback by {self.user} for {self.site}"