from django.urls import path
from .views import DeleteFeedbackModel, CreateFeedbackModel

urlpatterns = [
    path("create/", CreateFeedbackModel.as_view(), name="create-feedback"),
    path("delete/", DeleteFeedbackModel.as_view(), name="delete-feedback"),
]
