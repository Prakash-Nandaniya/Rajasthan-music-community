from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapView, UserFeedbackViewSet, SiteView, GroupNameCheck,UserProfile,LoginView 

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path("signup",UserProfile.as_view({"post":"create"})),
    path("userProfile/update",UserProfile.as_view({"put":"update"})),
    path("userProfile/delete",UserProfile.as_view({"delete":"destroy"})),
    path("groupNameCheck",GroupNameCheck.as_view()),
    path('map/', MapView.as_view()),
    path('createsite/', SiteView.as_view(), name='site-create'),  
    path('detail/<int:pk>/', SiteView.as_view(), name='site-detail-update'),  
]