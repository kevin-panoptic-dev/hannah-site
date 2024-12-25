from django.urls import path
from .views import DeleteForumMessage, CreateForumMessage, GetForumMessage

urlpatterns = [
    path("create/", CreateForumMessage.as_view(), name="forum-create"),
    path("delete/", DeleteForumMessage.as_view(), name="forum-delete"),
    path("get/", GetForumMessage.as_view(), name="forum-get"),
]
