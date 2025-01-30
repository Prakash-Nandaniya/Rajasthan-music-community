from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SiteMapView, UserFeedbackViewSet

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('sitemap/', SiteMapView.as_view(), name='sitemap-list'),
]