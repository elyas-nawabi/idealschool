# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import Teacher, TeacherImage, TeacherDoc
# Register your models here.

admin.site.register(Teacher)
admin.site.register(TeacherImage)
admin.site.register(TeacherDoc)