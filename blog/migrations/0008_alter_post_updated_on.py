# Generated by Django 5.1.1 on 2024-11-29 04:25

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("blog", "0007_alter_post_updated_on"),
    ]

    operations = [
        migrations.AlterField(
            model_name="post",
            name="updated_on",
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]