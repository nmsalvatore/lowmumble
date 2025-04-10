from django.urls import path
from . import views

urlpatterns = [
    path("", views.post_list, name="post_list"),
    path("new/", views.new_post, name="new_post"),
    path("<str:slug>/", views.post_detail, name="post_detail"),
    path("edit/<str:slug>/", views.edit_post, name="edit_post"),
    path("delete/<str:slug>/", views.delete_post, name="delete_post"),
    path("change-publish-date/<str:slug>/", views.change_publish_date, name="change_publish_date")
]
