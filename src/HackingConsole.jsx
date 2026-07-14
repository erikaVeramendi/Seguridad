import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function HackingConsole() {
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  
  const [guess, setGuess] = useState("");
  const [clue, setClue] = useState("");
  const [hacked, setHacked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 3;

  // Cargar todos los usuarios al iniciar como Detective
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase.from('jugadores').select('*').order('created_at', { ascending: false });
      if (data) setUsers(data);
    }
    fetchUsers();
  }, []);

  const selectTarget = (user) => {
    setTargetUser(user);
    setAttemptCount(0);
    setClue("");
    setGuess("");
    setHacked(false);
  };

  const generateClue = (input, user) => {
    const inputLower = input.toLowerCase();
    const passLower = user.password.toLowerCase();
    const petLower = user.mascota.toLowerCase();
    const foodLower = user.comida_favorita?.toLowerCase() || '';
    const colorLower = user.color_favorito.toLowerCase();

    // Lógica avanzada de pistas
    if (passLower.includes(petLower) && !inputLower.includes(petLower)) {
      return `Pista: ¿Has probado incluir su mascota (${user.mascota})?`;
    }
    if (passLower.includes(foodLower) && !inputLower.includes(foodLower)) {
      return `Pista: Una contraseña débil suele llevar su comida preferida (${user.comida_favorita || 'Pizza'}).`;
    }
    if (passLower.includes(colorLower)) {
      return `El inspector de bytes ha detectado rastros del color ${user.color_favorito}.`;
    }
    if (/\d/.test(passLower) && !/\d/.test(inputLower)) {
      return `Error fatal. Pista: Faltan caracteres numéricos.`;
    }
    
    // Sugerir ingenieria social básica
    return `Error de contraseña pura. Pista: Intenta combinar múltiples datos (Ej. SuMascotaSuComida123)`;
  };

  const handleHackAttempt = async (e) => {
    e.preventDefault();
    if (!targetUser || attemptCount >= MAX_ATTEMPTS) return;
    setLoading(true);

    // Retraso de red dramático
    await new Promise(resolve => setTimeout(resolve, 600));

    // AUMENTAMOS EL INTENTO AQUI
    const currentAttempt = attemptCount + 1;
    setAttemptCount(currentAttempt);

    if (guess === targetUser.password) {
      setHacked(true);
      setClue("");
    } else {
      if (currentAttempt >= MAX_ATTEMPTS) {
        setClue("ALERTA MÁXIMA DE SEGURIDAD. ESTE SISTEMA HA SIDO BLOQUEADO.");
      } else {
        const newClue = generateClue(guess, targetUser);
        setClue(newClue);
      }
    }
    
    setLoading(false);
    setGuess("");
  };

  // PANTALLA EXPLOSIÓN GLITCH SI ACERTÓ
  if (hacked) {
    return (
      <div className="fixed inset-0 bg-red-950 flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="glitch-layer"></div>
        <div className="relative z-20 flex flex-col items-center">
          <div className="text-8xl font-black text-red-500 tracking-tighter mix-blend-screen drop-shadow-[0_0_50px_rgba(239,68,68,1)] text-center animate-pulse">
            ¡ACCESO CONCEDIDO!
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-blue-500 tracking-tighter opacity-50 mix-blend-screen translate-x-2 translate-y-2">
            ¡ACCESO CONCEDIDO!
          </div>
          
          <div className="mt-12 bg-black border border-red-500 p-8 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
            <p className="text-red-300 font-mono text-2xl typing-effect">
              HAS ACCEDIDO A LOS DATOS DE {targetUser.nombre.toUpperCase()}
            </p>
            <p className="mt-8 text-gray-400 font-mono text-center">
              Lección técnica: "Esto es la Ingeniería Social. <br/>Los sistemas no fallan, fallamos nosotros porque somos predecibles."
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-16 px-8 py-3 bg-red-600 text-white hover:bg-red-500 font-bold uppercase transition-colors rounded-sm shadow-[0_0_20px_rgba(239,68,68,0.8)]"
          >
            Cerrar Brecha y Salir
          </button>
        </div>
      </div>
    );
  }

  // 1. SI NO HAY TARGET, MOSTRAR REPERTORIO DE VÍCTIMAS
  if (!targetUser) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-black border border-red-500/50 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] font-mono">
        <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
          📡 RADARES ACTIVOS: SELECCIONE UNA VÍCTIMA
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 italic p-8 text-center border border-dashed border-gray-700">Ningún "Creador" encontrado. Espera a que alguien se registre.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => selectTarget(u)}
                className="p-4 bg-gray-900 border border-gray-700 hover:border-red-500 cursor-pointer transition-colors hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] group"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-200 text-lg group-hover:text-red-400">{u.nombre}</span>
                  <span className="bg-red-950 text-red-500 text-xs px-2 py-1 rounded">Vulnerabilidad Desconocida</span>
                </div>
                <p className="text-gray-600 text-sm mt-2 font-black">ID: {u.id.substring(0,8)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. CONSOLA DE HACKEO PRINCIPAL
  const isLockedOut = attemptCount >= MAX_ATTEMPTS;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 font-mono">
      
      {/* PANEL IZQUIERDO: FICHA DE INTELIGENCIA */}
      <div className="md:col-span-1 border border-blue-500/30 bg-gray-950 rounded-xl overflow-hidden shadow-lg h-fit">
        <div className="bg-blue-900/30 text-blue-400 font-bold p-3 border-b border-blue-500/30 flex items-center gap-2 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
          FICHA DE INTELIGENCIA
        </div>
        <div className="p-4 space-y-4 text-sm">
          <div>
            <p className="text-gray-500 uppercase text-xs font-bold">Alias Objetivo</p>
            <p className="text-gray-200 text-lg">{targetUser.nombre}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-xs font-bold">Mascota Registrada</p>
            <p className="text-blue-300">{targetUser.mascota}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-xs font-bold">Color Detectado</p>
            <p className="text-purple-300">{targetUser.color_favorito}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-xs font-bold">Análisis de Dieta</p>
            <p className="text-orange-300">{targetUser.comida_favorita || 'Desconocida'}</p>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: TERMINAL */}
      <div className={`md:col-span-2 p-6 bg-black border ${isLockedOut ? 'border-red-600' : 'border-green-500/50'} rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <h2 className={`text-xl font-bold ${isLockedOut ? 'text-red-500' : 'text-green-500'} flex items-center gap-2`}>
            <span className={`w-3 h-3 ${isLockedOut ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-ping`}></span>
            TERMINAL DE INTRUSIÓN ROOT
          </h2>
          <button onClick={() => selectTarget(null)} className="text-gray-500 text-xs hover:text-white border px-2 py-1 rounded border-gray-700">Cambiar Objetivo</button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-400">Objetivo: <span className="text-white bg-gray-800 px-2 rounded">{targetUser.nombre}</span></p>
          <div className="flex gap-2">
            {[1,2,3].map(n => (
               <div key={n} className={`w-4 h-6 ${n <= attemptCount ? 'bg-red-600' : 'bg-green-600 border border-green-400'}`}></div>
            ))}
          </div>
        </div>

        {isLockedOut ? (
          <div className="p-8 border-2 border-red-600 bg-red-950/30 text-center animate-pulse">
            <h1 className="text-3xl font-black text-red-500 mb-2">SISTEMA BLOQUEADO</h1>
            <p className="text-red-300">Se detectaron 3 intentos fallidos. El sistema de defensa se activó. Ciberataque fracasado.</p>
          </div>
        ) : (
          <form onSubmit={handleHackAttempt} className="space-y-4">
            <div>
              <label className="block text-green-500 mb-2">{">_ INGRESA LA CONTRASEÑA OBTENIDA:"}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  disabled={loading}
                  className="flex-1 bg-gray-900 border border-green-500/50 text-green-400 rounded px-4 py-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all font-mono text-xl"
                  placeholder="Ej: Firulais123"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={loading || !guess}
                  className="bg-green-600 hover:bg-green-500 text-black font-bold px-6 py-3 rounded uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Calculando..." : "ATACAR"}
                </button>
              </div>
            </div>
          </form>
        )}

        {clue && (
          <div className={`mt-8 p-4 border rounded ${isLockedOut ? 'border-red-500/50 bg-red-900/10 text-red-400' : 'border-yellow-500/50 bg-yellow-900/10 text-yellow-400'}`}>
            <p className="flex items-start gap-2">
              <span className="text-xl">{isLockedOut ? '❌' : '🔎'}</span> 
              <span><strong className={isLockedOut ? 'text-red-300' : 'text-yellow-300'}>SISTEMA RESPONDE:</strong><br/>{clue}</span>
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
