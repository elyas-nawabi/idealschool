# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.views import generic
from django.views.generic.edit import CreateView
from django.core import serializers
from .models import Staff, StaffImage, StaffDoc

import json
from django.views.decorators.csrf import csrf_exempt
# Create your views here.
def staffform(request):
	return render(request, 'staffform.html')

def records(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax():
		return HttpResponse(status=405)
	if request.method == 'GET':
		records = Staff.objects.all()
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
	new_records = Staff.objects.filter(pk__in=ids)
	result = serializers.serialize('json', new_records, use_natural_foreign_keys=True)
	return HttpResponse(result)


def destroy(request):
	if not request.is_ajax() or request.method!='POST':
		return HttpResponse(status=405)
	ustid = request.POST.dict()['id']
	try:
		staff = Staff.objects.get(ustid=ustid)
		staff.delete()
	except Exception as e:
		print e
		return HttpResponse(json.dumps({'error':e.message}), status=500)
	return HttpResponse()


def remove(request):
	file_id = request.POST.dict()['pk']
	try:
		image = StaffImage.objects.get(uid=file_id)
	except StaffImage.DoesNotExist as e:
		return HttpResponse(status=500)
	image.delete()
	return HttpResponse(json.dumps({'sucess':True}))
# @csrf_exempt
def upload(request):
	# print request.FILES
	image = StaffImage(file=request.FILES['files'])
	image.save()
	return HttpResponse(json.dumps({'sucess': True, 'url': image.file.url, 'pk': image.uid.hex}))

def image(request):
	# print request.method
	# print request.POST
	file_id = request.POST.dict()['pk']
	try:
		image = StaffImage.objects.get(uid=file_id)
	except StaffImage.DoesNotExist as e:
		return HttpResponse(status=500)
	return HttpResponse(json.dumps({'sucess': True, 'url': image.file.url, 'pk': image.uid.hex}))

#parents design page. move to parents directory
def parents(request):
	return render(request, 'parents.html')



#documents views for staff
def upload_document(request):
	#raise 405 on non-ajax requests
	if request.method != 'POST':
		return HttpResponse(status=405)
	staff_ustid = request.POST.dict()['id']
	#print teacher_utchrid
	try:
		staff = Staff.objects.get(ustid=staff_ustid)
	except Staff.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)
	try:
		doc = StaffDoc(file=request.FILES['files'], staff=staff)
		doc.save()
	except Exception as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)
	return HttpResponse()

def read_document(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax():
		return HttpResponse(status=405)
	staff_ustid = request.GET.dict()['id']
	#print teacher_utchrid
	try:
		staff = Staff.objects.get(ustid=staff_ustid)
	except StaffDoc.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)

	docs = staff.staffdoc_set.all()
	serialized_docs = serializers.serialize('json', docs)
	return HttpResponse(serialized_docs)

def delete_document(request):
 	#raise 405 on non-ajax requests
	if not request.is_ajax() or request.method != 'POST':
		return HttpResponse(status=405)
	print request.POST.dict()
	document_id = request.POST.dict()['id']
	try:
		doc = StaffDoc.objects.get(uid=document_id)
		#delete file
		doc.file.delete()
		#delete model object
		doc.delete()
	except Exception as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)
	return HttpResponse(json.dumps({}), status=200)

def download_document(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax() or request.method != 'POST':
		return HttpResponse(status=405)
	try:
		doc = StaffDoc.objects.get(uid=document_id)
	except StaffDoc.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)