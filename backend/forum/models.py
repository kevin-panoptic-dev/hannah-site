from django.db import models
from authentication.models import SiteUser


class ForumMessage(models.Model):
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(
        SiteUser, on_delete=models.CASCADE, blank=True, null=True
    )
