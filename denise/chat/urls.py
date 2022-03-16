from django.urls import path

from . import views

app_name = "chat"
urlpatterns = [
    path('init', views.initiate_interaction, name='initiate'),
    path('advance', views.advance_interaction, name='advance'),
    path('keepalive', views.keep_alive, name='keep_alive'),
    path('info', views.info, name='info')
]