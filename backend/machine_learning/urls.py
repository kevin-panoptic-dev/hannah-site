from django.urls import path
from .views import CreateGeminiModel, DeleteGeminiModel

urlpatterns = [
    path("create/", CreateGeminiModel.as_view(), name="create-ai"),
    path("delete/", DeleteGeminiModel.as_view(), name="delete-ai-data"),
]
