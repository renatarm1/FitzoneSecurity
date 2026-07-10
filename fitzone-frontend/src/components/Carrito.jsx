import React from 'react';

function Carrito({ carrito, setCarrito, onCerrar }) {
  
  const totalAcumulado = carrito.reduce((acc, producto) => acc + producto.price, 0);

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const procederAlPago = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    alert("¡Procediendo al pago seguro con FitZone! 💳🔥");
  };

  return (
    /* 🌫️ Contenedor padre de fondo: Cubre toda la pantalla y oscurece el fondo */
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/70 backdrop-blur-sm transition-all duration-300">
      
      {/* Capa invisible a la izquierda para cerrar si el usuario hace clic fuera de la barra */}
      <div className="flex-1" onClick={onCerrar} />

      {/* 🔮 BARRA LATERAL ESTILO CRISTAL (Sidebar Glassmorphism) */}
      {/* Eliminamos 'animate-fade-in-right' para evitar que se quede invisible si falta configuración */}
      <div className="w-full max-w-md h-screen bg-slate-900/40 backdrop-blur-2xl border-l border-cyan-500/10 p-6 shadow-[-10px_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-between">
        
        <div>
          {/* Header del Carrito */}
          <div className="border-b border-slate-800/60 pb-4 mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Tu <span className="text-cyan-400">Carrito</span>
              </h2>
              <span className="text-xs font-bold bg-slate-800/60 text-cyan-400 px-2.5 py-0.5 rounded-full border border-cyan-500/10">
                {carrito.length}
              </span>
            </div>
            
            {/* ❌ Botón para cerrar la Sidebar */}
            <button 
              onClick={onCerrar}
              className="text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Contenedor de Items (Ocupa el alto disponible con scroll independiente) */}
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {carrito.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                <span className="text-3xl mb-2">🛒</span>
                <p className="text-xs font-medium">Tu carrito está completamente vacío.</p>
              </div>
            ) : (
              carrito.map((producto) => (
                <div 
                  key={producto.id} 
                  className="flex justify-between items-center p-4 bg-slate-950/40 border border-slate-800/40 hover:border-cyan-500/20 rounded-2xl transition-all duration-300 group"
                >
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm group-hover:text-cyan-400 transition-colors">
                      {producto.name}
                    </span>
                    <span className="text-slate-400 font-extrabold text-xs mt-0.5">
                      ${producto.price.toFixed(2)} USD
                    </span>
                  </div>
                  <button 
                    onClick={() => eliminarDelCarrito(producto.id)}
                    className="w-7 h-7 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-red-500/30 hover:bg-red-950/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 cursor-pointer text-xs"
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer del Carrito (Fijo abajo de la Sidebar) */}
        <div className="border-t border-slate-800/60 pt-4 mt-auto space-y-4">
          <div className="flex justify-between items-center text-xs text-slate-400 px-1">
            <span>Subtotal:</span>
            <span className="font-semibold text-white">${totalAcumulado.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-white">Total:</span>
            <span className="text-xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              ${totalAcumulado.toFixed(2)} USD
            </span>
          </div>

          <button 
            onClick={procederAlPago}
            className="w-full py-3.5 bg-cyan-500 text-slate-950 font-black text-xs tracking-widest rounded-xl hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
          >
            PROCEDER AL PAGO
          </button>
        </div>

      </div>
    </div>
  );
}

export default Carrito;