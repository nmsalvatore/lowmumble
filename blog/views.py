from django.shortcuts import render
from .models import Post


def home(request):
    posts = Post.objects.all().order_by("-updated_on")[:5]
    context = {"posts": posts}
    return render(request, "blog/home.html", context)


def post_list(request):
    posts = Post.objects.all().order_by("-updated_on")
    context = {"posts": posts}
    return render(request, "blog/post_list.html", context)


def post_detail(request, slug):
    post = Post.objects.get(slug=slug)
    context = {'post': post}
    return render(request, "blog/post_detail.html", context)


def contact(request):
    return render(request, "blog/contact.html")
