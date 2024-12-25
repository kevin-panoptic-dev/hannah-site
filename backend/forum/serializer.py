from rest_framework import serializers
from .models import ForumMessage


class ForumMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumMessage
        fields = ["id", "message", "author", "date"]


class DeleteForumMessageSerializer(serializers.Serializer):
    message_id = serializers.IntegerField(required=True)
