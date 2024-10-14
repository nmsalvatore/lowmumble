from django.urls import path
from .views import home, post_list, post_detail, new_post, edit_post, delete_post, contact

urlpatterns = [
    path("", home, name="home"),
    path("posts/", post_list, name="post_list"),
    path("posts/new/", new_post, name="new_post"),
    path("posts/<str:slug>/", post_detail, name="post_detail"),
    path("post/edit/<str:slug>/", edit_post, name="edit_post"),
    path("post/delete/<str:slug>/", delete_post, name="delete_post"),
    path("contact/", contact, name="contact"),
]
