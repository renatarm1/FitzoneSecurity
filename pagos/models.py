import logging
from django.db import models
from django.contrib.auth.models import User
from core.models import AuditableModel
from catalogo.models import Producto
from simple_history.models import HistoricalRecords

logger = logging.getLogger('fitzone_audit')

class Orden(AuditableModel):
    """
    Representa una compra finalizada en el e-commerce.
    """
    ESTADOS_PAGO = [
        ('PENDIENTE', 'Pendiente'),
        ('COMPLETADO', 'Completado'),
        ('FALLIDO', 'Fallido'),
    ]

    usuario = models.ForeignKey(User, on_delete=models.PROTECT, related_name='ordenes')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADOS_PAGO, default='PENDIENTE')
    transaccion_id = models.CharField(max_length=100, unique=True, help_text="ID de la pasarela de pago (ej. Stripe o PayPal)")

    # 🕵️ Auditoría de cambios en la orden
    history = HistoricalRecords()

    def __str__(self):
        return f"Orden #{self.id} - Usuario: {self.usuario.username} - Total: ${self.total}"


class DetalleOrden(AuditableModel):
    """
    Detalle de cada uno de los productos incluidos en una orden de compra.
    """
    orden = models.ForeignKey(Orden, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='detalles_orden')
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Orden #{self.orden.id} - {self.producto.nombre} x {self.cantidad}"