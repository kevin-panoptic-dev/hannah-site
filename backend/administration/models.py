from django.db import models
from .constants import COURSE_TYPE


class GPAModel(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False)
    number = models.FloatField()


class CourseModel(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False)
    course_name = models.CharField(max_length=25)
    course_type = models.CharField(max_length=1, choices=COURSE_TYPE)
    reason = models.CharField(max_length=250)
    is_deleted = models.BooleanField(default=False)


class ExtracurricularModel(models.Model):
    date = models.DateField(auto_now=False, auto_now_add=False)
    extracurricular_name = models.CharField(max_length=30)
    reason = models.CharField(max_length=250)
    image = models.ImageField(blank=True, null=True, upload_to="extracurricular/")
