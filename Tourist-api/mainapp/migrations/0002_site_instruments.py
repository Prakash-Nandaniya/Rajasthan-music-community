# Generated by Django 5.1.7 on 2025-03-23 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='site',
            name='instruments',
            field=models.JSONField(default=list),
        ),
    ]
