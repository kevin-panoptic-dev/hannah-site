from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import EmailValidator
from .constants import USER_TYPE_CHOICE


class SiteUser(AbstractUser):
    email = models.EmailField(
        unique=True, validators=[EmailValidator(message="please enter your email.")]
    )
    user_type = models.CharField(max_length=1, choices=USER_TYPE_CHOICE, default="n")
    groups = models.ManyToManyField(
        "auth.Group", related_name="SiteUser_set", blank=True
    )

    user_permissions = models.ManyToManyField(
        "auth.Permission", related_name="SiteUser_permissions_set", blank=True
    )
    date_joined = models.DateTimeField(auto_now_add=True)
    date_become_donator = models.DateTimeField(
        auto_now_add=False, blank=True, null=True
    )
    donated_amount = models.FloatField(blank=True, null=True)

    def __str__(self) -> str:
        return self.username
