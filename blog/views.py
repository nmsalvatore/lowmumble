from collections import defaultdict
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.text import slugify
from django.db.models import Count
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import Tag, Post
from .forms import PostForm


def update_navbar(request):
    return render(request, "blog/partials/navbar.html")


def post_list(request):
    tag_slug = request.GET.get("tag")
    posts = Post.objects.all().order_by("-created_on")

    current_tag = None
    if tag_slug:
        current_tag = get_object_or_404(Tag, slug=tag_slug)
        posts = posts.filter(tags=current_tag)

    posts_by_year = defaultdict(list)
    for post in posts:
        year = post.created_on.year
        posts_by_year[year].append(post)

    sorted_years = sorted(posts_by_year.items(), reverse=True)
    tags = Tag.objects.filter(posts__in=posts).annotate(
            post_count=Count('posts')
        ).order_by('-post_count', 'name')

    context = {
        "years_with_posts": sorted_years,
        "tags": tags,
        "current_tag": current_tag
    }

    if request.headers.get('HX-Request'):
        return render(request, "blog/partials/post_list.html", context)

    return render(request, "blog/post_list.html", context)


def post_detail(request, slug):
    post = Post.objects.get(slug=slug)
    context = {"post": post}

    if request.headers.get("HX-Request"):
        return render(request, "blog/partials/post_detail.html", context)

    return render(request, "blog/post_detail.html", context)


@login_required
def new_post(request):
    if request.POST:
        form = PostForm(request.POST)
        if form.is_valid():
            try:
                post = form.save(commit=False)
                post.author = request.user
                post.content = request.POST.get("content")
                post.slug = slugify(post.title)
                post.is_published = True
                post.save()
                save_tag_data(request, post)
                return redirect("post_list")
            except IntegrityError:
                form.add_error("title", "A blog post with this title already exists.")
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
            try:
                post = form.save(commit=False)
                post.author = request.user
                post.content = request.POST.get('content')
                post.slug = slugify(post.title)
                post.save()
                save_tag_data(request, post)
                return redirect("post_detail", slug=post.slug)
            except IntegrityError:
                form.add_error("title", "A blog post with this title already exists.")
    else:
        form = PostForm(instance=post)

    context = {"post": post, "form": form}
    return render(request, "blog/post_edit.html", context)


@login_required
def delete_post(request, slug):
    post = Post.objects.get(slug=slug)
    post.delete()
    return redirect("post_list")


def save_tag_data(request, post):
    tag_data = request.POST.get("tag_data")
    post.tags.clear()
    if tag_data:
        tag_names = tag_data.split(",")
        for tag_name in tag_names:
            tag_name = tag_name.strip()
            if tag_name:
                tag, created = Tag.objects.get_or_create(
                    name=tag_name,
                    defaults={"slug": slugify(tag_name)}
                )
                post.tags.add(tag)
