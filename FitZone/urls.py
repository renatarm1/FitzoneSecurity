
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/catalogo/", include("catalogo.urls")), # Conecta la app de catálogo
    path("api/auth/", include("autenticacion.urls")),
    path("api/carrito/", include("carrito.urls")),
    path("api/pagos/", include("pagos.urls")),
]