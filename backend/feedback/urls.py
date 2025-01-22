from django.urls import path
from .views import DeleteFeedbackModel, CreateFeedbackModel, ObtainFeedbackModel

urlpatterns = [
    path("create/", CreateFeedbackModel.as_view(), name="create-feedback"),
    path("delete/", DeleteFeedbackModel.as_view(), name="delete-feedback"),
    path("get/", ObtainFeedbackModel.as_view(), name="get-feedback"),
]
