import logging
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from catalogo.models import Producto
from .models import Orden, DetalleOrden

logger = logging.getLogger('fitzone_audit')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_checkout(request):
    """
    Procesa el pago simulación/real, genera la orden, descuenta stock y guarda auditoría.
    """
    usuario = request.user
    items = request.data.get('items', [])
    total_cliente = request.data.get('total', 0)
    # Simulamos que React ya procesó el pago con una pasarela segura y nos manda un Token/ID
    token_pago = request.data.get('token_pago', 'TX-MOCK-DEFAULT')

    if not items:
        return Response({'error': 'No hay artículos para procesar el pago.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 🛡️ Bloque seguro: O todo se guarda junto o nada se guarda
        with transaction.atomic():
            # 1. Crear el encabezado de la Orden
            nueva_orden = Orden.objects.create(
                usuario=usuario,
                total=total_cliente,
                estado='COMPLETADO',
                transaccion_id=token_pago
            )

            # 2. Procesar cada producto y restar stock físico
            for item in items:
                producto = Producto.objects.select_for_update().get(id=item['id'], activo=True)

                if producto.stock < item['cantidad']:
                    # Rompe la transacción completa si alguien le ganó el stock en el último segundo
                    logger.warning(f"SECURITY ALERT - Conflicto de Stock concurrente en Checkout: {producto.nombre} por {usuario.username}")
                    raise Exception(f"El producto {producto.nombre} ya no cuenta con stock suficiente.")

                # Restar stock de los tenis Adidas
                producto.stock -= item['cantidad']
                producto.save()

                # Crear el renglón del detalle
                DetalleOrden.objects.create(
                    orden=nueva_orden,
                    producto=producto,
                    cantidad=item['cantidad'],
                    precio_unitario=producto.precio
                )

            # Registrar éxito en bitácora física
            logger.info(f"AUDIT - TRANSACCIÓN EXITOSA: Orden #{nueva_orden.id} creada por {usuario.username}. Total: ${total_cliente}. Transacción: {token_pago}")
            
            return Response({
                'mensaje': '¡Compra procesada con éxito!',
                'orden_id': nueva_orden.id
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"SYSTEM ERROR - Fallo crítico en Checkout de usuario {usuario.username}: {str(e)}")
        return Response({'error': str(e) if "stock" in str(e) else 'Error interno al procesar el pago.'}, status=status.HTTP_400_BAD_REQUEST)