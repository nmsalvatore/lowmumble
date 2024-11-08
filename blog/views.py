from collections import defaultdict
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.text import slugify
from django.db.models import Count
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import Tag, Post
from .forms import PostForm


def home(request):
    request.session["back_path"] = request.get_full_path()
    posts = Post.objects.all().order_by("-created_on")[:5]
    context = {"posts": posts}
    return render(request, "blog/home.html", context)


def post_list(request):
    request.session["back_path"] = request.get_full_path()
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
    tags = Tag.objects.annotate(
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
    back_path = request.session.get("back_path", reverse("post_list"))
    post = Post.objects.get(slug=slug)
    context = {"post": post, "back_path": back_path}
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
            save_formatted_tags(request, post)
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
            save_formatted_tags(request, post)
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


def save_formatted_tags(request, post):
    formatted_tags = request.POST.get("formatted_tags")
    post.tags.clear()
    if formatted_tags:
        tag_names = formatted_tags.split(",")
        for tag_name in tag_names:
            tag_name = tag_name.strip()
            if tag_name:
                tag, created = Tag.objects.get_or_create(
                    name=tag_name,
                    defaults={"slug": slugify(tag_name)}
                )
                post.tags.add(tag)
