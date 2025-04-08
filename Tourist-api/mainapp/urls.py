from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapView, UserFeedbackViewSet, SiteView, GroupNameCheck,UserProfile,LoginView, SendOTPView, VerifyOTPView 

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user/login/', LoginView.as_view(), name='login'),
    path("user/signup",UserProfile.as_view({"post":"create"})),
    path("artist/login/sendotp",SendOTPView.as_view()),
    path("artist/login/verifyotp",VerifyOTPView.as_view()),
    path("userProfile/update",UserProfile.as_view({"put":"update"})),
    path("userProfile/delete",UserProfile.as_view({"delete":"destroy"})),
    path("groupNameCheck",GroupNameCheck.as_view()),
    path('map/', MapView.as_view()),
    path('createsite/', SiteView.as_view(), name='site-create'),  
    path('detail/<int:pk>/', SiteView.as_view(), name='site-detail-update'),  
]