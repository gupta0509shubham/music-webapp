# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-04-25 18:25
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('musicapp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='musictrack',
            old_name='rates',
            new_name='rating',
        ),
    ]
