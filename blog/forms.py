from django.forms import ModelForm
from django import forms
from .models import Post


class PostForm(ModelForm):
    class Meta:
        model = Post
        fields = ["title", "tags"]

    title = forms.CharField(
        widget=forms.Textarea(attrs={
            "cols": False,
            "rows": 1,
            "placeholder": "Title",
            "autofocus": True,
        })
    )

    tags = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "placeholder": "Enter tag",
            "autocomplete": "off"
        })
    )
