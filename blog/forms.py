from django.forms import ModelForm
from django import forms
from .models import Post


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ['title']
        labels = {'title': ''}
        widgets = {'title': forms.Textarea(attrs={
            "cols": False,
            "rows": 1,
            "placeholder": "Title",
            "autofocus": True,
        })}
