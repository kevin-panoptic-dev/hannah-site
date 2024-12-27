from django.shortcuts import render
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from pymodule.utility import prismelt
from .models import GalleryCard
from .serializer import GalleryCardSerializer, DeleteGalleryCardSerializer


class CreateGalleryCard(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return GalleryCard.objects.all()

    def post(self, request):
        serializer = GalleryCardSerializer(data=request.data)
        if serializer.is_valid():
            return self.perform_create(serializer)
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_create(self, serializer):
        serializer.save()
        return Response(
            {"detail": "Gallery Card is successfully created."},
            status=status.HTTP_201_CREATED,
        )


class GetGalleryCard(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return GalleryCard.objects.all()

    def get(self, request):
        try:
            objects = GalleryCard.objects.all()
            response_data = []
            for data in objects:
                image_url = request.build_absolute_uri(data.image.url)
                response_data.append(
                    {
                        "id": data.id,  # type: ignore
                        "title": data.title,
                        "description": data.description,
                        "image": image_url,
                    }
                )
            return Response({"detail": response_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"detail": f"An unknown error occurs: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DeleteGalleryCard(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return GalleryCard.objects.all()

    def get_model(self, model_id: int):
        try:
            return GalleryCard.objects.get(id=model_id)
        except GalleryCard.DoesNotExist:
            raise NotFound("This gallery card does not exist.")

    def post(self, request):
        serializer = DeleteGalleryCardSerializer(data=request.data)
        if serializer.is_valid():
            model_id = serializer.validated_data["model_id"]  # type: ignore
            danger_model = self.get_model(model_id)
            danger_model.delete()
            return Response(
                {"detail": "Gallery Card delete successfully."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
