# Generated by Django 5.1.1 on 2024-11-23 00:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0004_rename_is_published_post_published"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="tags",
            field=models.ManyToManyField(related_name="tags", to="blog.tag"),
        ),
    ]
