from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("auth-rest/", include("rest_framework.urls")),
    path("auth/", include("authentication.urls")),
    path("ai/", include("machine_learning.urls")),
    path("comment/", include("feedback.urls")),
    path("upload/", include("administration.urls")),
    path("gallery/", include("gallery.urls")),
    path("forum/", include("forum.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
