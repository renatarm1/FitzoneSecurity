from django.urls import path
from .views import registrar_usuario, iniciar_sesion

urlpatterns = [
    path('register/', registrar_usuario, name='registrar_usuario'),
    path('login/', iniciar_sesion, name='iniciar_sesion'),
]