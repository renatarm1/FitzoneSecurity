import logging
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from catalogo.models import Producto
from .models import Orden, DetalleOrden
from core.utils import obtener_ip_cliente

logger = logging.getLogger('fitzone_audit')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def historial_compras(request):
    """
    Devuelve únicamente las órdenes del usuario autenticado, con el detalle de productos.
    """
    ordenes = Orden.objects.filter(usuario=request.user).order_by('-created_at')

    data = []
    for orden in ordenes:
        detalles = orden.detalles.select_related('producto').all()
        data.append({
            'orden_id': orden.id,
            'fecha': orden.created_at.isoformat(),
            'estado': orden.estado,
            'total': float(orden.total),
            'transaccion_id': orden.transaccion_id,
            'productos': [
                {
                    'producto_id': d.producto.id,
                    'nombre': d.producto.nombre,
                    'cantidad': d.cantidad,
                    'precio_unitario': float(d.precio_unitario),
                    'subtotal': float(d.precio_unitario) * d.cantidad,
                }
                for d in detalles
            ]
        })

    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def procesar_checkout(request):
    """
    Procesa el pago simulación/real, genera la orden, descuenta stock y guarda auditoría.
    """
    usuario = request.user
    items = request.data.get('items', [])
    # Simulamos que React ya procesó el pago con una pasarela segura y nos manda un Token/ID
    token_pago = request.data.get('token_pago', 'TX-MOCK-DEFAULT')
    ip_cliente = obtener_ip_cliente(request)

    if not items:
        return Response({'error': 'No hay artículos para procesar el pago.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 🛡️ Bloque seguro: O todo se guarda junto o nada se guarda
        with transaction.atomic():
            # 1. Crear el encabezado de la Orden (el total se recalcula abajo con precios reales de la BD;
            # nunca se confía en el total enviado por el cliente)
            nueva_orden = Orden.objects.create(
                usuario=usuario,
                total=0,
                estado='COMPLETADO',
                transaccion_id=token_pago
            )

            total_calculado = 0

            # 2. Procesar cada producto, validar cantidad y restar stock físico
            for item in items:
                cantidad = item.get('cantidad', 0)
                if not isinstance(cantidad, int) or cantidad <= 0:
                    logger.warning(f"SECURITY ALERT - Cantidad inválida en checkout por {usuario.username}: item {item} (IP: {ip_cliente})")
                    raise ValueError('Cantidad de producto inválida.')

                producto = Producto.objects.select_for_update().get(id=item['id'], activo=True)

                if producto.stock < cantidad:
                    # Rompe la transacción completa si alguien le ganó el stock en el último segundo
                    logger.warning(f"SECURITY ALERT - Conflicto de Stock concurrente en Checkout: {producto.nombre} por {usuario.username} (IP: {ip_cliente})")
                    raise ValueError(f"El producto {producto.nombre} ya no cuenta con stock suficiente.")

                # Restar stock de los tenis Adidas
                producto.stock -= cantidad
                producto.save()

                total_calculado += producto.precio * cantidad

                # Crear el renglón del detalle
                DetalleOrden.objects.create(
                    orden=nueva_orden,
                    producto=producto,
                    cantidad=cantidad,
                    precio_unitario=producto.precio
                )

            # 3. Guardar el total real calculado en servidor (ignora cualquier 'total' enviado por el cliente)
            nueva_orden.total = total_calculado
            nueva_orden.save(update_fields=['total'])

            # Registrar éxito en bitácora física
            logger.info(f"AUDIT - TRANSACCIÓN EXITOSA: Orden #{nueva_orden.id} creada por {usuario.username}. Total calculado en servidor: ${total_calculado}. Transacción: {token_pago}")

            return Response({
                'mensaje': '¡Compra procesada con éxito!',
                'orden_id': nueva_orden.id
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        mensaje = str(e)
        es_error_controlado = 'stock' in mensaje or 'inválida' in mensaje
        logger.error(f"SYSTEM ERROR - Fallo crítico en Checkout de usuario {usuario.username}: {mensaje}")
        return Response({'error': mensaje if es_error_controlado else 'Error interno al procesar el pago.'}, status=status.HTTP_400_BAD_REQUEST)