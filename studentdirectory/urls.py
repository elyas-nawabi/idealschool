"""idealschool URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from studentdirectory import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^records/', views.records, name='records'),
    url(r'^update/', views.update, name='update'),
    url(r'^create/', views.create, name='create'),
    url(r'^upload/', views.upload, name='upload'),
    url(r'^remove/', views.remove, name='remove'),
    url(r'^image/', views.image, name='image'),
    url(r'^destroy/', views.destroy, name='destroy'),
    url(r'^read-docs', views.read_document, name='read-docs'),
    url(r'^delete-doc', views.delete_document, name='delete-doc'),
    url(r'^upload-doc', views.upload_document, name='upload-doc'),
    url(r'^remove-doc', views.delete_document, name='remove-doc'),

]

