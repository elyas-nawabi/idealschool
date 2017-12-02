# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import uuid
from django.db.models.signals import post_delete
from django.dispatch import receiver
# Create your models here.

def student_image_path(instance, filename):
	return 'files/{0}/images/{1}'.format(instance.uid, filename)
class StudentImageManager(models.Manager):
	def get_by_natural_key(self, uid, file):
		return self.get(uid=uid)
class StudentImage(models.Model):
	objects = StudentImageManager()
	uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	file = models.FileField(upload_to=student_image_path)
	def natural_key(self):
		return (self.uid, self.file.url)
	class Meta:
		unique_together = (('uid', 'file'))
class Student(models.Model):
	MALE = 'M'
	FEMALE = 'F'
	GENDER_CHOICES = ((MALE, 'MALE'), (FEMALE, 'FEMALE'))
	ISLAM = 'I'
	HINDUISM = 'H'
	CHRISTIANITY = 'C'
	RELIGION_CHOICES = ((ISLAM, 'ISLAM'), (HINDUISM, 'HINDUISM'), (CHRISTIANITY, 'CHRISTIANITY'))
	usid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	name = models.CharField(max_length=50)
	f_name = models.CharField(max_length=50)
	gf_name = models.CharField(max_length=50)
	roll_no = models.CharField(max_length=10)
	gender = models.CharField(max_length=2, choices=GENDER_CHOICES, default=MALE)
	dob = models.DateField(null=True)
	nid_no = models.CharField(max_length=10, null=True)
	nationality = models.CharField(max_length=50, null=True)
	religion = models.CharField(max_length=2, choices=RELIGION_CHOICES, default=ISLAM)
	phone = models.CharField(max_length=12, null=True)
	email = models.CharField(max_length=50, null=True)
	current_add = models.TextField(null=True)
	permanent_add = models.TextField(null=True)
	image = models.ForeignKey(StudentImage, on_delete=models.SET_NULL, null=True)
	#emergency info
	emg_contact1_name = models.CharField(max_length=50, null=True)
	emg_contact1_phone_1 = models.CharField(max_length=12, null=True)
	emg_contact1_phone_2 = models.CharField(max_length=12, null=True)
	emg_contact1_relation = models.CharField(max_length=50, null=True)
	emg_contact2_name = models.CharField(max_length=50, null=True)
	emg_contact2_phone_1 = models.CharField(max_length=12, null=True)
	emg_contact2_phone_2 = models.CharField(max_length=12, null=True)
	emg_contact2_relation = models.CharField(max_length=50, null=True)
	#medical info
	blood_group = models.CharField(max_length=5, null=True)
	alergies = models.TextField(null=True)
	medications = models.TextField(null=True)
	medical_conditions = models.TextField(null=True)
	#se parcha awurda
	transfered_in_date = models.DateField(null=True)
	transfered_in_from_school = models.CharField(max_length=50, null=True)
	transfered_in_reason = models.TextField(null=True)
	#se parcha shuda
	transfered_out_date = models.DateField(null=True)
	transfered_out_to_school = models.CharField(max_length=50, null=True)
	transfered_out_reason = models.TextField(null=True)
	# def natural_key(self):
	# 	return (self.name, ) + self.image.natural_key()
	# natural_key.dependencies = ['studentdirectory.studentimage']

def student_doc_path(instance, filename):
	return 'files/{0} [{1}]/docs/{2}'.format(instance.student.name, instance.student.usid, filename)

class StudentDoc(models.Model):
	uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	student = models.ForeignKey(Student)
	file = models.FileField(upload_to=student_doc_path)

#signal receiver to delete student_image on_delete of student
@receiver(post_delete, sender=Student)
def delete_student_image(sender, **kwargs):
	# print 'signal sender',kwargs['instance'].image.uid
	try:
		image_id = kwargs['instance'].image.uid
		image = StudentImage.objects.get(uid=image_id)
		image.delete()
	except Exception as e:
		print e


