from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailWithUsernameBackend(BaseBackend):
    def authenticate(
        self,
        request,
        username: str | None = None,
        password: str | None = None,
        email: str | None = None,
        **kwargs
    ):
        user = None

        # # #       username and password       # # #
        if username and password:
            try:
                user = User.objects.get(username=username)
                if user.check_password(password):
                    return user
            except User.DoesNotExist:
                pass

        # # #       email and password       # # #
        if not user and (email and password):
            try:
                user = User.objects.get(email=email)
                if user.check_password(password):
                    return user
            except User.DoesNotExist:
                pass

        # # #       username and email       # # #
        if not user and username and email:
            try:
                user = User.objects.get(username=username, email=email)
            except User.DoesNotExist:
                pass

        return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
