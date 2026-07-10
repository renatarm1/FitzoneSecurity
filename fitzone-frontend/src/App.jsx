import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Carrito from './components/Carrito'
import Auth from './components/Auth'
import videoFondo from './assets/videos/fondoheader.mp4'

function App() {
  const [seccionActual, setSeccionActual] = useState('home')
  const [carrito, setCarrito] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCarritoAbierto, setIsCarritoAbierto] = useState(false)
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
          setIsLoggedIn(false); 
          setSeccionActual('home'); 
          setIsCarritoAbierto(false); 
        }}
        onAbrirCarrito={() => setIsCarritoAbierto(false)}
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
      </main>
      {/* 🛒 SIDEBAR FLOTANTE DEL CARRITO */}
      {seccionActual === 'carrito' && isLoggedIn && (
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