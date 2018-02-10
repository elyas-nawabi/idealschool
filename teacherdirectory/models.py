# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import uuid
# Create your models here.
def teacher_image_path(instance, filename):
	return 'files/{0}/images/{1}'.format(instance.uid, filename)
class TeacherImageManager(models.Manager):
	def get_by_natural_key(self, uid, file):
		return self.get(uid=uid)
class TeacherImage(models.Model):
	objects = TeacherImageManager()
	uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	file = models.FileField(upload_to=teacher_image_path)
	def natural_key(self):
		return (self.uid, self.file.url)
	class Meta:
		unique_together = (('uid', 'file'))
class Teacher(models.Model):
	MALE = 'M'
	FEMALE = 'F'
	GENDER_CHOICES = ((MALE, 'MALE'), (FEMALE, 'FEMALE'))
	ISLAM = 'I'
	HINDUISM = 'H'
	CHRISTIANITY = 'C'
	RELIGION_CHOICES = ((ISLAM, 'ISLAM'), (HINDUISM, 'HINDUISM'), (CHRISTIANITY, 'CHRISTIANITY'))
	# General Info
	utchrid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	image = models.ForeignKey(TeacherImage, on_delete=models.SET_NULL, null=True)
	tchr_faculty_id = models.CharField(max_length=10) # using number will be okay?
	tchr_firstname = models.CharField(max_length=50)
	tchr_lastname = models.CharField(max_length=50, null=True)
	tchr_fname = models.CharField(max_length=50)
	tchr_gender = models.CharField(max_length=2, choices=GENDER_CHOICES, default=FEMALE)
	tchr_nationality = models.CharField(max_length=50) 
	tchr_nid_pass = models.CharField(max_length=50) # can be IntegerField, but some uses Jold Number and Safha Number
	tchr_religion = models.CharField(max_length=2, choices=RELIGION_CHOICES, default=ISLAM)
	tchr_business_ph = models.CharField(max_length=15, null=True)
	tchr_home_ph = models.CharField(max_length=15, null=True)
	tchr_mobile_no = models.CharField(max_length=15)
	tchr_email = models.CharField(max_length=70, null=True)
	# Current and Prmnt Address
	tchr_cur_add_villordist = models.CharField(max_length=50, null=True)
	tchr_cur_add_province = models.CharField(max_length=50)
	tchr_cur_add_country = models.CharField(max_length=50)
	tchr_prmnt_add_villordist = models.CharField(max_length=50, null=True)
	tchr_prmnt_add_province = models.CharField(max_length=50)
	tchr_prmnt_add_country = models.CharField(max_length=50)
	# Department
	tchr_faculty_type = models.CharField(max_length=50)
	tchr_department = models.CharField(max_length=50)
	tchr_office_branch = models.CharField(max_length=70)
	tchr_dob = models.DateField()
	tchr_doh = models.DateField()
	tchr_salary = models.DecimalField(max_digits=7, decimal_places=2) # check datatype 
	tchr_level_degree = models.CharField(max_length=100)
	tchr_focus_area = models.CharField(max_length=200 , null=True)
	tchr_school_progname = models.CharField(max_length=100, null=True)
	# Emg Contacts
	tchr_emg_c_name = models.CharField(max_length=50 , null=True)
	tchr_emg_c_phno1 = models.CharField(max_length=15, null=True)
	tchr_emg_c_phno2 = models.CharField(max_length=15, null=True)
	tchr_emg_c_relationship = models.CharField(max_length=50, null=True)
	# Medical Info
	tchr_blood_group = models.CharField(max_length=3, null=True)
	tchr_allergies = models.CharField(max_length=200 , null=True)
	# resign
	tchr_resign_date = models.DateField(null=True)
	tchr_resign_reason = models.CharField(max_length=200, null=True)
	tchr_resign_chkliabilites = models.CharField(max_length=200, null=True)


def teacher_doc_path(instance, filename):
	return 'files/{0} [{1}]/docs/{2}'.format(instance.teacher.tchr_fname, instance.teacher.uid, filename)

class TeacherDoc(models.Model):
	uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	teacher = models.ForeignKey(Teacher)
	file = models.FileField(upload_to=teacher_doc_path)


@receiver(post_delete, sender=Teacher)
def delete_teacher_image(sender, **kwargs):
	try:
		image_id = kwargs['instance'].image.uid
		image = TeacherImage.objects.get(uid=image_id)
		image.delete()
	except Exception as e:
		print e