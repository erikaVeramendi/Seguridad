import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useSoundEffects } from "./useSoundEffects";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    nombre: "", fecha_nacimiento: "", 
    padres: "", hermanos: "", pareja: "", mascota: "",
    hobby: "", comida_favorita: "", color_favorito: "", artista: "", pelicula: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { playHover, playType, playSuccess } = useSoundEffects();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.from("jugadores").insert([formData]).select();

    if (error) {
      console.error("Error guardando datos:", error);
      alert("Hubo un error al registrarse. ¿Ejecutaste el comando SQL final para listar todas las columnas nuevas?");
    } else {
      setSuccess(true);
      playSuccess();
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-12 text-center bg-black border-2 border-green-500 rounded-lg shadow-[0_0_60px_rgba(34,197,94,0.3)] relative overflow-hidden max-w-2xl mx-auto">
        <div className="scanlines opacity-50 pointer-events-none"></div>
        <div className="glitch-layer opacity-10 pointer-events-none"></div>
        <div className="relative z-10 animate-reveal">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <svg className="w-12 h-12 text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-4xl font-black text-green-400 mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(34,197,94,1)]">IDENTIDAD CREADA</h2>
          <div className="inline-block border border-green-500/50 p-4 bg-green-950/30 rounded mt-4">
             <p className="text-xl text-green-300 font-mono typing-effect w-full">ACCESS GRANTED. RECORD SAVED.</p>
          </div>
          <p className="text-sm text-green-500/60 mt-12 font-mono border-t border-green-900/50 pt-6 animate-pulse">
            {'>'} El juego ha comenzado. Un detective analizará tu vida pronto...
          </p>
        </div>
      </div>
    );
  }

  // Helper dictionary directly maps color props to Tailwind classes
  const colorMap = {
    cyan: { text: "text-cyan-400", borderFocus: "focus:border-cyan-400", ring: "focus:ring-cyan-400", borderHover: "hover:border-cyan-500/50", borderGroup: "border-cyan-900/50", textInput: "text-cyan-100", symbol: "text-cyan-500/50", borderOutline: "border-cyan-400" },
    green: { text: "text-green-400", borderFocus: "focus:border-green-400", ring: "focus:ring-green-400", borderHover: "hover:border-green-500/50", borderGroup: "border-green-900/50", textInput: "text-green-100", symbol: "text-green-500/50", borderOutline: "border-green-400" },
    purple: { text: "text-purple-400", borderFocus: "focus:border-purple-400", ring: "focus:ring-purple-400", borderHover: "hover:border-purple-500/50", borderGroup: "border-purple-900/50", textInput: "text-purple-100", symbol: "text-purple-500/50", borderOutline: "border-purple-400" },
  };

  const InputField = ({ label, name, type="text", placeholder, color="cyan", delay="0s" }) => {
    const theme = colorMap[color];
    
    return (
      <div className="relative group animate-reveal" style={{ animationDelay: delay }}>
        <label className={`block text-[10px] uppercase tracking-widest font-black ${theme.text} mb-1 drop-shadow-[0_0_5px_rgba(0,0,0,1)]`}>
          {label}
        </label>
        <div className="relative">
          <span className={`absolute left-3 top-2.5 ${theme.symbol} font-mono`}>{'>'}</span>
          <input 
            type={type} 
            name={name} 
            required 
            onMouseEnter={playHover}
            onKeyDown={playType}
            className={`w-full bg-black/80 border ${theme.borderGroup} ${theme.textInput} text-sm rounded-lg pl-8 pr-3 py-2 
                        focus:outline-none ${theme.borderFocus} focus:ring-1 ${theme.ring} 
                        ${theme.borderHover} transition-all font-mono shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]`} 
            placeholder={placeholder} 
            onChange={handleChange} 
          />
          <div className={`absolute inset-0 border ${theme.borderOutline} rounded-lg opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-1 bg-gradient-to-b from-cyan-900/30 to-black rounded-lg shadow-[0_0_50px_rgba(6,-182,212,0.15)] relative animate-reveal">
      <div className="bg-black/90 p-8 rounded-lg relative overflow-hidden border border-cyan-900/50">
        <div className="scanlines opacity-50 pointer-events-none z-0"></div>
        
        {/* Header */}
        <div className="mb-10 text-center relative z-10 animate-reveal" style={{ animationDelay: '0.1s' }}>
          <div className="inline-block p-2 border border-cyan-500/30 bg-cyan-950/30 rounded-lg mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
             <svg className="w-8 h-8 text-cyan-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            REGISTRO DE IDENTIDAD
          </h2>
          <p className="text-xs text-cyan-500/70 mt-2 font-mono tracking-widest uppercase">
            Sistema de recolección de inteligencia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          {/* SECCION 1: DATOS BASICOS */}
          <div className="relative pt-6 pb-5 px-5 rounded-xl border border-cyan-900/40 bg-cyan-950/10 group hover:border-cyan-500/40 transition-colors animate-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-4 -translate-y-1/2 bg-black px-2 shadow-[0_0_5px_black]">
              <h3 className="text-cyan-500 text-[10px] font-black tracking-widest uppercase">1. Perfil Básico</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Nombre Alias" name="nombre" placeholder="Ej: Neo..." color="cyan" delay="0.25s" />
              <InputField label="Nacimiento" name="fecha_nacimiento" type="date" color="cyan" delay="0.3s" />
            </div>
          </div>

          {/* SECCION 2: FAMILIA Y AFECTOS */}
          <div className="relative pt-6 pb-5 px-5 rounded-xl border border-green-900/40 bg-green-950/10 group hover:border-green-500/40 transition-colors animate-reveal" style={{ animationDelay: '0.35s' }}>
            <div className="absolute top-0 left-4 -translate-y-1/2 bg-black px-2 shadow-[0_0_5px_black]">
              <h3 className="text-green-500 text-[10px] font-black tracking-widest uppercase">2. Vínculos Cercanos</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Padre/Madre" name="padres" placeholder="Ej: Roberto" color="green" delay="0.4s" />
              <InputField label="Hermanos/as" name="hermanos" placeholder="Ej: Lucia, Pedro" color="green" delay="0.45s" />
              <InputField label="Pareja / BFF" name="pareja" placeholder="Ej: Carlos" color="green" delay="0.5s" />
              <InputField label="Mascota" name="mascota" placeholder="Ej: Firulais" color="green" delay="0.55s" />
            </div>
          </div>

          {/* SECCION 3: GUSTOS Y HOBBIES */}
          <div className="relative pt-6 pb-5 px-5 rounded-xl border border-purple-900/40 bg-purple-950/10 group hover:border-purple-500/40 transition-colors animate-reveal" style={{ animationDelay: '0.6s' }}>
            <div className="absolute top-0 left-4 -translate-y-1/2 bg-black px-2 shadow-[0_0_5px_black]">
              <h3 className="text-purple-500 text-[10px] font-black tracking-widest uppercase">3. Preferencias Personales</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField label="Hobbie" name="hobby" placeholder="Ej: Futbol, Piano" color="purple" delay="0.65s" />
              <InputField label="Artista/Banda" name="artista" placeholder="Ej: BTS..." color="purple" delay="0.7s" />
              <InputField label="Pelicula/Serie" name="pelicula" placeholder="Ej: Matrix..." color="purple" delay="0.75s" />
              <InputField label="Comida Favorita" name="comida_favorita" placeholder="Ej: Pizza" color="purple" delay="0.8s" />
              <div className="md:col-span-2">
                <InputField label="Color Favorito" name="color_favorito" placeholder="Ej: Azul Marino" color="purple" delay="0.85s" />
              </div>
            </div>
          </div>

          {/* PASSWORD */}
          <div className="relative group p-6 rounded-xl border-2 border-pink-900/60 bg-pink-950/20 hover:border-pink-500 transition-all animate-reveal shadow-[0_0_15px_rgba(236,72,153,0.1)]" style={{ animationDelay: '0.9s' }}>
            <div className="absolute top-0 right-4 -translate-y-1/2 bg-black px-2 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
               <h3 className="text-pink-500 text-[10px] font-black tracking-widest uppercase">Seguridad Máxima</h3>
            </div>
            
            <label className="block tracking-widest text-xs font-black text-pink-400 mb-3 uppercase flex items-center justify-between drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">
              <span>CONTRASEÑA MAESTRA</span>
              <span className="text-pink-500/40 text-[9px]">ENCRYPTED</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-4 text-pink-500/50 font-mono text-lg">{'>'}</span>
              <input 
                type="password" 
                name="password" 
                required 
                onMouseEnter={playHover}
                onKeyDown={playType}
                className="w-full bg-black border-2 border-pink-900 text-pink-100 rounded-lg pl-10 pr-4 py-4 
                           focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all 
                           font-mono text-lg shadow-[0_0_15px_rgba(236,72,153,0.15)_inset] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)_inset]" 
                placeholder="Combina tus secretos aquí..." 
                onChange={handleChange} 
              />
            </div>
            <p className="text-xs text-pink-500/70 mt-4 font-mono leading-relaxed">
              <span className="text-pink-400 font-bold">REGLA:</span> Debe contener fragmentos de tu vida camuflados.
            </p>
          </div>
          
          <div className="animate-reveal" style={{ animationDelay: '1s' }}>
            <button 
              type="submit" 
              disabled={loading} 
              onMouseEnter={playHover}
              className="w-full mt-2 bg-black border border-cyan-500 relative overflow-hidden group 
                         text-cyan-400 font-black py-5 px-4 rounded shadow-[0_0_20px_rgba(6,182,212,0.3)] 
                         hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]
                         transition-all uppercase tracking-widest disabled:opacity-50 hover:text-white"
            >
              <div className="absolute inset-0 bg-cyan-700 opacity-20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
              <span className="relative z-10 flex justify-center items-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    ENCRIPTANDO FICHA...
                  </>
                ) : (
                  "GUARDAR FICHA E INICIAR RETO"
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
