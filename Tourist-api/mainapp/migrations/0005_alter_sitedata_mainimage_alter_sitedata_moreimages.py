# Generated by Django 5.1.5 on 2025-01-15 14:22

import mainapp.storage_backend
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0004_userfeedback_delete_tourist'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitedata',
            name='mainImage',
            field=models.ImageField(blank=True, null=True, storage=mainapp.storage_backend.MainImageStorage(), upload_to=''),
        ),
        migrations.AlterField(
            model_name='sitedata',
            name='moreImages',
            field=models.ImageField(blank=True, null=True, storage=mainapp.storage_backend.MoreImagesStorage(), upload_to=''),
        ),
    ]
