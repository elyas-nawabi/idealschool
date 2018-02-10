# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from studentdirectory.models import Student, StudentDoc, StudentImage, Class, Attendance, Subject, Performance
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

@admin.register(Class)
class ClassesAdmin(admin.ModelAdmin):
	pass

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
	pass

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
	pass

@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
	pass

