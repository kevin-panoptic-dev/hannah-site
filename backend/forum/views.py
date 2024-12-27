from django.shortcuts import render
from .models import ForumMessage
from .serializer import ForumMessageSerializer, DeleteForumMessageSerializer
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from pymodule.utility import prismelt
from django.utils import timezone
from datetime import timedelta


class CreateForumMessage(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ForumMessage.objects.all()

    def post(self, request):
        serializer = ForumMessageSerializer(data=request.data)
        if serializer.is_valid():
            return self.perform_create(serializer)
        else:
            return Response(
                {"detail": f"Invalid serializer, {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        serializer.save()
        return Response(
            {"detail": "Forum message created."}, status=status.HTTP_201_CREATED
        )


class GetForumMessage(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        thirty_days_ago = timezone.now() - timedelta(days=30)
        return ForumMessage.objects.filter(date__gte=thirty_days_ago)

    def get(self, request):
        messages = list(self.get_queryset())
        json_object_list = self.object_to_object(messages)
        # prismelt(type(json_object_list[0]).__name__, color=(255, 0, 0))
        return Response({"detail": json_object_list}, status=status.HTTP_200_OK)

    def object_to_object(self, messages: list):
        json_object_list = []
        for model_object in messages:
            json_object_list.append(
                {
                    "id": model_object.id,
                    "date": model_object.date,
                    "message": model_object.message,
                    "author": model_object.author.username,
                }
            )
        return json_object_list


class DeleteForumMessage(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ForumMessage.objects.all()

    def get_message(self, message_id: int):
        try:
            danger_message = ForumMessage.objects.get(id=message_id)
            if danger_message.author != self.request.user and not self.request.user.is_staff:  # type: ignore
                return None
            return danger_message
        except ForumMessage.DoesNotExist:
            raise NotFound("The forum message does not exist.")

    def post(self, request):
        serializer = DeleteForumMessageSerializer(data=request.data)
        if serializer.is_valid():
            message_id = serializer.validated_data["message_id"]  # type: ignore
            danger_message = self.get_message(message_id)
            if danger_message is None:
                return Response(
                    {"detail": "You are not allow to delete this message."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            danger_message.delete()
            return Response(
                {"detail": "Message successfully deleted."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
