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
  // --- Fila 1 (Tus 4 originales) ---
  { id: 101, name: "FORUM LOW CLASSIC", price: 120, img: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=500" },
  { id: 102, name: "ULTRABOOST LIGHT", price: 190, img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500" },
  { id: 103, name: "SAMBA ALTERNATIVE ROAD", price: 110, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500" },
  { id: 104, name: "NMD_R1 V3 DESIGN", price: 160, img: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=500" },

  // --- Fila 2 (Fila Extra 1) ---
  { id: 105, name: "STAN SMITH ENDLESS", price: 100, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500" },
  { id: 106, name: "GAZELLE VINTAGE CORE", price: 120, img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=500" },
  { id: 107, name: "SUPERSTAR BOLD BLACK", price: 110, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=500" },
  { id: 108, name: "TERREX TWO ULTRA", price: 180, img: "https://i0.wp.com/carrerasdemontana.com/wp-content/uploads/2020/04/adidas-terrex-two-ultra-parley-review-17.jpg??q=80&w=500" },

  // --- Fila 3 (Fila Extra 2) ---
  { id: 109, name: "RETROPY E5 URBAN", price: 130, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500" },
  { id: 110, name: "4DFWD RUNNING VISION", price: 220, img: "https://d2n4wb9orp1vta.cloudfront.net/cms/brand/am/2022-am/0922-am-carbon-adidas-4dfwd-2.jpg;maxWidth=385?q=80&w=500" },
  { id: 111, name: "CAMPUS 00S REMIX", price: 115, img: "https://img01.ztat.net/article/spp-media-p1/aa1de79b763a4f6c8761ef9af27551c7/49ff27a5d7b24974be22f1160c5b7f2b.jpg?q=80&w=500" },
  { id: 112, name: "OZWEEGO FUTURISTIC", price: 140, img: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=500" },

  // --- Fila 4 (Fila Extra 3) ---
  { id: 113, name: "ZX 2K BOOST TECH", price: 150, img: "https://www.endondecorrer.com/wp-content/uploads/2020/08/566337.jpg?q=80&w=500" },
  { id: 114, name: "RESPONSE CL TRAIL", price: 140, img: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=500" },
  { id: 115, name: "FORUM MID PREMIUM", price: 135, img: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=500" },
  { id: 116, name: "SOLARGLIDE 6 SHIFT", price: 160, img: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=500" },

  // --- Fila 5 (Fila Extra 4) ---
  { id: 117, name: "PUREBOOST 23 STEALTH", price: 145, img: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=500" },
  { id: 118, name: "STREETBALL SE ORANGE", price: 125, img: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=500" },
  { id: 119, name: "EQUIPMENT RACING EVO", price: 130, img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=500" },
  { id: 120, name: "HARDEN STEPBACK BASKET", price: 105, img: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=500" },

  // --- Fila 6 (Fila Extra 5) ---
  { id: 121, name: "ADIZERO ADIOS PRO", price: 250, img: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=500" },
  { id: 122, name: "YEEZY SLIDE RESIN V", price: 90,  img: "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=500" },
  { id: 123, name: "CRAZY BYW DUNK BLDR", price: 170, img: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=500" },
  { id: 124, name: "TOP TEN HI HERITAGE", price: 100, img: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=500" }
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
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800/60 absolute left-4 md:left-12 pointer-events-none">
          MAKE IT
        </h1>

        {/* Tarjeta Centrada Parallax 
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
        </div>*/}

        {/* Texto de Fondo Derecha */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-800/60 absolute right-4 md:right-12 pointer-events-none">
          POSSIBLE
        </h1>
      </div>

      {/* 2. CATÁLOGO DE PRODUCTOS */}
      <div className="w-full">
        <h2 className="text-center font-black tracking-widest text-slate-400 text-sm mb-10">
          {isLoggedIn ? "COMPLET CATALOGUE" : "SELECTED ORIGINALS"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* 💡 Con .slice(0, isLoggedIn ? 24 : 4) controlamos cuántos productos se muestran */}
          {productosCatalogo.slice(0, isLoggedIn ? 24 : 4).map((prod) => (
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
                  className="w-full py-2 bg-white text-slate-950 text-xs font-black rounded-lg hover:bg-cyan-400 shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer">
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