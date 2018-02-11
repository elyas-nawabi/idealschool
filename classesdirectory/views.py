# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def testC(request):
	return HttpResponse('<h1> this page for classes</h1>')