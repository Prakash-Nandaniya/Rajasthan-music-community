from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MapView, UserFeedbackViewSet, SiteView, GroupNameCheck,CustomUserProfile,LoginView, SendOTPView, VerifyOTPView, LogoutView 

router = DefaultRouter()
router.register(r'userfeedback', UserFeedbackViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('user/login/', LoginView.as_view(), name='login'),
    path("user/signup/",CustomUserProfile.as_view()),
    path("artist/login/sendotp/",SendOTPView.as_view()),
    path("artist/login/verifyotp/",VerifyOTPView.as_view()),
    path("userProfile/update/",CustomUserProfile.as_view()),
    path("userProfile/delete/",CustomUserProfile.as_view()),
    path("groupNameCheck/",GroupNameCheck.as_view()),
    path('map/', MapView.as_view()),
    path('createsite/', SiteView.as_view(), name='site-create'),  
    path('detail/<int:pk>/', SiteView.as_view(), name='site-detail-update'),  
    path('logout/', LogoutView.as_view(), name='logout'),
]