def obtener_ip_cliente(request):
    """
    Extrae la IP real del cliente. Detrás de Nginx (proxy inverso), REMOTE_ADDR
    solo vería la IP interna del proxy, así que primero se busca en X-Forwarded-For
    (el primer valor de la lista es el cliente original).
    """
    forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded_for:
        return forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', 'desconocida')
