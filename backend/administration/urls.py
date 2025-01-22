from django.urls import path
from .views import (
    CreateGPAModel,
    GetGPAModel,
    DeleteGPAModel,
    CreateCourseModel,
    GetCourseModel,
    DeleteCourseModel,
    CreateExtracurricularModel,
    GetExtracurricularModel,
    DeleteExtracurricularModel,
)

urlpatterns = [
    path("gpa/create/", CreateGPAModel.as_view(), name="gpa-create"),
    path("gpa/delete/", DeleteGPAModel.as_view(), name="gpa-delete"),
    path("gpa/get/", GetGPAModel.as_view(), name="gpa-get"),
    path("course/create/", CreateCourseModel.as_view(), name="course-create"),
    path("course/delete/", DeleteCourseModel.as_view(), name="course-delete"),
    path("course/get/", GetCourseModel.as_view(), name="course-get"),
    path(
        "extracurricular/create/",
        CreateExtracurricularModel.as_view(),
        name="extracurricular-create",
    ),
    path(
        "extracurricular/delete/",
        DeleteExtracurricularModel.as_view(),
        name="extracurricular-delete",
    ),
    path(
        "extracurricular/get/",
        GetExtracurricularModel.as_view(),
        name="extracurricular-get",
    ),
]
