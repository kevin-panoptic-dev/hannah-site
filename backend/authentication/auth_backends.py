from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailWithUsernameBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None, email=None, **kwargs):
        try:
            user = User.objects.get(username=username, password=password)
        except User.DoesNotExist:
            return None

        if user.check_password(password):  # type: ignore
            return user

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
