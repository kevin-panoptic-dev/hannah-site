from django.db import models
from authentication.models import SiteUser
from .constants import REQUEST_TYPE_CHOICE


class GeminiModel(models.Model):
    message = models.TextField()
    request_type = models.CharField(max_length=1, choices=REQUEST_TYPE_CHOICE)
    response_data = models.JSONField(blank=True, null=True)
    user = models.ForeignKey(
        SiteUser,
        on_delete=models.CASCADE,
        related_name="GeminiModel",
        blank=True,
        null=True,
    )
