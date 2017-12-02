# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import Student, StudentImage, StudentDoc
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

def destroy(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax() or request.method != 'POST':
		return HttpResponse(status=405)

	usid = request.POST.dict()['id']
	try:
		student = Student.objects.get(usid=usid)
		student.delete()
	except Exception as e:
		print e
		return HttpResponse(json.dumps({'error':e.message}), status=500)
	return HttpResponse()

def remove(request):
	file_id = request.POST.dict()['pk']
	try:
		image = StudentImage.objects.get(uid=file_id)
		#delete file
		image.file.delete()
		#delete model object
		image.delete()
	except StudentImage.DoesNotExist as e:
		return HttpResponse(status=500)
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

def upload_document(request):
	#raise 405 on non-ajax requests
	if request.method != 'POST':
		return HttpResponse(status=405)
	student_usid = request.POST.dict()['id']
	try:
		student = Student.objects.get(usid=student_usid)
	except Student.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)
	try:
		doc = StudentDoc(file=request.FILES['files'], student=student)
		doc.save()
	except Exception as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)
	return HttpResponse()

def read_document(request):
	#raise 405 on non-ajax requests
	if not request.is_ajax():
		return HttpResponse(status=405)
	student_usid = request.GET.dict()['id']
	try:
		student = Student.objects.get(usid=student_usid)
	except Student.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)

	docs = student.studentdoc_set.all()
	serialized_docs = serializers.serialize('json', docs)
	return HttpResponse(serialized_docs)

def delete_document(request):
 	#raise 405 on non-ajax requests
	if not request.is_ajax() or request.method != 'POST':
		return HttpResponse(status=405)
	print request.POST.dict()
	document_id = request.POST.dict()['id']
	try:
		doc = StudentDoc.objects.get(uid=document_id)
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
		doc = StudentDoc.objects.get(uid=document_id)
	except StudentDoc.DoesNotExist as e:
		return HttpResponse(json.dumps({'error': e.message}), status=500)































