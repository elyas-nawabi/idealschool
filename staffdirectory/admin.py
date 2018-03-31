# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from .models import Staff, StaffImage, StaffDoc
# Register your models here.

admin.site.register(Staff)
admin.site.register(StaffImage)
admin.site.register(StaffDoc)