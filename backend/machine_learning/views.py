from django.shortcuts import render
from .serializer import GeminiModelSerializer, DeleteGeminiModelSerializer
from .models import GeminiModel
from .api_clients.fetch import request_gemini
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView


class CreateGeminiModel(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return GeminiModel.objects.filter(user=user)

    async def post(self, request):
        serializer = GeminiModelSerializer(data=request.data)
        if serializer.is_valid():
            try:
                response = await self.fetch(serializer)
                return response
            except Exception as e:
                return Response(
                    {"detail": f"An error occurs in the code base, error: {e}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {
                    "detail": f"Invalid Gemini Model Serializer, error: {serializer.errors}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    async def fetch(self, serializer):
        request_type = serializer.validated_data["request_type"]
        message = serializer.validated_data["message"]
        match request_type:
            case "c":
                chat_response = await request_gemini("c", message)
                if chat_response["error"]:
                    match chat_response["response"]:
                        case "API ERROR":
                            return Response(
                                {
                                    "detail": "Gemini cannot response, may due to a policy update or reached limitation."
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        case "SYSTEM ERROR":
                            return Response(
                                {
                                    "detail": "Gemini cannot response, may due to a policy update or reached limitation."
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                        case "BAD INPUT":
                            return Response(
                                {"detail": f"{chat_response["error_message"]}"},
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            )
                        case _:
                            return Response(
                                {"detail": f"An unknown error occurs."},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                else:
                    serializer.save()
                    serializer.save(user=self.request.user, response_data=chat_response)
                    return Response(
                        {"detail": f"{chat_response["response"]}"},
                        status=status.HTTP_200_OK,
                    )

            case "f":
                relevant_validation_result = await request_gemini("r", message)
                positivity_validation_result = await request_gemini("s", message)
                if relevant_validation_result["error"]:
                    match relevant_validation_result["response"]:
                        case "API ERROR":
                            return Response(
                                {
                                    "detail": "Gemini cannot respond, likely due to a policy update, reached limitation, or request issue."
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        case "SYSTEM ERROR":
                            return Response(
                                {
                                    "detail": f"Gemini system encountered an error: {relevant_validation_result['error_message']}."
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                        case "IRRELEVANT":
                            return Response(
                                {"detail": relevant_validation_result["error_message"]},
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            )
                        case _:
                            return Response(
                                {
                                    "detail": "An unknown error occurred while processing the relevance validation."
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                elif positivity_validation_result["error"]:
                    match positivity_validation_result["response"]:
                        case "API ERROR":
                            return Response(
                                {
                                    "detail": "Gemini cannot respond, likely due to a policy update, reached limitation, or request issue."
                                },
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                        case "SYSTEM ERROR":
                            return Response(
                                {
                                    "detail": f"Gemini system encountered an error: {positivity_validation_result['error_message']}."
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                        case "NEGATIVE":
                            return Response(
                                {
                                    "detail": positivity_validation_result[
                                        "error_message"
                                    ]
                                },
                                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            )
                        case _:
                            return Response(
                                {
                                    "detail": "An unknown error occurred while processing the positivity validation."
                                },
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                else:
                    return Response(
                        {
                            "detail": f"{positivity_validation_result["response"]}, {relevant_validation_result["response"]}"
                        },
                        status=status.HTTP_201_CREATED,
                    )

            case _:
                raise Exception(
                    f"Invalid request type {request_type}, must be either `f` or `c`."
                )


class DeleteGeminiModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return GeminiModel.objects.all()

    def get_data(self, *, data_id: int):
        try:
            return GeminiModel.objects.get(id=data_id)
        except GeminiModel.DoesNotExist:
            raise NotFound("The Gemini model doesn't not exist.")

    def post(self, request):
        serializer = DeleteGeminiModelSerializer(data=request.data)
        if serializer.is_valid():
            data_id = serializer.validated_data["data_id"]  # type: ignore
            danger_data = self.get_data(data_id=data_id)
            danger_data.delete()
            return Response(
                {"detail": "data user delete successfully"},
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"detail": f"Invalid serializer, error: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
