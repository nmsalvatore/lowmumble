from django.shortcuts import render, redirect
from django.utils.text import slugify
from django.contrib.auth.decorators import login_required
from .models import Post
from .forms import PostForm


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


@login_required
def new_post(request):
    if request.POST:
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.content = request.POST.get("content")
            post.slug = slugify(post.title)
            post.is_published = True
            post.save()
        return redirect("post_list")
    else:
        form = PostForm()
        context = {"form": form}
        return render(request, "blog/post_new.html", context)


@login_required
def edit_post(request, slug):
    post = Post.objects.get(slug=slug)

    if request.POST:
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.content = request.POST.get('content')
            post.slug = slugify(post.title)
            post.save()
        return redirect("post_detail", slug=slug)
    else:
        form = PostForm(instance=post)
        context = {"post": post, "form": form}
        return render(request, "blog/post_edit.html", context)


@login_required
def delete_post(request, slug):
    post = Post.objects.get(slug=slug)
    post.delete()
    return redirect("post_list")


def contact(request):
    return render(request, "blog/contact.html")
