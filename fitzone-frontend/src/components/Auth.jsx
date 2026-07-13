import React, { useState, useEffect, useRef } from 'react';
// 1. Importamos tu API limpia que apunta a Django
import { FitZoneAPI } from '/services/Api.js';
import ReCAPTCHA from 'react-google-recaptcha';

function Auth({ setIsLoggedIn, setSeccionActual }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const [message, setMessage] = useState({ 
    text: "ALERTA: Se requiere Autentificacion para acceder al Carrito y al Checkout.", 
    type: "info" 
    });
  
  const captchaRef = useRef(null);

  const limpiarFormulario = () => {
    setEmail('');
    setPassword('');
    captchaRef.current?.reset();
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    // 1. Declaramos la variable AQUÍ ADENTRO, justo cuando se envía el formulario
    // El reCAPTCHA se exige tanto en login como en registro (mitiga fuerza bruta contra el login)
    const captchaToken = captchaRef.current?.getValue() || null;

    if (!captchaToken) {
      setMessage({ text: "ERROR: Verifica que eres humano por medio del reCAPTCHA.", type: "error" });
      return; // Detiene el envío del formulario si falta el captcha
    }
    // 3. Definimos los endpoints correctos apuntando a /api/auth/
    // VITE_API_URL queda vacío en producción (mismo dominio que la API); en dev apunta a Django en :8000
    const apiOrigin = import.meta.env.VITE_API_URL || '';
    const endpoint = isLoginMode
      ? `${apiOrigin}/api/auth/login/`
      : `${apiOrigin}/api/auth/registro/`;

    setMessage({ text: "Conentando con el Servidor...", type: "info" });

    const payload = {
      Email: email,
      Password: password,
      RecaptchaToken: captchaToken 
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: `Perfil Verificado: ${data.message || "Acceso authorizado."}`, type: "success" });

        if (isLoginMode) {
          // Guardamos los tokens para que el carrito, checkout e historial puedan autenticarse
          if (data.token) localStorage.setItem('userToken', data.token);
          if (data.refresh) localStorage.setItem('refreshToken', data.refresh);

          // Si el login es exitoso, cambiamos estados e ingresamos al sistema
          setTimeout(() => {
            setIsLoggedIn(true);
            setSeccionActual('home'); // Redirige a la tienda habilitando el carrito
          }, 1000);
        } else {
          // Registro exitoso: limpiamos el formulario y pasamos a modo login para que inicie sesión
          limpiarFormulario();
          setIsLoginMode(true);
        }
      } else {
        setMessage({ text: `ERROR: ${data.error || "Falla de autenticación."}`, type: "error" });
        // El token de reCAPTCHA es de un solo uso: lo reseteamos para que pueda reintentar
        captchaRef.current?.reset();
      }
    } catch (error) {
      setMessage({ text: "ERROR del Servidor: Connection refused or 404 path mismatch.", type: "error" });
      captchaRef.current?.reset();
    }
  };

  return (
    <div className="w-full max-w-md mt-12 md:mt-16 bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-black text-white tracking-tight mb-1">
        {isLoginMode ? 'USER LOGIN' : 'CREATE ACCOUNT'}
      </h2>
      <p className="text-xs font-medium text-slate-400 mb-6 uppercase tracking-wider">
        {isLoginMode ? 'Welcome back to the alternative OOP network.' : 'Join the alternative OOP architecture network.'}
      </p>

      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-400 tracking-widest">EMAIL ADDRESS</label>
          <input 
            type="email" 
            required 
            placeholder="user@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-cyan-400 focus:outline-none text-sm font-medium transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-black text-slate-400 tracking-widest">PASSWORD</label>
          <input 
            type="password" 
            required 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl focus:border-cyan-400 focus:outline-none text-sm font-medium transition-colors"
          />
        </div>

        <div className="captcha-container" style={{ marginBottom: '15px' }}>
          <ReCAPTCHA
            ref={captchaRef}
            sitekey="6Lc4AEwtAAAAALfkioZb1hFZN9oMJuDxbvup2zEw"
            theme="dark"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 mt-2 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer"
        >
          {isLoginMode ? 'ENTER SYSTEM' : 'SUBMIT REGISTRATION'}
        </button>
      </form>

      <p className="text-center text-xs mt-6">
        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setMessage({ text: '', type: '' });
            limpiarFormulario();
          }}
          className="text-slate-400 hover:text-cyan-400 underline transition-colors font-semibold cursor-pointer"
        >
          {isLoginMode ? "¿No cuentas con una cuenta? Registarte" : 'Ya tienes una cuenta? Ingresa'}
        </button>
      </p>

      {/* Terminal-like Response Message Box */}
      {message.text && (
        <div className={`mt-4 p-3 rounded-xl border text-xs font-mono transition-all ${
          message.type === 'success' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400' :
          message.type === 'error' ? 'bg-red-950/20 border-red-500/30 text-red-400' :
          'bg-cyan-950/20 border-cyan-500/30 text-cyan-400'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default Auth;