from django.urls import path
from . import views

urlpatterns = [
    path('registro/', views.registrar_usuario, name='registro'),
    path('login/', views.iniciar_sesion, name='login'), # 👈 Cambiado a iniciar_sesion
]