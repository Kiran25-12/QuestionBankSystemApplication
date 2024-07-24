from django.urls import path
from .views import UserRegistration,AllUserList,UserLogin,UserProfile,ChangePassword,AdminUserList,AdminUserDetail

urlpatterns = [
    path('register/',UserRegistration.as_view(),name='register'),
    path('login/',UserLogin.as_view(),name='login'),
    path('userprofile/', UserProfile.as_view(),name='userprofile'),
    path('changepassword/',ChangePassword.as_view(),name='changepassword'),
    path('allusers/',AllUserList.as_view(),name='a'),
    path('userslistforadmin/',AdminUserList.as_view(), name='admin_users_list'),
    path('editusers/<int:pk>/', AdminUserDetail.as_view(),name='admin_edit_user')
    
]