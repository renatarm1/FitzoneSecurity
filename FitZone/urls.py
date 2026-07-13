
import os
from django.contrib import admin
from django.urls import path, include

# Ruta del panel de administración configurable por entorno (evita el path por defecto /admin/)
ADMIN_URL = os.environ.get('ADMIN_URL', 'admin/')

urlpatterns = [
    path(ADMIN_URL, admin.site.urls),
    path("api/catalogo/", include("catalogo.urls")), # Conecta la app de catálogo
    path("api/auth/", include("autenticacion.urls")),
    path("api/carrito/", include("carrito.urls")),
    path("api/pagos/", include("pagos.urls")),
]