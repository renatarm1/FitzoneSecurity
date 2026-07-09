import React, { useState, useEffect, useRef } from 'react';

function Auth({ setIsLoggedIn, setSeccionActual }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

    const [message, setMessage] = useState({ 
    text: "SYSTEM: Authentication required to access checkout & shopping cart.", 
    type: "info" 
    });
  
  const captchaRef = useRef(null);

  // Efecto para gestionar de forma segura el ciclo de vida del reCAPTCHA
  useEffect(() => {
    // Si pasamos a registro y existe la librería de google montada
    if (!isLoginMode && window.grecaptcha) {
      setTimeout(() => {
        try {
          window.grecaptcha.render('html-recaptcha', {
            'sitekey': '6LeIxAcTAAAAAJcZVRqySaGatnMpE5mdezo5s16H', // Llave universal
            'theme': 'dark'
          });
        } catch (error) {
          console.log("reCAPTCHA component instance captured safely.");
        }
      }, 100);
    }
  }, [isLoginMode]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLoginMode 
      ? "http://localhost:5244/api/WebSite/login" 
      : "http://localhost:5244/api/WebSite/register";

    let captchaToken = "";

    if (!isLoginMode) {
      captchaToken = window.grecaptcha.getResponse();
      if (!captchaToken) {
        setMessage({ text: "ERROR: Please verify that you are human via reCAPTCHA.", type: "error" });
        return;
      }
    }

    setMessage({ text: "Connecting with C# Backend...", type: "info" });

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
        setMessage({ text: `// SUCCESS: ${data.message || "Authorized access."}`, type: "success" });
        
        // Si el login es exitoso, cambiamos estados e ingresamos al sistema
        if (isLoginMode) {
          setTimeout(() => {
            setIsLoggedIn(true);
            setSeccionActual('home'); // Redirige a la tienda habilitando el carrito
          }, 1000);
        }
      } else {
        setMessage({ text: `// BACKEND ERROR: ${data.error || "Authentication failed."}`, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "// SERVER ERROR: Connection refused or 404 path mismatch.", type: "error" });
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
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

        {/* 🤖 Google reCAPTCHA Contenedor */}
        {!isLoginMode && (
          <div className="py-2 flex justify-center">
            <div id="html-recaptcha" className="g-recaptcha" ref={captchaRef}></div>
          </div>
        )}

        <button 
          type="submit" 
          className="w-full py-3 mt-2 bg-cyan-500 text-slate-950 font-black rounded-xl text-xs tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.15)] cursor-pointer"
        >
          {isLoginMode ? 'ENTER SYSTEM' : 'SUBMIT REGISTRATION'}
        </button>
      </form>

      <p className="text-center text-xs mt-6">
        <button 
          onClick={() => { setIsLoginMode(!isLoginMode); setMessage({text:'', type:''}); }}
          className="text-slate-400 hover:text-cyan-400 underline transition-colors font-semibold cursor-pointer"
        >
          {isLoginMode ? "¿Don't have an account? Sign Up" : 'Already have an account? Log In'}
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