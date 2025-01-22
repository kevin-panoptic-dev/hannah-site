from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SiteUser
from .serializer import (
    SiteUserSerializer,
    LoginUserSerializer,
    LogoutUserSerializer,
    ChangeTypeToDonatorSerializer,
    DeleteUserSerializer,
)
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from pymodule.utility import prismelt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import NotFound
from django.utils import timezone
from typing import Literal
from rest_framework_simplejwt.authentication import JWTAuthentication


class CreateSiteUser(generics.ListCreateAPIView):
    queryset = SiteUser.objects.all()
    permission_classes = [AllowAny]
    serializer_class = SiteUserSerializer


class LoginSiteUser(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return SiteUser.objects.all()

    def post(self, request):
        serializer = LoginUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                username = serializer.validated_data["username"]  # type: ignore
            except Exception as e:
                username = None
                prismelt(e, color=(255, 0, 0))

            try:
                password = serializer.validated_data["password"]  # type: ignore
            except Exception as e:
                password = None
                prismelt(e, color=(255, 0, 0))

            try:
                email = serializer.validated_data["email"]  # type: ignore
            except Exception as e:
                email = None
                prismelt(e, color=(255, 0, 0))

            # prismelt(f"{username=}, {password=}, {email=}", color=(0, 0, 255))
            user = authenticate(username=username, password=password, email=email)
            if user:
                login(request, user)
                prismelt(user, color=(255, 0, 0))
                refresh_token = RefreshToken.for_user(user)
                refresh_token["user_id"] = user.id  # type: ignore
                access_token = refresh_token.access_token  # type: ignore
                user_type = user.user_type  # type: ignore
                username = user.username
                email = user.email
                refresh_token["email"] = email
                refresh_token["username"] = username

                if user_type == "d":
                    refresh_token["is_donator"] = True
                else:
                    refresh_token["is_donator"] = False

                if user.is_staff:
                    refresh_token["is_admin"] = True
                else:
                    refresh_token["is_admin"] = False

                return Response(
                    {
                        "refresh": str(refresh_token),
                        "access": str(access_token),
                        "user_type": user_type,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": f"Invalid login username, email or password"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        else:
            return Response(
                {"detail": f"Invalid serializer, {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class DeleteSiteUser(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return SiteUser.objects.filter(user=self.request.user)

    def get_object(self, user_id: int):
        try:
            return SiteUser.objects.get(id=user_id)
        except SiteUser.DoesNotExist:
            # prismelt(user_id, color=(255, 0, 0))
            raise NotFound("The user does not exist.")

    def post(self, request):
        serializer = DeleteUserSerializer(data=request.data)
        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]  # type: ignore
            delete_type = serializer.validated_data["delete_type"]  # type: ignore

            danger_user = self.get_object(user_id=user_id)
            if danger_user.user_type == "d" and not delete_type:
                return Response(
                    {"detail": "this is a donator, are you sure to remove?"},
                    status=status.HTTP_302_FOUND,
                )

            else:
                danger_user.delete()
                return Response(
                    {"detail": "site user delete successfully"},
                    status=status.HTTP_202_ACCEPTED,
                )
        else:
            return Response(
                {"detail": f"serializer error {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class LogoutSiteUser(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get_queryset(self):
        return SiteUser.objects.all()

    def post(self, request):
        serializer = LogoutUserSerializer(data=request.data)
        if serializer.is_valid():
            try:
                refresh_token = serializer.validated_data["refresh_token"]  # type: ignore

                if not refresh_token:
                    return Response(
                        {"detail": "No refresh token provided."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                token = RefreshToken(refresh_token)
                token.blacklist()

                return Response(
                    {"detail": "Successfully logged out."},
                    status=status.HTTP_200_OK,
                )

            except Exception as e:
                return Response(
                    {"detail": f"Error logging out: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            return Response(
                {"detail": f"serializer error: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ChangTypeToDonator(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return SiteUser.objects.all()

    def get_donator(self, user_id):
        try:
            return SiteUser.objects.get(id=user_id)
        except SiteUser.DoesNotExist:
            raise NotFound("This site user doesn't not exist.")

    def post(self, request):
        serializer = ChangeTypeToDonatorSerializer(data=request.data)
        if serializer.is_valid():
            try:
                donator_id: int = serializer.validated_data["donator_id"]  # type: ignore
                amount: float = serializer.validated_data["amount"]  # type: ignore
                donator = self.get_donator(donator_id)
                date = timezone.now()
                if donator.user_type != "d":
                    donator.donated_amount = amount
                    donator.date_become_donator = date
                    donator.user_type = "d"
                else:
                    # donated_amount must not be null to become a donator
                    assert isinstance(donator.donated_amount, float)
                    donator.donated_amount += amount

                donator.save()
                return Response(
                    {"detail": "user successfully donated"}, status=status.HTTP_200_OK
                )
            except AssertionError:
                return Response(
                    {
                        "detail": "The code have some logic error around donation handling."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            except Exception as e:
                return Response(
                    {
                        "detail": f"an unknown error happens in handling donator status update: {str(e)}"
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"detail": f"serializer error: {serializer.errors}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
