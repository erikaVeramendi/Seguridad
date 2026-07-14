import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    nombre: "", fecha_nacimiento: "", 
    padres: "", hermanos: "", pareja: "", mascota: "",
    hobby: "", comida_favorita: "", color_favorito: "", artista: "", pelicula: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-12 text-center bg-gray-900 border border-green-500 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] relative overflow-hidden max-w-2xl mx-auto">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/30 via-transparent to-transparent opacity-50"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500 animate-pulse">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-3xl font-bold text-green-400 mb-4">IDENTIDAD CREADA</h2>
          <p className="text-xl text-green-100 mb-2">Tu identidad está segura temporalmente.</p>
          <p className="text-sm text-green-500/80 mt-8 font-mono border-t border-green-900/50 pt-6">El juego ha comenzado. Un detective analizará tu vida pronto...</p>
        </div>
      </div>
    );
  }

  const InputField = ({ label, name, type="text", placeholder, color="blue" }) => (
    <div>
      <label className={`block text-xs font-bold text-${color}-400 mb-1`}>{label}</label>
      <input type={type} name={name} required className={`w-full bg-gray-900 border border-gray-700 text-${color}-50 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-${color}-500 focus:ring-1 focus:ring-${color}-500 font-mono`} placeholder={placeholder} onChange={handleChange} />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gray-950 border-2 border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
          CREAR IDENTIDAD
        </h2>
        <p className="text-sm text-gray-400 mt-2">Inventa o pon tus datos reales para desafiar al hacker.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECCION 1: DATOS BASICOS */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h3 className="text-cyan-500 text-sm font-bold border-b border-gray-800 pb-2 mb-4 uppercase">1. Perfil Básico</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Nombre o Apodo" name="nombre" placeholder="Ej: Neo..." color="cyan" />
            <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" color="cyan" />
          </div>
        </div>

        {/* SECCION 2: FAMILIA Y AFECTOS */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h3 className="text-green-500 text-sm font-bold border-b border-gray-800 pb-2 mb-4 uppercase">2. Vínculos Cercanos</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Nombre del Padre o Madre" name="padres" placeholder="Ej: Roberto" color="green" />
            <InputField label="Hermanos/as" name="hermanos" placeholder="Ej: Lucia, Pedro" color="green" />
            <InputField label="Pareja o Mejor Amigo/a" name="pareja" placeholder="Ej: Carlos" color="green" />
            <InputField label="Mascota" name="mascota" placeholder="Ej: Firulais" color="green" />
          </div>
        </div>

        {/* SECCION 3: GUSTOS Y HOBBIES */}
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <h3 className="text-purple-500 text-sm font-bold border-b border-gray-800 pb-2 mb-4 uppercase">3. Preferencias Personales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <InputField label="Hobbie (Deporte, Arte...)" name="hobby" placeholder="Ej: Futbol, Piano" color="purple" />
            <InputField label="Artista o Banda Favorita" name="artista" placeholder="Ej: BTS, Bad Bunny" color="purple" />
            <InputField label="Pelicula o Serie" name="pelicula" placeholder="Ej: Harry Potter" color="purple" />
            <InputField label="Comida Favorita" name="comida_favorita" placeholder="Ej: Pizza" color="purple" />
            <div className="md:col-span-2">
              <InputField label="Color Favorito" name="color_favorito" placeholder="Ej: Azul Marino" color="purple" />
            </div>
          </div>
        </div>

        {/* PASSWORD */}
        <div className="relative group pt-2 mt-4">
          <label className="block tracking-widest text-sm font-bold text-pink-500 mb-2 uppercase">CONTRASEÑA MAESTRA</label>
          <div className="relative">
            <input type="password" name="password" required className="w-full bg-black border-2 border-pink-900 text-pink-100 rounded-lg px-4 py-4 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono text-lg" placeholder="Escribe tu secreto combinado..." onChange={handleChange} />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-pink-500/50 text-xs uppercase tracking-widest hidden md:inline">Top Secret</span>
            </div>
          </div>
          <p className="text-xs text-pink-500/70 mt-3 font-semibold">REGLA: Debe contener fragmentos lógicos de tu vida pero estar bien camuflada.</p>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-4 rounded-lg shadow-[0_0_15px_rgba(6,-182,212,0.4)] transition-all flex justify-center items-center gap-2 uppercase tracking-widest disabled:opacity-50">
          {loading ? "Calculando..." : "GUARDAR FICHA E INICIAR RETO"}
        </button>
      </form>
    </div>
  );
}
