from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from django.views.generic.base import TemplateView
from .forms import CustomLoginForm

urlpatterns = [
    path("admin/", admin.site.urls),
    path("login/", auth_views.LoginView.as_view(form_class=CustomLoginForm), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("", include("blog.urls")),
    path("robots.txt", TemplateView.as_view(template_name="robots.txt", content_type="text/plain"))
]
