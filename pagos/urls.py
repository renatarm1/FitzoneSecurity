from django.urls import path
from .views import procesar_checkout

urlpatterns = [
    path('checkout/', procesar_checkout, name='procesar_checkout'),
]