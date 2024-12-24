from django.db import models
from .constants import PRAISE_TYPE, LENGTH_TYPE


class FeedbackModel(models.Model):
    title = models.CharField(max_length=40)
    praise_type = models.CharField(
        max_length=1, choices=PRAISE_TYPE, blank=True, null=True
    )
    length_type = models.CharField(
        max_length=1, choices=LENGTH_TYPE, blank=True, null=True
    )
    content = models.TextField()
