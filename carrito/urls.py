from django.urls import path
from .views import validar_carrito

urlpatterns = [
    path('validar/', validar_carrito, name='validar_carrito'),
]