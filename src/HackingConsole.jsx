import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function HackingConsole({ targetUser }) {
  const [guess, setGuess] = useState("");
  const [clue, setClue] = useState("");
  const [hacked, setHacked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState([]);

  // Lógica de generación de pistas basada en los datos del usuario
  const generateClue = (input, user) => {
    const inputLower = input.toLowerCase();
    const passLower = user.password.toLowerCase();
    const petLower = user.mascota.toLowerCase();
    const colorLower = user.color_favorito.toLowerCase();

    if (passLower.includes(petLower)) {
      return `¡Atención! La contraseña podría tener relación con su mascota (${user.mascota})...`;
    }
    if (passLower.includes(colorLower)) {
      return `Pista detectada: El objetivo ama el color ${user.color_favorito}. ¿Quizás lo usó?`;
    }
    if (passLower.length > 8) {
      return `Análisis predictivo: La contraseña es bastante larga (más de 8 caracteres).`;
    }
    if (/\d/.test(passLower)) {
      return `Escaneo de bytes: Se han detectado números en la contraseña.`;
    }
    
    return `Error de desencriptación. ¡Sigue intentando! Prueba combinando su color y números.`;
  };

  const handleHackAttempt = async (e) => {
    e.preventDefault();
    if (!targetUser) return;
    setLoading(true);

    // Simulamos un pequeño retraso de red para dar efecto de "hackeo"
    await new Promise(resolve => setTimeout(resolve, 800));

    if (guess === targetUser.password) {
      setHacked(true);
      setClue("");
    } else {
      const newClue = generateClue(guess, targetUser);
      setClue(newClue);
      setAttempts([{ text: guess, success: false }, ...attempts].slice(0, 5));
    }
    
    setLoading(false);
    setGuess("");
  };

  if (hacked) {
    return (
      <div className="fixed inset-0 bg-red-950 flex flex-col items-center justify-center z-50">
        <div className="relative">
          <h1 className="text-6xl md:text-8xl font-black text-red-500 tracking-tighter animate-pulse drop-shadow-[0_0_35px_rgba(239,68,68,0.8)] text-center">
            ¡SISTEMA<br/>HACKEADO!
          </h1>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-red-500 rounded-lg animate-ping opacity-20"></div>
        </div>
        <p className="mt-8 text-red-300 font-mono text-xl typing-effect">Acceso Total Concedido al perfil de {targetUser.nombre}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-12 px-6 py-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black font-bold uppercase transition-colors"
        >
          Reiniciar Sistema
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-black border border-green-500/30 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.8)] font-mono">
      <div className="flex items-center justify-between border-b border-green-500/30 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-green-500 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          TERMINAL DE INTRUSIÓN
        </h2>
        <span className="text-green-700 text-sm">v2.1.0</span>
      </div>

      <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded">
        <p className="text-gray-400 mb-2">Objetivo Fijado:</p>
        {targetUser ? (
          <div>
            <p className="text-cyan-400">ID: <span className="text-gray-300">{targetUser.id.substring(0,8)}...</span></p>
            <p className="text-cyan-400">Nombre: <span className="text-white font-bold">{targetUser.nombre}</span></p>
          </div>
        ) : (
          <p className="text-red-500 animate-pulse">Esperando conexión de objetivo...</p>
        )}
      </div>

      <form onSubmit={handleHackAttempt} className="space-y-4">
        <div>
          <label className="block text-green-500 mb-2">{">_ INGRESE PAYLOAD (CONTRASEÑA):"}</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              disabled={!targetUser || loading}
              className="flex-1 bg-gray-900 border border-green-500/50 text-green-400 rounded px-4 py-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all font-mono"
              placeholder="Fuerza bruta..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <button
              type="submit"
              disabled={!targetUser || loading || !guess}
              className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Ejecutando..." : "Hackear"}
            </button>
          </div>
        </div>
      </form>

      {clue && (
        <div className="mt-6 p-4 border border-yellow-500/50 bg-yellow-900/10 rounded">
          <p className="text-yellow-400 flex items-start gap-2">
            <span className="text-xl">⚠️</span> 
            <span><strong className="text-yellow-300">INTERCEPTACIÓN LOGRADA / PISTA:</strong><br/>{clue}</span>
          </p>
        </div>
      )}

      {attempts.length > 0 && (
        <div className="mt-6 space-y-1">
          <p className="text-gray-500 text-sm mb-2">Historial de intentos ({attempts.length}):</p>
          {attempts.map((att, i) => (
            <p key={i} className="text-red-400 text-sm">
              [!] ACCESO DENEGADO: <span className="line-through opacity-50">{att.text}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
