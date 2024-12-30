from django.shortcuts import render
from .serializer import GeminiModelSerializer, DeleteGeminiModelSerializer
from .models import GeminiModel
from .api_clients.fetch import request_gemini
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.views import APIView
import asyncio
import logging
from pymodule.utility import prismelt

logging.basicConfig(
    level=logging.DEBUG,
    format="%(filename)s:%(lineno)d - %(message)s",
    handlers=[logging.StreamHandler()],
)

logger = logging.getLogger()


class CreateGeminiModel(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        user = self.request.user
        return GeminiModel.objects.filter(user=user)

    def post(self, request):
        serializer = GeminiModelSerializer(data=request.data)
        if serializer.is_valid():
            # logger.info("serializer is valid.")
            try:
                response = self.fetch(serializer)
                # logger.info("fetch data from fetch function successfully.")
                if response[0] == status.HTTP_200_OK:  # chat response oks
                    serializer.save()
                    serializer.save(
                        user=self.request.user, response_data=response[1]["detail"]
                    )
                    return Response(
                        {"detail": response[1]["detail"]["response"]},
                        status=status.HTTP_200_OK,
                    )
                return Response(response[1], status=response[0])
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

    @classmethod
    async def anti_async(cls, request_types: list, messages: list):
        tasks = []
        for i in range(len(request_types)):
            tasks.append(
                asyncio.create_task(request_gemini(request_types[i], messages[i]))
            )

        results = await asyncio.gather(*tasks)
        return results

    @classmethod
    def fetch(cls, serializer):
        request_type = serializer.validated_data["request_type"]
        message = serializer.validated_data["message"]
        # logger.info(f"{message=}, {request_type=} in fetch setup.")
        match request_type:
            case "c":
                loop = asyncio.new_event_loop()
                chat_response = loop.run_until_complete(request_gemini("c", message))
                # logger.info("chat response run successfully.")
                # logger.info(f"{chat_response["error"]=}")
                if chat_response["error"]:
                    match chat_response["response"]:
                        case "API ERROR":
                            return status.HTTP_400_BAD_REQUEST, {
                                "detail": f"Gemini cannot respond, may be due to a policy update or reached limitation: {chat_response["error_message"]}"
                            }
                        case "SYSTEM ERROR":
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": f"Gemini system encounters an error: {chat_response["error_message"]}"
                            }
                        case "BAD INPUT":
                            return status.HTTP_422_UNPROCESSABLE_ENTITY, {
                                "detail": chat_response["error_message"]
                            }
                        case _:
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": "An unknown error occurred."
                            }
                else:
                    prismelt(
                        "The detail is passed to status successfully", color=(255, 0, 0)
                    )
                    return status.HTTP_200_OK, {"detail": chat_response}

            case "f":
                loop = asyncio.new_event_loop()
                (
                    relevant_validation_result,
                    positivity_validation_result,
                    type_validation_result,
                ) = loop.run_until_complete(
                    cls.anti_async(["r", "s", "t"], [message, message, message])
                )

                # Handle errors for relevant validation
                if relevant_validation_result["error"]:
                    match relevant_validation_result["response"]:
                        case "API ERROR":
                            return status.HTTP_400_BAD_REQUEST, {
                                "detail": f"Gemini cannot respond, likely due to a policy update, reached limitation, or request issue: {relevant_validation_result["error_message"]}"
                            }
                        case "SYSTEM ERROR":
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": f"Gemini system encountered an error: {relevant_validation_result['error_message']}."
                            }
                        case "IRRELEVANT":
                            return status.HTTP_422_UNPROCESSABLE_ENTITY, {
                                "detail": relevant_validation_result["error_message"]
                            }
                        case _:
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": "An unknown error occurred while processing the relevance validation."
                            }

                elif positivity_validation_result["error"]:
                    match positivity_validation_result["response"]:
                        case "API ERROR":
                            return status.HTTP_400_BAD_REQUEST, {
                                "detail": f"Gemini cannot respond, likely due to a policy update, reached limitation, or request issue: {positivity_validation_result["error_message"]}"
                            }
                        case "SYSTEM ERROR":
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": f"Gemini system encountered an error: {positivity_validation_result['error_message']}."
                            }
                        case "NEGATIVE":
                            return status.HTTP_422_UNPROCESSABLE_ENTITY, {
                                "detail": positivity_validation_result["error_message"]
                            }
                        case _:
                            return status.HTTP_500_INTERNAL_SERVER_ERROR, {
                                "detail": "An unknown error occurred while processing the positivity validation."
                            }
                else:
                    # If all validations pass
                    return status.HTTP_201_CREATED, {
                        "detail": str(type_validation_result["response"])
                    }

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
                {"detail": "data delete successfully"},
                status=status.HTTP_200_OK,
            )

        else:
            return Response(
                {"detail": f"Invalid serializer, error: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
