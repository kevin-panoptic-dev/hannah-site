from django.db import models


class GalleryCard(models.Model):
    title = models.CharField(max_length=15)
    image = models.ImageField(upload_to="gallery/")
    description = models.CharField(max_length=150)
