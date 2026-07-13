import React, { useState, useEffect } from 'react';
import { FitZoneAPI } from '/services/Api.js';

const ESTADO_ESTILOS = {
  COMPLETADO: 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400',
  PENDIENTE: 'bg-amber-950/20 border-amber-500/30 text-amber-400',
  FALLIDO: 'bg-red-950/20 border-red-500/30 text-red-400',
};

function HistorialCompras() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    FitZoneAPI.obtenerHistorial()
      .then(setOrdenes)
      .catch((err) => setError(err.message || 'No se pudo cargar tu historial de compras.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="w-full max-w-3xl mt-12">
      <h2 className="text-2xl font-black text-white tracking-tight mb-1">
        Historial de <span className="text-cyan-400">Compras</span>
      </h2>
      <p className="text-xs font-medium text-slate-400 mb-8 uppercase tracking-wider">
        Todas tus órdenes realizadas en FitZone.
      </p>

      {cargando && (
        <p className="text-sm text-slate-400">Cargando tu historial...</p>
      )}

      {!cargando && error && (
        <div className="text-xs font-semibold text-red-400 bg-red-950/20 border border-red-500/30 rounded-xl px-4 py-3">
          ❌ {error}
        </div>
      )}

      {!cargando && !error && ordenes.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <span className="text-3xl mb-2">📦</span>
          <p className="text-xs font-medium">Todavía no tienes compras registradas.</p>
        </div>
      )}

      {!cargando && !error && ordenes.length > 0 && (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div
              key={orden.orden_id}
              className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5"
            >
              <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <div>
                  <span className="text-white font-black text-sm">Orden #{orden.orden_id}</span>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {new Date(orden.fecha).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${
                    ESTADO_ESTILOS[orden.estado] || 'bg-slate-800/50 border-slate-700 text-slate-300'
                  }`}
                >
                  {orden.estado}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                {orden.productos.map((p) => (
                  <div key={p.producto_id} className="flex justify-between text-xs text-slate-400">
                    <span>{p.nombre} <span className="text-slate-600">x{p.cantidad}</span></span>
                    <span className="font-semibold text-slate-300">${p.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-slate-800/60 pt-3">
                <span className="text-xs font-bold text-slate-400">Total</span>
                <span className="text-lg font-black text-cyan-400">${orden.total.toFixed(2)} USD</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistorialCompras;
