# Generated by Django 5.1.7 on 2025-03-24 09:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0003_customuser_alter_userfeedback_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='subscription',
        ),
    ]
