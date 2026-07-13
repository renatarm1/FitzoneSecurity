import logging
import requests
import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .throttles import LoginRateThrottle, RegisterRateThrottle

# Instanciamos el logger de auditoría que definimos en settings.py
logger = logging.getLogger('fitzone_audit')


def _verificar_recaptcha(captcha_token):
    """
    Valida el token de reCAPTCHA contra los servidores de Google.
    Devuelve (True, None) si es válido, o (False, Response) con el error a devolver.
    """
    recaptcha_secret = os.environ.get('RECAPTCHA_SECRET_KEY')

    if not recaptcha_secret:
        logger.error("SYSTEM ERROR - La variable de entorno RECAPTCHA_SECRET_KEY no está definida.")
        return False, Response({'error': 'Error de configuración en las llaves de seguridad.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    if not captcha_token:
        return False, Response({'error': 'Verificación reCAPTCHA requerida.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        verify_response = requests.post(
            'https://www.google.com/recaptcha/api/siteverify',
            params={
                'secret': recaptcha_secret.strip(),  # .strip() elimina espacios invisibles accidentales
                'response': captcha_token
            },
            timeout=5  # Hardening: Evita que tu servidor se quede colgado si Google tarda en responder
        ).json()
    except requests.exceptions.RequestException as e:
        logger.error(f"SYSTEM ERROR - No se pudo conectar con los servidores de reCAPTCHA: {str(e)}")
        return False, Response({'error': 'Error de comunicación con el servicio de verificación.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    # Antes este resultado nunca se comprobaba: cualquier token (incluso inválido) pasaba.
    if not verify_response.get('success'):
        return False, Response({'error': 'Verificación reCAPTCHA fallida.'}, status=status.HTTP_400_BAD_REQUEST)

    return True, None


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([RegisterRateThrottle])
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
    captcha_ok, captcha_error = _verificar_recaptcha(captcha_token)
    if not captcha_ok:
        logger.warning(f"SECURITY ALERT - reCAPTCHA inválido en registro para: {email}")
        return captcha_error

    # 3. Validaciones de Integridad y Disponibilidad
    if not email or not password:
        return Response({'error': 'Campos obligatorios incompletos.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        logger.warning(f"SECURITY - Intento de registro con correo duplicado: {email}")
        return Response({'error': 'Este correo electrónico ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

    # 4. Aplicar las políticas de contraseña configuradas en AUTH_PASSWORD_VALIDATORS
    try:
        validate_password(password)
    except DjangoValidationError as e:
        return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 5. Inserción Segura: Django hashea la contraseña automáticamente usando PBKDF2
        nuevo_usuario = User.objects.create_user(username=email, email=email, password=password)
        nuevo_usuario.save()

        logger.info(f"AUDIT - Cuenta registrada con éxito: {email}")
        return Response({'message': 'Usuario creado exitosamente.'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"SYSTEM ERROR - Error crítico al registrar usuario: {str(e)}")
        return Response({'error': 'Error interno del servidor.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([LoginRateThrottle])
def iniciar_sesion(request):
    """
    Valida credenciales de acceso de forma segura y retorna un JWT real.
    Requiere reCAPTCHA igual que el registro, para frenar fuerza bruta.
    """
    email = request.data.get('Email')
    password = request.data.get('Password')
    captcha_token = request.data.get('RecaptchaToken') or request.data.get('recaptchaToken')

    captcha_ok, captcha_error = _verificar_recaptcha(captcha_token)
    if not captcha_ok:
        logger.warning(f"SECURITY ALERT - reCAPTCHA inválido en login para: {email}")
        return captcha_error

    user = authenticate(username=email, password=password)

    if user is not None and user.is_active:
        logger.info(f"AUDIT - Inicio de sesión exitoso: {email}")

        # 👇 GENERACIÓN DEL TOKEN REAL
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Acceso autorizado.',
            'token': str(refresh.access_token),  # 👈 ¡Token JWT Real que React va a usar!
            'refresh': str(refresh),             # Para renovar la sesión sin loguearse otra vez
            'user': {'email': user.email}
        }, status=status.HTTP_200_OK)

    # Mismo mensaje y código de estado para credenciales inválidas y cuentas deshabilitadas,
    # así no se puede enumerar qué cuentas existen observando la respuesta HTTP.
    if user is not None and not user.is_active:
        logger.warning(f"SECURITY - Intento de acceso a cuenta suspendida: {email}")
    else:
        logger.warning(f"SECURITY ALERT - Credenciales inválidas para la cuenta: {email}")

    return Response({'error': 'Credenciales incorrectas. Verifique los datos.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cerrar_sesion(request):
    """
    Invalida el refresh token del usuario (logout real vía blacklist de SimpleJWT).
    """
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Falta el token de refresco.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        return Response({'error': 'Token inválido o ya expirado.'}, status=status.HTTP_400_BAD_REQUEST)

    logger.info(f"AUDIT - Logout exitoso: {request.user.email}")
    return Response({'message': 'Sesión cerrada correctamente.'}, status=status.HTTP_200_OK)
