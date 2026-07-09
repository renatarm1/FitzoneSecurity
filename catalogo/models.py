import logging
from django.db import models
from core.models import AuditableModel  # 💡 Importamos tu base de auditoría
from simple_history.models import HistoricalRecords

# Instanciamos el logger de auditoría que configuramos en settings.py
logger = logging.getLogger('fitzone_audit')

class Producto(AuditableModel):
    """
    Modelo de productos protegido con auditoría interna e historial.
    """
    nombre = models.CharField(max_length=150, unique=True)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    imagen_url = models.URLField(max_length=500, blank=True, null=True, help_text="Ruta o URL de la imagen del producto")
    activo = models.BooleanField(default=True, help_text="Permite deshabilitar el producto sin borrarlo de la BD")

    # 🕵️‍♂️ Registra de forma automática quién, cuándo y qué cambió en el producto
    history = HistoricalRecords()

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        
        # Guardar traza en el archivo físico application.log (Logs)
        if is_new:
            logger.info(f"AUDIT - INVENTARIO: Producto creado con éxito -> '{self.nombre}' (Precio: ${self.precio}, Stock: {self.stock})")
        else:
            logger.info(f"AUDIT - INVENTARIO: Modificación en producto ID {self.pk} -> '{self.nombre}' (Stock actual: {self.stock})")

    def __str__(self):
        return self.nombre
