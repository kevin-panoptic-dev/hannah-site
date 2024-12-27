from django.shortcuts import render
from django.http import FileResponse
from .models import GPAModel, CourseModel, ExtracurricularModel
from .serializer import (
    GPAModelSerializer,
    CourseModelSerializer,
    ExtracurricularModelSerializer,
    DeleteGPAModelSerializer,
    DeleteExtracurricularModelSerializer,
    DeleteCourseModelSerializer,
    ObtainCourseModelSerializer,
)
from .plot import create_gpa_graph
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import numpy as np
from pymodule.utility import prismelt


class CreateGPAModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return GPAModel.objects.all()

    def post(self, request):
        serializer = GPAModelSerializer(data=request.data)
        if serializer.is_valid():
            return self.perform_create(serializer)
        else:
            Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_create(self, serializer):
        number = serializer.validated_data["number"]
        if not (3.5 <= number <= 5.0):
            return Response(
                {"detail": f"Unacceptable GPA {number}."},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )
        serializer.save()
        return Response({"detail": "GPA data added"}, status=status.HTTP_201_CREATED)


class GetGPAModel(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return GPAModel.objects.all()

    def get(self, request):
        try:
            buffer, image_type = create_gpa_graph()
            response = FileResponse(buffer, content_type=image_type)
            response["Content-Disposition"] = 'inline; filename="gpa_graph.png"'
            return response
        except Exception as e:
            return Response(
                {"detail": f"An error occurs: {e}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DeleteGPAModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return GPAModel.objects.all()

    def get_object(self, model_id: int):
        try:
            return GPAModel.objects.get(id=model_id)
        except GPAModel.DoesNotExist:
            raise NotFound("This GPA model does not exist.")

    def post(self, request):
        serializer = DeleteGPAModelSerializer(data=request.data)
        if serializer.is_valid():
            model_id = serializer.validated_data["model_id"]  # type: ignore
            object = self.get_object(model_id)
            object.delete()
            return Response({"detail": "GPA data deleted"}, status=status.HTTP_200_OK)
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CreateExtracurricularModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return ExtracurricularModel.objects.all()

    def post(self, request):
        serializer = ExtracurricularModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Successfully create a Extracurricular Model"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DeleteExtracurricularModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return ExtracurricularModel.objects.all()

    def get_object(self, model_id: int):
        try:
            return ExtracurricularModel.objects.get(id=model_id)
        except ExtracurricularModel.DoesNotExist:
            raise NotFound("This extracurricular model does not exist.")

    def post(self, request):
        serializer = DeleteExtracurricularModelSerializer(data=request.data)
        if serializer.is_valid():
            model_id = serializer.validated_data["model_id"]  # type: ignore
            object = self.get_object(model_id)
            object.delete()
            return Response(
                {"detail": "Extracurricular data deleted"},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetExtracurricularModel(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return ExtracurricularModel.objects.all()

    def get(self, request):
        try:
            objects = ExtracurricularModel.objects.all()
            response_data = []
            for data in objects:
                image_url = (
                    request.build_absolute_uri(data.image.url) if data.image else None
                )
                response_data.append(
                    {
                        "id": data.id,  # type: ignore
                        "date": data.date,
                        "extracurricular_name": data.extracurricular_name,
                        "image": image_url,
                        "reason": data.reason,
                    }
                )
            return Response({"detail": response_data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {
                    "detail": f"An error occurs during getting extracurricular models: {e}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CreateCourseModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CourseModel.objects.all()

    def post(self, request):
        serializer = CourseModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Successfully create a Course Model"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DeleteCourseModel(APIView):
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return CourseModel.objects.all()

    def get_object(self, model_id: int):
        try:
            return CourseModel.objects.get(id=model_id)
        except CourseModel.DoesNotExist:
            raise NotFound("This course model does not exist.")

    def post(self, request):
        serializer = DeleteCourseModelSerializer(data=request.data)
        if serializer.is_valid():
            model_id = serializer.validated_data["model_id"]  # type: ignore
            danger_course = self.get_object(model_id)
            danger_course.is_deleted = True
            danger_course.save()
            return Response(
                {"detail": "Course data deleted"}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class GetCourseModel(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return CourseModel.objects.all()

    def post(self, request):
        serializer = ObtainCourseModelSerializer(data=request.data)
        if serializer.is_valid():
            try:
                return self.perform_get(serializer)
            except Exception as e:
                return Response(
                    {"detail": f"no more course data in this field is available: {e}"},
                    status=status.HTTP_204_NO_CONTENT,
                )
        else:
            return Response(
                {"detail": f"Invalid serializer: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def perform_get(self, serializer):
        course_type = serializer.validated_data["course_type"]
        number_required = serializer.validated_data["number_required"]
        acceptable_course = CourseModel.objects.filter(course_type=course_type)
        returned_courses = []
        enough = True

        number_of_instance = [
            course.id for course in acceptable_course if not course.is_deleted  # type: ignore
        ]
        bad_numbers = [
            course.id for course in acceptable_course if course.is_deleted  # type: ignore
        ]
        pool = list(set(number_of_instance) - set(bad_numbers))

        if len(pool) <= number_required:
            data_used = pool
            enough = False
        else:
            data_used = np.random.choice(pool, size=number_required, replace=False)

        for integer in data_used:
            returned_courses.append(acceptable_course.get(id=integer))
        json_object_list = self.object_to_object(returned_courses)
        if enough:
            return Response({"detail": json_object_list}, status=status.HTTP_200_OK)
        return Response(
            {"detail": json_object_list}, status=status.HTTP_206_PARTIAL_CONTENT
        )

    def object_to_object(self, courses: list):
        json_object_list = []
        for model_object in courses:
            json_object_list.append(
                {
                    "id": model_object.id,
                    "date": model_object.date,
                    "reason": model_object.reason,
                    "course_name": model_object.course_name,
                }
            )
        return json_object_list
