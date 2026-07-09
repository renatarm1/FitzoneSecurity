// fitzone-frontend/src/services/api.js

const BASE_URL = 'http://localhost:8000/api';

/**
 * Helper global para adjuntar el token de sesión automáticamente
 */
const obtenerHeaders = () => {
    const token = localStorage.getItem('userToken');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Token ${token}`;
    }
    return headers;
};

export const FitZoneAPI = {
    // 1. Catálogo (Público)
    obtenerProductos: async () => {
        const res = await fetch(`${BASE_URL}/catalogo/productos/`);
        if (!res.ok) throw new Error('Error al traer los productos');
        return res.json();
    },

    // 2. Autenticación (Público, requiere token de reCAPTCHA para registro)
    registrar: async (email, password, captchaToken) => {
        const res = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, recaptcha_token: captchaToken })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error en el registro');
        return data;
    },

    login: async (email, password) => {
        const res = await fetch(`${BASE_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
        return data; // Aquí viene el 'token' que guardaremos en localStorage
    },

    // 3. Carrito (Privado - Requiere inicio de sesión)
    validarCarrito: async (items) => {
        const res = await fetch(`${BASE_URL}/carrito/validar/`, {
            method: 'POST',
            headers: obtenerHeaders(),
            body: JSON.stringify({ items })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al validar stock');
        return data;
    },

    // 4. Pagos (Privado - Requiere inicio de sesión)
    procesarCheckout: async (items, total, tokenPago) => {
        const res = await fetch(`${BASE_URL}/pagos/checkout/`, {
            method: 'POST',
            headers: obtenerHeaders(),
            body: JSON.stringify({ items, total, token_pago: tokenPago })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al procesar la transacción');
        return data;
    }
};