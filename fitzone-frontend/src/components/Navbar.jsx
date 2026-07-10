import React from 'react';

function Navbar({ carritoCount, setSeccionActual, seccionActual, isLoggedIn, usuarioLogueado, onLogout, onAbrirCarrito }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full">
      {/* Sección Izquierda */}
      <div className="flex gap-6 text-xs font-black tracking-widest text-slate-400">
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">AYUDA</span>
        <span className="hover:text-cyan-400 transition-colors cursor-pointer">CONTACTANOS</span>
      </div>
      
      {/* Logo Central (Tu SVG original) */}
      <div 
        className="cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setSeccionActual('home')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="42px" height="42px" className="drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
          <path d="M24 19.5L16.9 7.1l-2.8 1.6 5.3 9.3h4.6zm-7.6 0l-5.4-9.4-2.8 1.6 3.6 6.3 1.1 1.5h3.5zm-7.3 0L5.7 13.7l-2.8 1.6 2.4 4.2h3.8z"/>
        </svg>
      </div>
      
      {/* Sección Derecha (Unificada en un solo contenedor flex para alinear todo horizontalmente) */}
      <div className="flex items-center gap-4">
        
        {isLoggedIn ? (
          /* 👤 Cuadro de bienvenida fijo para el usuario logueado */
          <div className="text-xs font-bold tracking-widest text-slate-200 border border-slate-700/50 bg-slate-900/50 px-4 py-2 rounded-[5px] backdrop-blur-xs select-none">
            BIENVENIDO A TU CUENTA
          </div>
        ) : (
          /* 🔑 Botón clásico de Inicio de Sesión si no está logueado */
          <button 
            onClick={() => setSeccionActual('auth')}
            className={`text-xs font-black tracking-widest transition-colors cursor-pointer ${
              seccionActual === 'auth' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            INICIAR SESIÓN
          </button>
        )}

        {/* El carrito y cerrar sesión solo aparecen si está autenticado */}
        {isLoggedIn && (
          <>
            {/* Botón Carrito */}
            <button 
              onClick={onAbrirCarrito} // 👈 CAMBIO AQUÍ: Activa el booleano en lugar de cambiar de página
              className="px-4 py-2 bg-slate-950/80 border rounded-xl font-bold transition-all text-sm cursor-pointer border-slate-800 text-white hover:border-cyan-500/50"
            >
              🛒 (<span className="text-cyan-400">{carritoCount}</span>)
            </button>

            {/* 🚪 Botón Cerrar Sesión (Al lado del carrito) */}
            <button 
              onClick={onLogout}
              className="text-xs font-black tracking-widest border border-red-500/30 bg-red-950/20 hover:bg-red-500 hover:text-white text-red-400 px-3 py-2 rounded-[5px] transition-all cursor-pointer"
            >
              CERRAR SESIÓN
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;