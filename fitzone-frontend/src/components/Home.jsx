import React, { useState, useEffect } from 'react';

const adidasImages = [
  "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600", 
  "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600", 
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600", 
  "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=600",
  "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600" 
];

// Catálogo tomado de tu index.html original
const productosCatalogo = [
  { id: 101, name: "FORUM LOW CLASSIC", price: 120, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500" },
  { id: 102, name: "ULTRABOOST LIGHT", price: 190, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500" },
  { id: 103, name: "SAMBA ALTERNATIVE ROAD", price: 110, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" },
  { id: 104, name: "NMD_R1 V3 DESIGN", price: 160, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500" },
];

function Home({ setCarrito, carrito, isLoggedIn, setSeccionActual }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transformStyle, setTransformStyle] = useState("rotateY(0deg) rotateX(0deg)");
  const [transitionStyle, setTransitionStyle] = useState("none");
  const [isFade, setIsFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFade(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % adidasImages.length);
        setIsFade(false);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 30; 
    const yAxis = (window.innerHeight / 2 - e.pageY) / 30; 
    setTransformStyle(`rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`);
  };

  const handleMouseLeave = () => {
    setTransitionStyle("transform 0.6s ease");
    setTransformStyle("rotateY(0deg) rotateX(0deg)");
  };

  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      // Redirigimos directo al login.
      setSeccionActual('auth');
      return;
    }
    const nuevoProducto = { id: Date.now(), name: item.name, price: item.price };
    setCarrito([...carrito, nuevoProducto]);
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO SECTION DINÁMICO */}
      <div 
        className="w-full max-w-4xl h-96 flex items-center justify-between relative mb-16 perspective-distant select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={() => setTransitionStyle("none")}
      >
        {/* Texto de Fondo Izquierda */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800/20 absolute left-4 md:left-12 pointer-events-none">
          SPRING
        </h1>

        {/* Tarjeta Centrada Parallax */}
        <div 
          className="mx-auto w-64 md:w-80 h-80 bg-slate-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-center transition-all duration-75"
          style={{ transform: transformStyle, transition: transitionStyle, transformStyle: "preserve-3d" }}
        >
          <img 
            src={adidasImages[currentIndex]} 
            alt="Carousel" 
            className={`w-full h-full object-cover rounded-xl shadow-xl transition-opacity duration-300 ${isFade ? 'opacity-0' : 'opacity-100'}`}
            style={{ transform: "translateZ(60px)" }}
          />
        </div>

        {/* Texto de Fondo Derecha */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800/20 absolute right-4 md:right-12 pointer-events-none">
          SUMMER
        </h1>
      </div>

      {/* 2. CATÁLOGO DE PRODUCTOS */}
      <div className="w-full">
        <h2 className="text-center font-black tracking-widest text-slate-400 text-sm mb-10">
          SELECTED ORIGINALS
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {productosCatalogo.map((prod) => (
            <div key={prod.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group flex flex-col justify-between">
              <div className="w-full h-56 bg-slate-950 overflow-hidden">
                <img src={prod.img} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black tracking-tight text-white">{prod.name}</span>
                  <span className="text-xs font-bold text-cyan-400 mt-1">${prod.price} USD</span>
                </div>
                <button 
                  onClick={() => handleAddToCart(prod)}
                  className="w-full py-2 bg-white text-slate-950 text-xs font-black rounded-lg hover:bg-cyan-400 shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
                >
                  Agregar 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;