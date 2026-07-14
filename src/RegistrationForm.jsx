import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function RegistrationForm({ onRegister }) {
  const [formData, setFormData] = useState({
    nombre: "",
    mascota: "",
    color_favorito: "",
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
      alert("Hubo un error al registrarse.");
    } else {
      setSuccess(true);
      if (onRegister) onRegister(data[0]);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="p-8 text-center bg-green-900/20 border border-green-500 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]">
        <h2 className="text-2xl font-bold text-green-400 mb-4 animate-pulse">¡Registro Exitoso!</h2>
        <p className="text-green-200">Tus datos han sido guardados en la central.</p>
        <p className="text-sm text-green-500/80 mt-4">Prepara tus defensas, un hacker podría estar al acecho.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-6 text-center tracking-tight">
        REGISTRO DE AGENTE
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-cyan-500 mb-1">Nombre de Agente</label>
          <input
            type="text"
            name="nombre"
            required
            className="w-full bg-gray-800 border border-gray-600 text-cyan-100 rounded-md px-4 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            placeholder="Ej: Neo"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-500 mb-1">Nombre de tu Mascota</label>
          <input
            type="text"
            name="mascota"
            required
            className="w-full bg-gray-800 border border-gray-600 text-cyan-100 rounded-md px-4 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            placeholder="Ej: Firulais"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cyan-500 mb-1">Color Favorito</label>
          <input
            type="text"
            name="color_favorito"
            required
            className="w-full bg-gray-800 border border-gray-600 text-cyan-100 rounded-md px-4 py-2 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
            placeholder="Ej: Azul"
            onChange={handleChange}
          />
        </div>
        <div className="relative group">
          <label className="block text-sm font-medium text-pink-500 mb-1">Contraseña Secreta</label>
          <input
            type="password"
            name="password"
            required
            className="w-full bg-gray-800 border border-pink-900/50 text-pink-100 rounded-md px-4 py-2 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-mono"
            placeholder="•••"
            onChange={handleChange}
          />
          <div className="absolute inset-0 border border-pink-500 rounded-md opacity-0 group-focus-within:opacity-100 group-hover:opacity-30 pointer-events-none transition-opacity duration-300"></div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-4 rounded-md shadow-[0_0_15px_rgba(6,-182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all flex justify-center items-center gap-2 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Cifrando..." : "Guardar en Supabase"}
        </button>
      </form>
    </div>
  );
}
