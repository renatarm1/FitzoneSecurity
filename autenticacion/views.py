import logging
import requests
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Instanciamos el logger de auditoría que definimos en settings.py
logger = logging.getLogger('fitzone_audit')

@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    """
    Registra un nuevo usuario en el sistema validando previamente reCAPTCHA v2.
    """
    email = request.data.get('email')
    password = request.data.get('password')
    captcha_token = request.data.get('recaptcha_token')

    # 1. Logs: Registrar la intención en bruto para auditoría de accesos
    logger.info(f"SECURITY - Intento de registro para la cuenta: {email}")

    # 2. Hardening: Validar el token con los servidores de Google
    # Llave secreta de prueba estándar de Google (reemplázala en producción por tu llave real)
    RECAPTCHA_SECRET = "6Lc4AEwtAAAAALfkioZb1hFZN9oMJuDxbvup2zEw" 
    
    verify_response = requests.post(
        'https://www.google.com/recaptcha/api/siteverify',
        data={'secret': RECAPTCHA_SECRET, 'response': captcha_token}
    ).json()

    if not verify_response.get('success'):
        logger.warning(f"SECURITY ALERT - Registro bloqueado por reCAPTCHA inválido: {email}")
        return Response({'error': 'Fallo en la validación humana (reCAPTCHA inválido).'}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Validaciones de Integridad y Disponibilidad
    if not email or not password:
        return Response({'error': 'Campos obligatorios incompletos.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        logger.warning(f"SECURITY - Intento de registro con correo duplicado: {email}")
        return Response({'error': 'Este correo electrónico ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 4. Inserción Segura: Django hashea la contraseña automáticamente usando PBKDF2
        nuevo_usuario = User.objects.create_user(username=email, email=email, password=password)
        nuevo_usuario.save()
        
        logger.info(f"AUDIT - Cuenta registrada con éxito: {email}")
        return Response({'message': 'Usuario creado exitosamente.'}, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"SYSTEM ERROR - Error crítico al registrar usuario: {str(e)}")
        return Response({'error': 'Error interno del servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def iniciar_sesion(request):
    """
    Valida credenciales de acceso de forma segura.
    """
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user is not None:
        if user.is_active:
            logger.info(f"AUDIT - Inicio de sesión exitoso: {email}")
            return Response({
                'message': 'Acceso autorizado.', 
                'token': 'session_token_mock_123', # Token simulado para la comunicación con Auth.jsx
                'user': {'email': user.email}
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"SECURITY - Intento de acceso a cuenta suspendida: {email}")
            return Response({'error': 'Esta cuenta se encuentra deshabilitada.'}, status=status.HTTP_403_FORBIDDEN)
    else:
        logger.warning(f"SECURITY ALERT - Credenciales inválidas para la cuenta: {email}")
        return Response({'error': 'Credenciales incorrectas. Verifique los datos.'}, status=status.HTTP_401_UNAUTHORIZED)