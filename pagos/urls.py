from django.urls import path
from .views import procesar_checkout, historial_compras

urlpatterns = [
    path('checkout/', procesar_checkout, name='procesar_checkout'),
    path('historial/', historial_compras, name='historial_compras'),
]