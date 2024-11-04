from collections import defaultdict
from django.shortcuts import render, redirect
from django.utils.text import slugify
from django.contrib.auth.decorators import login_required
from .models import Tag, Post
from .forms import PostForm


def home(request):
    posts = Post.objects.all().order_by("-updated_on")[:5]
    context = {"posts": posts}
    return render(request, "blog/home.html", context)


def post_list(request):
    posts = Post.objects.all().order_by("-updated_on")
    posts_by_year = defaultdict(list)

    for post in posts:
        year = post.created_on.year
        posts_by_year[year].append(post)

    sorted_years = sorted(posts_by_year.items(), reverse=True)
    tags = Tag.objects.all()
    context = {"years_with_posts": sorted_years, "tags": tags}
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
    if formatted_tags:
        tag_names = formatted_tags.split(",")
        for tag_name in tag_names:
            tag, created = Tag.objects.get_or_create(
                name=tag_name,
                defaults={"slug": slugify(tag_name)}
            )
            post.tags.add(tag)
