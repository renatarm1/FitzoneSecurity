"""
Punto de entrada para el hosting compartido de Hostinger (hPanel > "Setup Python App",
basado en Phusion Passenger). Passenger busca este archivo por nombre exacto en la raíz
de la app y espera encontrar una variable llamada "application".

No usar esto en VPS/Cloud: ahí se corre Gunicorn directo (ver deploy/README.md).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'FitZone.settings')

from django.core.wsgi import get_wsgi_application  # noqa: E402

application = get_wsgi_application()
