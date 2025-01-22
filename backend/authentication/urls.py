from django.urls import path
from .views import (
    CreateSiteUser,
    LoginSiteUser,
    DeleteSiteUser,
    LogoutSiteUser,
    ChangTypeToDonator,
)

urlpatterns = [
    path("register/", CreateSiteUser.as_view(), name="register"),
    path("login/", LoginSiteUser.as_view(), name="login"),
    path("delete/", DeleteSiteUser.as_view(), name="delete"),
    path("logout/", LogoutSiteUser.as_view(), name="logout"),
    path("thankyou/", ChangTypeToDonator.as_view(), name="thankyou"),
]
