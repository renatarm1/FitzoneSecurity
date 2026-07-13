import React, { useState } from 'react';

export default function Checkout({ carrito, total, limpiarCarrito }) {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const manejarPago = async () => {
    setCargando(true);
    setMensaje('');
    setError('');

    // Recuperamos el token de seguridad almacenado cuando el usuario inició sesión
    const tokenSesion = localStorage.getItem('userToken'); 

    if (!tokenSesion) {
      setError('Debes iniciar sesión para finalizar tu compra.');
      setCargando(false);
      return;
    }

    // Armamos el cuerpo de la transacción segura
    const payload = {
      items: carrito, // Estructura: [{id: 1, cantidad: 2}, {id: 3, cantidad: 1}]
      total: total,
      token_pago: "TX-STRIPE-" + Math.random().toString(36).substr(2, 9).toUpperCase() // Simulación de ID transaccional único
    };

    try {
      const apiOrigin = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiOrigin}/api/pagos/checkout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${tokenSesion}` // Pasamos las credenciales requeridas por IsAuthenticated
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`¡Pago Exitoso! Tu número de orden es la #${data.orden_id}`);
        limpiarCarrito(); // Vaciamos el estado local en React
      } else {
        setError(data.error || 'Ocurrió un problema al procesar el pago.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor de FitZone.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#111', color: '#fff', borderRadius: '8px' }}>
      <h2 style={{ color: '#00ffcc' }}>Resumen de Caja (Checkout)</h2>
      <p style={{ fontSize: '18px' }}>Total a pagar: <strong style={{ color: '#ff007f' }}>${total.toFixed(2)}</strong></p>

      {error && <div style={{ color: '#ff3333', marginBottom: '10px' }}>❌ {error}</div>}
      {mensaje && <div style={{ color: '#33ff33', marginBottom: '10px' }}>✅ {mensaje}</div>}

      <button
        onClick={manejarPago}
        disabled={cargando || carrito.length === 0}
        style={{
          background: cargando ? '#444' : '#00ffcc',
          color: '#000',
          padding: '12px 24px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '4px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          boxShadow: '0 0 10px #00ffcc'
        }}
      >
        {cargando ? 'Procesando Pago Seguro...' : 'PAGAR AHORA'}
      </button>
    </div>
  );
}