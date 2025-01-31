from django.contrib import admin
from .models import Site, Artist, UserFeedback, MoreImage, Video

admin.site.register([Site,Artist,UserFeedback,MoreImage,Video])