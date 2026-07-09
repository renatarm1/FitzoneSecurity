import React from 'react';

function Carrito({ carrito, setCarrito }) {
  
  // Calcular el total acumulado usando reduce de JavaScript
  const totalAcumulado = carrito.reduce((acc, producto) => acc + producto.price, 0);

  // Función para eliminar un producto del carrito
  const eliminarDelCarrito = (id) => {
    // Filtramos el arreglo dejando fuera el ID seleccionado
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // Función para simular el botón de Checkout
  const procederAlPago = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    alert("¡Procediendo al pago seguro con FitZone! 💳🔥");
  };

  return (
    <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(6,182,212,0.1)] flex flex-col">
      
      {/* Header del Carrito */}
      <div className="border-b border-slate-800 pb-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-black text-white tracking-tight">
          Tu <span className="text-cyan-400">Carrito</span>
        </h2>
        <span className="text-sm font-bold bg-slate-800 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/10">
          {carrito.length} {carrito.length === 1 ? 'artículo' : 'artículos'}
        </span>
      </div>

      {/* Contenedor de Items */}
      <div className="space-y-4 min-h-50 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
        {carrito.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <span className="text-4xl mb-2">🛒</span>
            <p className="text-sm font-medium">Tu carrito está completamente vacío.</p>
          </div>
        ) : (
          carrito.map((producto) => (
            /* Micro-card flotante estilo cyberpunk */
            <div 
              key={producto.id} 
              className="flex justify-between items-center p-4 bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 rounded-2xl transition-all duration-300 group"
            >
              <div className="flex flex-col">
                <span className="text-white font-bold group-hover:text-cyan-400 transition-colors">
                  {producto.name}
                </span>
                <span className="text-slate-400 font-extrabold text-sm mt-0.5">
                  ${producto.price.toFixed(2)} MXN
                </span>
              </div>
              <button 
                onClick={() => eliminarDelCarrito(producto.id)}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-90"
                title="Eliminar producto"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer del Carrito (Totales) */}
      <div className="border-t border-slate-800 pt-6 mt-6 space-y-4">
        <div className="flex justify-between items-center text-sm text-slate-400 px-1">
          <span>Subtotal:</span>
          <span className="font-semibold text-white">${totalAcumulado.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center px-1">
          <span className="text-base font-bold text-white">Total a Pagar:</span>
          <span className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            ${totalAcumulado.toFixed(2)} MXN
          </span>
        </div>

        <button 
          onClick={procederAlPago}
          className="w-full mt-2 py-4 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
        >
          PROCEDER AL PAGO
        </button>
      </div>
    </div>
  );
}

export default Carrito;