from django.db.models.manager import BaseManager
from django.shortcuts import render
from .models import FeedbackModel
from .serializer import (
    FeedbackModelSerializer,
    DeleteFeedbackModelSerializer,
    ObtainFeedbackModelSerializer,
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from machine_learning.views import CreateGeminiModel
from rest_framework_simplejwt.authentication import JWTAuthentication


class ObtainFeedbackModel(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self, praise_type: str, length_type) -> BaseManager[FeedbackModel]:
        return FeedbackModel.objects.filter(
            praise_type=praise_type, length_type=length_type
        )

    def post(self, request):
        serializer = ObtainFeedbackModelSerializer(data=request.data)
        if serializer.is_valid():
            return self.perform_get(serializer)
        else:
            return Response(
                {"detail": f"Invalid obtain serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_get(self, serializer):
        praise_type = serializer.validated_data["praise_type"]
        length_type = serializer.validated_data["length_type"]
        data = self.get_queryset(praise_type, length_type)
        serialized_data = self.object_to_object(data)
        return Response({"detail": serialized_data}, status=status.HTTP_200_OK)

    def object_to_object(self, data: BaseManager[FeedbackModel]):
        json_object_list = []
        for feedback in data:
            json_object_list.append(
                {
                    # WARN: this author string procure is not robust enough
                    "id": feedback.id,  # type: ignore
                    "title": feedback.title,
                    "praise_type": feedback.praise_type,
                    "length_type": feedback.length_type,
                    "content": feedback.content,
                    "author": feedback.author.username,  # type: ignore
                }
            )
        return json_object_list


class PseudoSerializer:
    def __init__(self, data: dict):
        self.validated_data = data

    def is_valid(self):
        return True


class CreateFeedbackModel(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return FeedbackModel.objects.filter(user=user)

    def post(self, request):
        serializer = FeedbackModelSerializer(data=request.data)
        if serializer.is_valid():
            return self.perform_create(serializer)
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_create(self, serializer):
        content: str = serializer.validated_data["content"]
        if text_length := len(content.split()) <= 25:
            return Response(
                {
                    "detail": f"Length of the comment is too short: {text_length}, 25 is required."
                },
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )
        elif len(content.split()) <= 80:
            length_type = "s"
        else:
            length_type = "l"

        # we must convert the create feedback serializer into a pseudo gemini model serializer so that fetch method could understand
        pseudo_serializer = self.serializer_converter(serializer)
        pseudo_http_response = CreateGeminiModel.fetch(pseudo_serializer)
        if pseudo_http_response[0] == status.HTTP_201_CREATED:
            serializer.save(
                author=self.request.user,
                length_type=length_type,
                praise_type=pseudo_http_response[1]["detail"][0].lower(),
            )
            serializer.save()
            return Response(
                {"detail": "feedback processed successfully."},
                status=pseudo_http_response[0],
            )
        else:
            return Response(pseudo_http_response[1], status=pseudo_http_response[0])

    def serializer_converter(self, serializer):
        message: str = serializer.validated_data["content"]
        request_type = "f"
        data = {"message": message, "request_type": request_type}
        new_pseudo_serializer = PseudoSerializer(data)
        return new_pseudo_serializer


class DeleteFeedbackModel(APIView):
    permission_classes = [IsAdminUser]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return FeedbackModel.objects.all()

    def get_feedback(self, feedback_id: int):
        try:
            return FeedbackModel.objects.get(id=feedback_id)
        except FeedbackModel.DoesNotExist:
            raise NotFound("This Feedback Model does not exist.")

    def post(self, request):
        serializer = DeleteFeedbackModelSerializer(data=request.data)
        if serializer.is_valid():
            feedback_id = serializer.validated_data["feedback_id"]  # type: ignore
            danger_feedback = self.get_feedback(feedback_id)
            danger_feedback.delete()
            return Response(
                {"detail": "Successfully delete the feedback"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": f"Invalid Serializer, {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
