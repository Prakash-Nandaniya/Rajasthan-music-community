from django.db import models
from django.contrib.auth.models import User
from .storage_backend import MainImageStorage, MoreImagesStorage

class SiteData(models.Model):
    id = models.AutoField(primary_key=True)  
    mainImage = models.ImageField(storage=MainImageStorage(),upload_to='', blank=True, null=True)
    moreImages = models.ImageField(storage=MoreImagesStorage(),upload_to='', blank=True, null=True)
    title=models.TextField()
    type=models.TextField()
    quickInfo=models.TextField()
    detail = models.TextField()  
    leader = models.CharField(max_length=255)  
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    def __str__(self):
        return f"Site ID: {self.id} - Leader: {self.leader}"






class UserFeedback(models.Model):
    id = models.AutoField(primary_key=True)  
    rating = models.PositiveIntegerField()  
    comment = models.TextField(blank=True, null=True)  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    site = models.ForeignKey(SiteData, on_delete=models.CASCADE)  

    def __str__(self):
        return f"Feedback by {self.user} for {self.site}"
    
    
    
    
    
    
