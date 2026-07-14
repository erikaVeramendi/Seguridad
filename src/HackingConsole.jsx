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
    
    const petLower = user.mascota?.toLowerCase() || '';
    const foodLower = user.comida_favorita?.toLowerCase() || '';
    const colorLower = user.color_favorito?.toLowerCase() || '';
    const dateLower = user.fecha_nacimiento?.toLowerCase() || '';
    const familyLower = user.familia?.toLowerCase() || '';
    const hobbyLower = user.hobby?.toLowerCase() || '';

    // Lógica avanzada de pistas psicológicas
    if (passLower.includes(petLower) && !inputLower.includes(petLower)) {
      return `Los hackers siempre investigan a las mascotas... ¿y si su contraseña incluye a ${user.mascota}?`;
    }
    if (passLower.includes(familyLower) && !inputLower.includes(familyLower)) {
      return `Ingeniería Social: Muchas personas usan el nombre de sus familiares como su pareja o hermanos (${user.familia}).`;
    }
    if (passLower.includes(dateLower) && !inputLower.includes(dateLower)) {
      return `Pista Numérica: ¿Sabías que el 60% de las personas incluyen fechas importantes? Piensa en su fecha: ${user.fecha_nacimiento}.`;
    }
    if (passLower.includes(hobbyLower) && !inputLower.includes(hobbyLower)) {
      return `El blanco es un apasionado de su hobby (${user.hobby}). Esa podría ser la llave.`;
    }
    if (passLower.includes(foodLower) && !inputLower.includes(foodLower)) {
      return `Pista: Una mente ociosa siempre piensa en su comida favorita (${user.comida_favorita}).`;
    }
    if (passLower.includes(colorLower)) {
      return `El inspector de bytes ha detectado rastros de la palabra "${user.color_favorito}".`;
    }
    if (/\d/.test(passLower) && !/\d/.test(inputLower)) {
      return `Error fatal. Pista: Faltan caracteres numéricos. ¿Será un año o una fecha?`;
    }
    
    return `Análisis predictivo: La víctima combinó inteligentemente múltiples aspectos de su ficha. ¡Piensa como él/ella!`;
  };

  const handleHackAttempt = async (e) => {
    e.preventDefault();
    if (!targetUser || attemptCount >= MAX_ATTEMPTS) return;
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 600));

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

  if (hacked) {
    return (
      <div className="fixed inset-0 bg-red-950 flex flex-col items-center justify-center z-50 overflow-hidden">
        <div className="glitch-layer"></div>
        <div className="relative z-20 flex flex-col items-center">
          <div className="text-8xl md:text-9xl font-black text-red-500 tracking-tighter mix-blend-screen drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-center animate-pulse">
            ¡SISTEMA VULNERADO!
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl md:text-9xl font-black text-blue-500 tracking-tighter opacity-50 mix-blend-screen translate-x-3 translate-y-3 pointer-events-none">
            ¡SISTEMA VULNERADO!
          </div>
          
          <div className="mt-12 bg-black border border-red-500 p-8 shadow-[0_0_30px_rgba(239,68,68,0.5)] max-w-3xl text-center">
            <p className="text-red-300 font-mono text-3xl typing-effect font-bold">
              DATOS DE {targetUser.nombre.toUpperCase()} COMPROMETIDOS
            </p>
            <p className="mt-8 text-gray-300 font-mono text-lg">
              Esto es la <span className="text-red-400 font-bold">Ingeniería Social</span>.
            </p>
            <p className="mt-4 text-gray-400 text-sm">
              "No hackeamos supercomputadoras de millones de dólares. Hackeamos la mente humana.<br/>
              Las contraseñas fallan porque somos predecibles. Hoy, la información de esta ficha fue suficiente para destruir la seguridad."
            </p>
          </div>
          
          <button 
            onClick={() => window.location.reload()}
            className="mt-16 px-12 py-4 bg-red-600 text-white hover:bg-white hover:text-red-600 font-bold uppercase transition-colors rounded shadow-[0_0_20px_rgba(239,68,68,0.8)] text-xl"
          >
            TERMINAR SIMULACIÓN
          </button>
        </div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-black border border-red-500/50 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] font-mono">
        <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-2">
          📡 RADARES ACTIVOS: SELECCIONE UNA VÍCTIMA
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 italic p-8 text-center border border-dashed border-gray-700">Explorando red local... 0 Creadores detectados.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {users.map(u => (
              <div 
                key={u.id} 
                onClick={() => selectTarget(u)}
                className="p-4 bg-gray-900 border border-gray-700 hover:border-red-500 cursor-pointer transition-colors hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] group flex flex-col justify-between"
              >
                <div>
                  <span className="font-bold text-gray-200 text-xl group-hover:text-red-400 block mb-2">{u.nombre}</span>
                  <p className="text-gray-500 text-xs">Mascota: {u.mascota || '?'}</p>
                  <p className="text-gray-500 text-xs">Fam: {u.familia || '?'}</p>
                </div>
                <span className="bg-red-950 text-red-500 text-xs px-2 py-1 rounded text-center mt-4">Analizar Víctima</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const isLockedOut = attemptCount >= MAX_ATTEMPTS;

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 font-mono">
      
      {/* PANEL IZQUIERDO: FICHA DE INTELIGENCIA */}
      <div className="md:col-span-1 border border-blue-500/30 bg-gray-950 rounded-xl overflow-hidden shadow-lg h-fit border-t-4 border-t-blue-500">
        <div className="bg-blue-900/30 text-blue-400 font-bold p-3 border-b border-blue-500/30 flex items-center gap-2 text-sm uppercase">
          <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" /></svg>
          DOSSIER DE VÍCTIMA
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div>
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Alias (Nombre)</p>
            <p className="text-white text-xl font-black">{targetUser.nombre}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Año/Fecha Nacimiento</p>
            <p className="text-purple-300 font-bold">{targetUser.fecha_nacimiento || 'No registrada'}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Familia / Pareja</p>
            <p className="text-green-300 font-bold">{targetUser.familia || 'No registrada'}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Mascota Principal</p>
            <p className="text-blue-300 font-bold">{targetUser.mascota}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Hobbie o Pasión</p>
            <p className="text-indigo-300 font-bold">{targetUser.hobby || 'No registrado'}</p>
          </div>
          <div className="pt-2 border-t border-gray-800">
            <p className="text-gray-500 uppercase text-[10px] tracking-widest font-bold">Dieta y Color Favorito</p>
            <p className="text-orange-300 font-bold">{targetUser.comida_favorita || '?'} - {targetUser.color_favorito}</p>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: TERMINAL */}
      <div className={`md:col-span-2 p-6 bg-black border ${isLockedOut ? 'border-red-600' : 'border-green-500/50'} rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col`}>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <h2 className={`text-xl font-bold ${isLockedOut ? 'text-red-500' : 'text-green-500'} flex items-center gap-2`}>
            <span className={`w-3 h-3 ${isLockedOut ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-ping`}></span>
            TERMINAL DE EXPLOTACIÓN
          </h2>
          <button onClick={() => selectTarget(null)} className="text-gray-500 text-xs hover:text-white border px-3 py-1 rounded border-gray-700 hover:bg-gray-800 transition-colors">Volver a Radares</button>
        </div>

        <div className="flex justify-between items-center mb-6 bg-gray-900 p-3 rounded">
          <p className="text-gray-400 text-sm">Target ID: <span className="text-orange-400 font-bold">{targetUser.id.split('-')[0]}</span></p>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-gray-500 uppercase mr-2">Intentos restantes:</span>
            {[1,2,3].map(n => (
               <div key={n} className={`w-6 h-3 ${n <= attemptCount ? 'bg-red-600' : 'bg-green-500 border border-green-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]'}`}></div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {isLockedOut ? (
            <div className="p-10 border-2 border-red-600 bg-red-950/30 text-center animate-pulse rounded-lg mt-8">
              <h1 className="text-4xl font-black text-red-500 mb-2">FIREWALL ACTIVADO</h1>
              <p className="text-red-300 text-lg">Excediste los 3 intentos. La IP del atacante ha sido registrada y bloqueada.</p>
            </div>
          ) : (
            <form onSubmit={handleHackAttempt} className="space-y-4">
              <div>
                <label className="block text-green-500 mb-3 text-sm">{">_ INGRESA LA POSIBLE CONTRASEÑA EN EL TERMINAL:"}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    disabled={loading}
                    className="flex-1 bg-gray-900 border border-green-500/50 text-green-400 rounded-lg px-4 py-4 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all font-mono text-2xl"
                    placeholder="Ej: Firusmith1995"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={loading || !guess}
                    className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-4 rounded-lg uppercase transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {loading ? "..." : "ATACAR"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {clue && (
            <div className={`mt-8 p-5 border rounded-lg ${isLockedOut ? 'border-red-500/50 bg-red-900/10 text-red-400' : 'border-yellow-500/50 bg-yellow-900/10 text-yellow-400'}`}>
              <p className="flex items-start gap-3">
                <span className="text-2xl">{isLockedOut ? '🚨' : '🧠'}</span> 
                <span><strong className={isLockedOut ? 'text-red-300' : 'text-yellow-300'}>ANÁLISIS DEL FALLO:</strong><br/>{clue}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
