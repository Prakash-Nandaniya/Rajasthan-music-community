from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapView, UserFeedbackViewSet, DetailView

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('map/', MapView.as_view()),
    path('detail/<int:id>', DetailView.as_view()),
]