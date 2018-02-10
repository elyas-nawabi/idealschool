from django.conf.urls import url
from django.contrib import admin
from staffdirectory import views


urlpatterns = [
    url(r'^$', views.staffform, name='staffform'),
    url(r'^records/', views.records, name='records'),
    url(r'^update/', views.update, name='update'),
    url(r'^create/', views.create, name='create'),
    url(r'^destroy/', views.destroy, name='destroy'),
    url(r'^upload/', views.upload, name='upload'),
    url(r'^remove/', views.remove, name='remove'),
    url(r'^image/', views.image, name='image'),
    url(r'^parents/', views.parents, name='parents'),
    url(r'^read-docs', views.read_document, name='read-docs'),
    url(r'^delete-doc', views.delete_document, name='delete-doc'),
    url(r'^upload-doc', views.upload_document, name='upload-doc'),
    url(r'^remove-doc', views.delete_document, name='remove-doc'),
]