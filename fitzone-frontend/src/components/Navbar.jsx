import React from 'react';

function Navbar({ carritoCount, setSeccionActual, seccionActual, isLoggedIn }) {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-cyan-500/10 px-6 py-4 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      
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
      
      {/* Sección Derecha */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setSeccionActual('auth')}
          className={`text-xs font-black tracking-widest transition-colors cursor-pointer ${seccionActual === 'auth' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
        >
          {isLoggedIn ? 'MI CUENTA ✅' : 'INICIAR SESIÓN'}
        </button>

        {/* El carrito solo aparece si está autenticado */}
        {isLoggedIn && (
          <button 
            onClick={() => setSeccionActual('carrito')}
            className={`px-4 py-2 bg-slate-950/80 border rounded-xl font-bold transition-all text-sm cursor-pointer ${
              seccionActual === 'carrito' 
                ? 'border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                : 'border-slate-800 text-white hover:border-cyan-500/50'
            }`}
          >
            🛒 (<span className="text-cyan-400">{carritoCount}</span>)
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;