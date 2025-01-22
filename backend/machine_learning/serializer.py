from rest_framework import serializers
from .models import GeminiModel


class GeminiModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeminiModel
        fields = ["id", "message", "request_type", "response_data", "user"]


class DeleteGeminiModelSerializer(serializers.Serializer):
    data_id = serializers.IntegerField(required=True)
