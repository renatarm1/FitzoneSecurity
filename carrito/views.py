import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from catalogo.models import Producto
from core.utils import obtener_ip_cliente

logger = logging.getLogger('fitzone_audit')

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # 🔒 Solo usuarios logueados pueden validar su carrito
def validar_carrito(request):
    """
    Recibe los productos del carrito desde React y verifica si hay stock disponible
    antes de permitir que pasen a la pantalla de pago.
    """
    items_carrito = request.data.get('items', []) # Lista de objetos [{id: 1, cantidad: 2}]
    
    if not items_carrito:
        return Response({'error': 'El carrito está vacío.'}, status=status.HTTP_400_BAD_REQUEST)
        
    errores_stock = []
    productos_validados = []
    
    for item in items_carrito:
        producto_id = item.get('id')
        cantidad_solicitada = item.get('cantidad', 0)
        
        # Validación de seguridad: Evitar inyecciones de cantidades negativas
        if cantidad_solicitada <= 0:
            logger.warning(f"SECURITY ALERT - Cantidad inválida detectada en carrito por usuario {request.user.username}: Producto ID {producto_id}, Cantidad: {cantidad_solicitada} (IP: {obtener_ip_cliente(request)})")
            return Response({'error': 'Operación no permitida. Cantidad inválida.'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            producto = Producto.objects.get(id=producto_id, activo=True)
            
            if producto.stock < cantidad_solicitada:
                errores_stock.append({
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'stock_disponible': producto.stock,
                    'mensaje': f'Solo quedan {producto.stock} unidades disponibles.'
                })
            else:
                productos_validados.append({
                    'id': producto.id,
                    'nombre': producto.nombre,
                    'precio_unitario': float(producto.precio),
                    'cantidad': cantidad_solicitada,
                    'subtotal': float(producto.precio) * cantidad_solicitada
                })
                
        except Producto.DoesNotExist:
            return Response({'error': f'El producto con ID {producto_id} no existe o fue retirado del catálogo.'}, status=status.HTTP_404_NOT_FOUND)

    # Si hay problemas de stock, frenamos el proceso y le avisamos a React
    if errores_stock:
        logger.warning(f"AUDIT - Carrito rechazado por falta de stock para el usuario {request.user.username}")
        return Response({'error_stock': True, 'detalles': errores_stock}, status=status.HTTP_409_CONFLICT)
        
    # Si todo está perfecto, autorizamos el paso a la pasarela de pagos
    total_orden = sum(p['subtotal'] for p in productos_validados)
    return Response({
        'mensaje': 'Carrito validado con éxito. Stock disponible.',
        'total': total_orden,
        'productos': productos_validados
    }, status=status.HTTP_200_OK)