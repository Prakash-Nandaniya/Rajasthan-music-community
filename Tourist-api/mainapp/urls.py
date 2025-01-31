from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapView, UserFeedbackViewSet

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('map/', MapView.as_view()),
]