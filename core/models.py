from django.db import models

class AuditableModel(models.Model):
    """
    Clase base abstracta para asegurar la Auditoría y el Principio de No Repudio.
    Todas las tablas críticas del e-commerce heredarán estos campos automáticamente.
    """
    created_at = models.DateTimeField(
        auto_now_add=True, 
        help_text="Fecha y hora exacta de la creación del registro (Inmutable)"
    )
    updated_at = models.DateTimeField(
        auto_now=True, 
        help_text="Fecha y hora de la última modificación del registro"
    )

    class Meta:
        abstract = True  # 💡 Esto le indica a Django que NO cree una tabla 'core_auditablemodel' en la BD, solo sirve para heredar.