import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import Carrito from './components/Carrito'
import Auth from './components/Auth'

function App() {
  const [seccionActual, setSeccionActual] = useState('home')
  const [carrito, setCarrito] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col relative overflow-x-hidden">
      
      {/* 📹 Video de fondo estático heredado de tu index.html */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden select-none pointer-events-none">
        <video autoplay="" loop="" muted="" playsinline="" className="w-full h-full object-cover opacity-35 filter brightness-50">
          <source src="/src/assets/videos/adidas-runway.mp4" type="video/mp4" />
        </video>
        {/* Capa de degradado oscuro superior e inferior para legibilidad */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/70 via-transparent to-slate-950" />
      </div>

      {/* Componente Navbar */}
      <Navbar 
        carritoCount={carrito.length} 
        setSeccionActual={setSeccionActual} 
        seccionActual={seccionActual}
        isLoggedIn={isLoggedIn}
      />

      {/* Vistas principales */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 z-10 flex items-center justify-center">
        {seccionActual === 'home' && (
          <Home 
            setCarrito={setCarrito} 
            carrito={carrito} 
            isLoggedIn={isLoggedIn} 
            setSeccionActual={setSeccionActual} 
          />
        )}
        
        {seccionActual === 'carrito' && isLoggedIn && (
          <Carrito 
            carrito={carrito} 
            setCarrito={setCarrito} 
          />
        )}
        
        {seccionActual === 'auth' && (
          <Auth 
            setIsLoggedIn={setIsLoggedIn} 
            setSeccionActual={setSeccionActual} 
          />
        )}
      </main>

      {/* Componente Footer */}
      <Footer setSeccionActual={setSeccionActual} />
    </div>
  )
}

export default App