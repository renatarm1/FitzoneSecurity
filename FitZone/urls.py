
import os
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

# Ruta del panel de administración configurable por entorno (evita el path por defecto /admin/)
ADMIN_URL = os.environ.get('ADMIN_URL', 'admin/')

urlpatterns = [
    path(ADMIN_URL, admin.site.urls),
    path("api/catalogo/", include("catalogo.urls")), # Conecta la app de catálogo
    path("api/auth/", include("autenticacion.urls")),
    path("api/carrito/", include("carrito.urls")),
    path("api/pagos/", include("pagos.urls")),
]

# Todo lo que no matchee arriba (rutas de la SPA de React) sirve el index.html del build.
# Debe ir al final: Django prueba los patrones en orden y se queda con el primero que matchee.
urlpatterns += [
    re_path(r"^.*$", TemplateView.as_view(template_name="index.html")),
]
