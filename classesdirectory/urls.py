from django.conf.urls import url
from django.contrib import admin
from classesdirectory import views

urlpatterns = [
    url(r'^$', views.testC, name='testC')
]