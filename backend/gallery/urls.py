from django.urls import path
from .views import CreateGalleryCard, GetGalleryCard, DeleteGalleryCard

urlpatterns = [
    path("create/", CreateGalleryCard.as_view(), name="card-create"),
    path("delete/", DeleteGalleryCard.as_view(), name="card-delete"),
    path("get/", GetGalleryCard.as_view(), name="card-get"),
]
