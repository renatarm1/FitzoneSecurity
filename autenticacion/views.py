import logging
import requests
import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken 

# Instanciamos el logger de auditoría que definimos en settings.py
logger = logging.getLogger('fitzone_audit')

@api_view(['POST'])
@permission_classes([AllowAny])
def registrar_usuario(request):
    """
    Registra un nuevo usuario en el sistema validando previamente reCAPTCHA v2.
    """
    email = request.data.get('Email') or request.data.get('email')
    password = request.data.get('Password') or request.data.get('password')
    captcha_token = request.data.get('RecaptchaToken') or request.data.get('recaptchaToken')

    # 1. Logs: Registrar la intención en bruto para auditoría de accesos
    logger.info(f"SECURITY - Intento de registro para la cuenta: {email}")

    # 2. Hardening: Validar el token con los servidores de Google
    # Llave secreta de prueba estándar de Google (reemplázala en producción por tu llave real)
    RECAPTCHA_SECRET = os.environ.get('RECAPTCHA_SECRET_KEY')
    
    # Control de seguridad: Si la llave no se cargó correctamente, lanzamos auditoría
    if not RECAPTCHA_SECRET:
        logger.error("SYSTEM ERROR - La variable de entorno RECAPTCHA_SECRET_KEY no está definida.")
        return Response({'error': 'Error de configuración en las llaves de seguridad.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Reestructuramos la petición utilizando 'params' para asegurar que Google reciba los datos limpios
    try:
        verify_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            params={
                'secret': RECAPTCHA_SECRET.strip(),  # .strip() elimina espacios invisibles accidentales
                'response': captcha_token
            },
            timeout=5 # Hardening: Evita que tu servidor se quede colgado si Google tarda en responder
        ).json()
    except requests.exceptions.RequestException as e:
        logger.error(f"SYSTEM ERROR - No se pudo conectar con los servidores de reCAPTCHA: {str(e)}")
        return Response({'error': 'Error de comunicación con el servicio de verificación.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

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
    Valida credenciales de acceso de forma segura y retorna un JWT real.
    """
    email = request.data.get('Email')
    password = request.data.get('Password')

    user = authenticate(username=email, password=password)

    if user is not None:
        if user.is_active:
            logger.info(f"AUDIT - Inicio de sesión exitoso: {email}")
            
            # 👇 GENERACIÓN DEL TOKEN REAL
            # Creamos un token de refresco y extraemos el token de acceso
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Acceso autorizado.', 
                'token': str(refresh.access_token),  # 👈 ¡Token JWT Real que React va a usar!
                'refresh': str(refresh),             # Opcional: para renovar la sesión sin loguearse otra vez
                'user': {'email': user.email}
            }, status=status.HTTP_200_OK)
        else:
            logger.warning(f"SECURITY - Intento de acceso a cuenta suspendida: {email}")
            return Response({'error': 'Esta cuenta se encuentra deshabilitada.'}, status=status.HTTP_403_FORBIDDEN)
    else:
        logger.warning(f"SECURITY ALERT - Credenciales inválidas para la cuenta: {email}")
        return Response({'error': 'Credenciales incorrectas. Verifique los datos.'}, status=status.HTTP_401_UNAUTHORIZED)