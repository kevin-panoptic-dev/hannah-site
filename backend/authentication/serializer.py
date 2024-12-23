from django.contrib.auth.models import User
from rest_framework import serializers
from .models import SiteUser


class SiteUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteUser
        fields = [
            "id",
            "username",
            "password",
            "email",
            "user_type",
            "is_active",
            "is_staff",
            "date_joined",
            "date_become_donator",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return SiteUser.objects.create_user(**validated_data)


class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
