# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from studentdirectory.models import Student, StudentDoc, StudentImage
# Register your models here.

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
	pass

@admin.register(StudentDoc)
class StudentDocAdmin(admin.ModelAdmin):
	pass

@admin.register(StudentImage)
class StudentImageAdmin(admin.ModelAdmin):
	pass
