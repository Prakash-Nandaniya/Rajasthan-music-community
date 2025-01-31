from django.contrib import admin
from .models import Site, Artist, UserFeedback

admin.site.register([Site,Artist,UserFeedback])