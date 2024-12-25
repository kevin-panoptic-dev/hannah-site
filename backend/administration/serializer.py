from .models import GPAModel, CourseModel, ExtracurricularModel
from rest_framework import serializers


class GPAModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPAModel
        fields = ["id", "date", "number"]


class DeleteGPAModelSerializer(serializers.ModelSerializer):
    model_id = serializers.IntegerField(required=True)

    # confusing, but a meta class is needed (for resolving assertion error)
    class Meta:
        model = GPAModel
        fields = ["model_id"]


class CourseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseModel
        fields = ["id", "date", "course_name", "reason", "course_type", "is_deleted"]


class ObtainCourseModelSerializer(serializers.Serializer):
    course_type = serializers.CharField(required=True)
    number_required = serializers.IntegerField(required=True)


class DeleteCourseModelSerializer(serializers.Serializer):
    model_id = serializers.IntegerField(required=True)

    class Meta:
        model = CourseModel
        fields = ["model_id"]


class ExtracurricularModelSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()

    class Meta:
        model = ExtracurricularModel
        fields = ["id", "date", "extracurricular_name", "reason", "image"]

    # def get_image(self, obj):
    #     request = self.context.get("request")
    #     if request and obj.image:
    #         return request.build_absolute_uri(obj.image.url)
    #     return obj.image.url if obj.image else None


class DeleteExtracurricularModelSerializer(serializers.Serializer):
    model_id = serializers.IntegerField(required=True)

    class Meta:
        model = ExtracurricularModel
        fields = ["model_id"]
