from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from .forms import CustomLoginForm

urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", auth_views.LoginView.as_view(
        form_class=CustomLoginForm
    ), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("", include("blog.urls"))
]
