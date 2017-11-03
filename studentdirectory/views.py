# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import Student, StudentImage
import json
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
def index(request):
	return render(request, 'index.html')

def records(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax():
		return HttpResponse(status=405)
	if request.method == 'GET':
		records = Student.objects.all()
		result = serializers.serialize('json', records, use_natural_foreign_keys=True)
		# print result
		return HttpResponse(result)

def update(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax():
		return HttpResponse(status=405)

	if request.method == 'POST':
		#get list of fields from post params in json format
		json_obj = request.POST.dict()['models']
		#deserializer json into django objects
		deserialized_obj = serializers.deserialize('json', json_obj)
		#save each model object to the database
		for obj in deserialized_obj:
			obj.save()
		#return successfull http response
		return HttpResponse(json.dumps({'data': ''}))

def create(request):
	json_obj = request.POST.dict()['models']
	deserialized = serializers.deserialize('json', json_obj)
	ids = []
	for obj in deserialized:
		obj.save()
		ids.extend([obj.object.pk])
	new_records = Student.objects.filter(pk__in=ids)
	result = serializers.serialize('json', new_records, use_natural_foreign_keys=True)
	return HttpResponse(result)

def remove(request):
	file_id = request.POST.dict()['pk']
	try:
		image = StudentImage.objects.get(uid=file_id)
	except StudentImage.DoesNotExist as e:
		return HttpResponse(status=500)
	image.delete()
	return HttpResponse(json.dumps({'sucess':True}))
# @csrf_exempt
def upload(request):
	# print request.FILES
	image = StudentImage(file=request.FILES['files'])
	image.save()
	return HttpResponse(json.dumps({'sucess': True, 'url': image.file.url, 'pk': image.uid.hex}))

def image(request):
	# print request.method
	# print request.POST
	file_id = request.POST.dict()['pk']
	try:
		image = StudentImage.objects.get(uid=file_id)
	except StudentImage.DoesNotExist as e:
		return HttpResponse(status=500)
	return HttpResponse(json.dumps({'sucess': True, 'url': image.file.url, 'pk': image.uid.hex}))




























