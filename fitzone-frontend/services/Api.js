// fitzone-frontend/src/services/api.js

// En desarrollo (npm run dev) apunta a Django en :8000 vía VITE_API_URL (ver .env.development).
// En producción, VITE_API_URL queda vacío a propósito: el build se sirve desde el mismo
// dominio que la API, así que basta con una ruta relativa "/api" (sin dominio hardcodeado).
const BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

/**
 * Helper global para adjuntar el token de sesión automáticamente
 */
const obtenerHeaders = () => {
    const token = localStorage.getItem('userToken');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
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
        const res = await fetch(`${BASE_URL}/auth/registro/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: email, Password: password, RecaptchaToken: captchaToken })
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
    },

    // 5. Historial de compras (Privado - Requiere inicio de sesión)
    obtenerHistorial: async () => {
        const res = await fetch(`${BASE_URL}/pagos/historial/`, {
            headers: obtenerHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error al obtener el historial de compras');
        return data;
    },

    // 6. Logout (Privado - invalida el refresh token en el servidor)
    logout: async (refreshToken) => {
        const res = await fetch(`${BASE_URL}/auth/logout/`, {
            method: 'POST',
            headers: obtenerHeaders(),
            body: JSON.stringify({ refresh: refreshToken })
        });
        return res.ok;
    }
};