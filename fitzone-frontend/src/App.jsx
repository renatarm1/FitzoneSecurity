import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Carrito from './components/Carrito'
import Auth from './components/Auth'
import HistorialCompras from './components/HistorialCompras'
import videoFondo from './assets/videos/fondoheader.mp4'
import { FitZoneAPI } from '/services/Api.js'

// Lee el campo "exp" (expiración, en segundos Unix) del payload de un JWT sin librerías externas
function obtenerExpiracionToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp || null;
  } catch {
    return null;
  }
}

function App() {
  const [seccionActual, setSeccionActual] = useState('home')
  const [carrito, setCarrito] = useState(() => {
    // Recupera el carrito guardado (si existe) para que sobreviva a un hard refresh
    try {
      const guardado = localStorage.getItem('carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCarritoAbierto, setIsCarritoAbierto] = useState(false)

  // Rehidrata la sesión al montar (ej. tras un hard refresh): si ya hay un token
  // guardado en localStorage y todavía no expiró, restauramos isLoggedIn en vez de
  // mandar al usuario de vuelta al login.
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) return;

    const exp = obtenerExpiracionToken(token);
    const ahoraEnSegundos = Math.floor(Date.now() / 1000);

    if (exp && exp > ahoraEnSegundos) {
      setIsLoggedIn(true);
    } else {
      // Token vencido o corrupto: limpiamos la sesión local para no dejarla a medias
      localStorage.removeItem('userToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  // Persiste el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* 📹 Video de fondo estático global */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-35 filter brightness-50"
        >
          {/* 2. 👇 PASA LA VARIABLE EN EL SRC EN LUGAR DE UN TEXTO */}
          <source src={videoFondo} type="video/mp4" />
        </video>
        {/* Capa de degradado oscuro superior e inferior */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-transparent to-slate-950" />
      </div>

      {/* Componente Navbar */}
      <Navbar 
        carritoCount={carrito.length} 
        setSeccionActual={setSeccionActual} 
        seccionActual={seccionActual}
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            // Best-effort: invalida el refresh token en el servidor (no bloquea el logout local)
            FitZoneAPI.logout(refreshToken).catch(() => {});
          }
          localStorage.removeItem('userToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          setSeccionActual('home');
          setIsCarritoAbierto(false);
          setCarrito([]); // Evita que el carrito de esta cuenta quede visible para el siguiente usuario
        }}
        onAbrirCarrito={() => setIsCarritoAbierto(true)}
      />

      {/* Vistas principales (Le agregamos pt-24 para compensar el Navbar fixed) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 pt-24 z-10 flex items-center justify-center">
        {seccionActual === 'home' && (
          <Home 
            setCarrito={setCarrito} 
            carrito={carrito} 
            isLoggedIn={isLoggedIn} 
            setSeccionActual={setSeccionActual} 
          />
        )}
        
        {/* 💡 Quitamos el carrito de aquí dentro para que no sustituya al Home al abrirse */}
        {seccionActual === 'auth' && (
          <Auth
            setIsLoggedIn={setIsLoggedIn}
            setSeccionActual={setSeccionActual}
          />
        )}

        {seccionActual === 'historial' && isLoggedIn && (
          <HistorialCompras />
        )}
      </main>
      {/* 🛒 SIDEBAR FLOTANTE DEL CARRITO */}
      {isCarritoAbierto && isLoggedIn && (
        <Carrito
          carrito={carrito}
          setCarrito={setCarrito}
          onCerrar={() => setIsCarritoAbierto(false)}
        />
      )}
      {/* Componente Footer */}
      <Footer setSeccionActual={setSeccionActual} />
    </div>
  )
}

export default App