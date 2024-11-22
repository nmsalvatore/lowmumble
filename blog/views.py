import secrets
from collections import defaultdict
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.text import slugify
from django.db.models import Count
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from csp.decorators import csp_update

from lowmumble import settings
from .models import Tag, Post
from .forms import PostForm


def update_navbar(request):
    return render(request, "blog/partials/navbar.html")


def post_list(request):
    tag_slug = request.GET.get("tag")
    request.session["back_info"] = {
        "path": request.get_full_path(),
        "tag": tag_slug or "all",
    }

    drafts = Post.objects.filter(published=False).order_by("-created_on")
    posts = Post.objects.filter(published=True).order_by("-created_on")

    current_tag = None
    if tag_slug:
        current_tag = get_object_or_404(Tag, slug=tag_slug)
        posts = posts.filter(tags=current_tag)

    posts_by_year = defaultdict(list)
    for post in posts:
        year = post.created_on.year
        posts_by_year[year].append(post)

    years_with_posts = sorted(posts_by_year.items(), reverse=True)
    tags = Tag.objects.filter(posts__in=posts).annotate(
            post_count=Count('posts')
        ).order_by('-post_count', 'name')

    context = {
        "years_with_posts": years_with_posts,
        "drafts": drafts,
        "tags": tags,
        "current_tag": current_tag
    }

    hx_request = request.headers.get("HX-Request")
    if hx_request:
        template = "blog/partials/post_list.html"
    else:
        template = "blog/post_list.html"

    response = render(request, template, context)
    response["Vary"] = "HX-Request"
    return response


def post_detail(request, slug):
    post = Post.objects.get(slug=slug)
    back_info = request.session.get("back_info")

    if not back_info:
        back_info = {"path": "/", "tag": "all"}

    context = {
        "post": post,
        "back_info": back_info,
    }

    return render(request, "blog/post_detail.html", context)


@login_required
@csp_update(SCRIPT_SRC=["'unsafe-eval'"])
def new_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        submit_action = request.POST.get("submit_action")

        if form.is_valid():
            try:
                post = form.save(commit=False)
                post.author = request.user
                post.content = request.POST.get("content")
                post.slug = slugify(post.title)
                post.published = submit_action == "publish"
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
@csp_update(SCRIPT_SRC=["'unsafe-eval'"])
def edit_post(request, slug):
    post = Post.objects.get(slug=slug)
    if request.method == "POST":
        form = PostForm(request.POST, instance=post)
        submit_action = request.POST.get("submit_action")
        published = submit_action == "publish" or submit_action == "update"

        if form.is_valid():
            try:
                post = form.save(commit=False)
                post.author = request.user
                post.content = request.POST.get("content")
                post.slug = slugify(post.title)
                post.published = published
                post.save()
                save_tag_data(request, post)
                return redirect("post_list")
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
