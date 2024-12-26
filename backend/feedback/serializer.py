from .models import FeedbackModel
from rest_framework import serializers


class FeedbackModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackModel
        fields = ["id", "title", "praise_type", "length_type", "content", "author"]


class DeleteFeedbackModelSerializer(serializers.Serializer):
    feedback_id = serializers.IntegerField(required=True)
