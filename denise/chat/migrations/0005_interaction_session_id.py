# Generated by Django 4.0.3 on 2022-03-10 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_rename_interactionz_interaction'),
    ]

    operations = [
        migrations.AddField(
            model_name='interaction',
            name='session_id',
            field=models.UUIDField(default=12873172361, verbose_name='Session id'),
            preserve_default=False,
        ),
    ]
