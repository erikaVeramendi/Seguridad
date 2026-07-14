import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    mascota: "",
    color_favorito: "",
    comida_favorita: "",
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

    const { data, error } = await supabase
      .from("jugadores")
      .insert([formData])
      .select();

    if (error) {
      console.error("Error guardando datos:", error);
      alert("Hubo un error al registrarse. ¿Ejecutaste el comando SQL para agregar comida_favorita?");
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
          <p className="text-xl text-green-100 mb-2">Tu identidad está segura en la base de datos.</p>
          <p className="text-sm text-green-500/80 mt-8 font-mono border-t border-green-900/50 pt-6">El juego ha comenzado. Espera a que el Detective intente encontrarte.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 tracking-tight">
          CREAR IDENTIDAD
        </h2>
        <p className="text-sm text-gray-400 mt-2">Crea una contraseña difícil pero que tenga lógica.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-1">Nombre Real o Apodo</label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full bg-gray-950 border border-gray-700 text-cyan-100 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            placeholder="Ej: Juan, Maria..."
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-1">Nombre de tu Mascota</label>
          <input
            type="text"
            name="mascota"
            required
            className="w-full bg-gray-950 border border-gray-700 text-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all font-mono"
            placeholder="Ej: Firulais"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-1">Color Favorito</label>
          <input
            type="text"
            name="color_favorito"
            required
            className="w-full bg-gray-950 border border-gray-700 text-blue-100 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all font-mono"
            placeholder="Ej: Azul"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-indigo-400 mb-1">Comida Favorita 🍕</label>
          <input
            type="text"
            name="comida_favorita"
            required
            className="w-full bg-gray-950 border border-gray-700 text-indigo-100 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-mono"
            placeholder="Ej: Pizza"
            onChange={handleChange}
          />
        </div>
        <div className="relative group pt-4 border-t border-gray-800">
          <label className="block text-sm font-medium text-pink-500 mb-2">CONTRASEÑA MAESTRA</label>
          <div className="relative">
            <input
              type="password"
              name="password"
              required
              className="w-full bg-gray-950 border-2 border-pink-900 text-pink-100 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
              placeholder="Escribe tu secreto..."
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-pink-500/50 text-xs uppercase tracking-widest hidden md:inline">Top Secret</span>
            </div>
          </div>
          <p className="text-xs text-pink-500/70 mt-2">Su compañero intentará adivinarla basada en tus gustos.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 px-4 rounded-lg shadow-[0_0_15px_rgba(6,-182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex justify-center items-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando En DB..." : "Registrar Identidad"}
        </button>
      </form>
    </div>
  );
}
