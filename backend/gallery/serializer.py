from .models import GalleryCard
from rest_framework import serializers


class GalleryCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCard
        fields = ["id", "image", "title", "description"]


class DeleteGalleryCardSerializer(serializers.Serializer):
    model_id = serializers.IntegerField(required=True)
