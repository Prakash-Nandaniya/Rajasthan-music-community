from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),  # Replace with the actual previous migration
    ]

    operations = [
        migrations.AddField(
            model_name='site',
            name='access',
            field=models.JSONField(default=list, blank=False, null=False),
        ),
    ]