from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import Producto

@api_view(['GET'])
@permission_classes([AllowAny])  # Permitir acceso público sin tokens de autenticación
def listar_productos(request):
    """
    Retorna la lista completa de sneakers activos para desplegar en el home de React.
    """
    # Filtramos solo los productos que tengan stock y estén activos
    productos = Producto.objects.filter(activo=True)
    
    # Construimos un diccionario limpio que React entienda directo mediante JSON
    data = []
    for p in productos:
        data.append({
            'id': p.id,
            'nombre': p.nombre,
            'descripcion': p.descripcion,
            'precio': float(p.precio),
            'stock': p.stock,
            'imagen_url': p.imagen_url
        })
        
    return Response(data)