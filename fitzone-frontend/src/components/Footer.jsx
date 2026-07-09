import React from 'react';

function Footer({ setSeccionActual }) {
  return (
    <footer className="w-full bg-slate-950/80 border-t border-slate-900 mt-20 z-10 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        <div className="flex flex-col gap-3">
          <div className="text-xl font-black tracking-tighter text-white">sneakers</div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Academic interface implementation structured under Model-Service-Controller architecture.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-black tracking-widest text-slate-400 mb-4">MAIN SECTIONS</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-500">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSeccionActual('home'); }} className="hover:text-white transition-colors">Shop Lookbook</a></li>
            <li><span className="text-slate-600">Collections 2026</span></li>
            <li><span className="text-slate-600">Release Calendar</span></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-black tracking-widest text-slate-400 mb-4">ADDITIONAL ELEMENTS</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-500">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSeccionActual('auth'); }} className="hover:text-white transition-colors">User Register</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setSeccionActual('auth'); }} className="hover:text-white transition-colors">Account Login</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-black tracking-widest text-slate-400 mb-4">INTERACTION & HELP</h3>
          <ul className="space-y-2 text-xs font-semibold text-slate-500">
            <li><span className="text-slate-600">Help Center</span></li>
            <li><span className="text-slate-600">Privacy Policy</span></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-6 text-center">
        <p className="text-[10px] font-black tracking-wider text-slate-600 uppercase">
          &copy; 2026 SNEAKERS ARCHITECTURE PROJECT FOR UNIVERSITY EVALUATION.
        </p>
      </div>
    </footer>
  );
}

export default Footer;