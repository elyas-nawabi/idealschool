from django.conf.urls import url
from django.contrib import admin
from teacherdirectory import views


urlpatterns = [
    url(r'^$', views.teacherform, name='teacherform'),
    url(r'^records/', views.records, name='records'),
    url(r'^update/', views.update, name='update'),
    url(r'^create/', views.create, name='create'),
    url(r'^destroy/', views.destroy, name='destroy'),
    url(r'^upload/', views.upload, name='upload'),
    url(r'^remove/', views.remove, name='remove'),
    url(r'^image/', views.image, name='image'),
]