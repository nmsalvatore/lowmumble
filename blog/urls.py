from django.urls import path
from .views import home, post_list, post_detail, new_post, contact

urlpatterns = [
    path("", home, name="home"),
    path("posts/", post_list, name="post_list"),
    path("posts/new/", new_post, name="new_post"),
    path("posts/<str:slug>/", post_detail, name="post_detail"),
    path("contact/", contact, name="contact"),
]
