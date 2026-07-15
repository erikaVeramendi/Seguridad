import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useSoundEffects } from "./useSoundEffects";

export default function HackingConsole() {
  const [users, setUsers] = useState([]);
  const [targetUser, setTargetUser] = useState(null);
  
  const [guess, setGuess] = useState("");
  const [clue, setClue] = useState("");
  const [hacked, setHacked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 3;

  const { playHover, playType, playWin, playLoseAttempt, playGameOver } = useSoundEffects();

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
    
    // Check all fields
    const fields = {
      mascota: user.mascota?.toLowerCase() || '',
      padres: user.padres?.toLowerCase() || '',
      hermanos: user.hermanos?.toLowerCase() || '',
      pareja: user.pareja?.toLowerCase() || '',
      artista: user.artista?.toLowerCase() || '',
      pelicula: user.pelicula?.toLowerCase() || '',
      hobby: user.hobby?.toLowerCase() || '',
      fecha: user.fecha_nacimiento?.toLowerCase() || ''
    };

    if (passLower.includes(fields.padres) && !inputLower.includes(fields.padres)) return `Análisis Psicológico: Las personas que confían en sus padres (${user.padres}) suelen usarlos de clave.`;
    if (passLower.includes(fields.pareja) && !inputLower.includes(fields.pareja)) return `Vulnerabilidad Emocional: ¿Has probado poner a su pareja/amigo (${user.pareja}) en tu ataque?`;
    if (passLower.includes(fields.artista) && !inputLower.includes(fields.artista)) return `Brecha de Entretenimiento: Sabemos que escucha a ${user.artista}. Deberías intentar por ahí.`;
    if (passLower.includes(fields.pelicula) && !inputLower.includes(fields.pelicula)) return `Ingeniería Social Fandom: El usuario es fan de ${user.pelicula}...`;
    if (passLower.includes(fields.hermanos) && !inputLower.includes(fields.hermanos)) return `Lazo familiar detectado: A veces los hermanos (${user.hermanos}) son la clave.`;
    if (passLower.includes(fields.mascota) && !inputLower.includes(fields.mascota)) return `Las mascotas siempre son el eslabón más débil, prueba con (${user.mascota}).`;
    
    // Extract year from date string if date exists and is properly formatted
    const yearMatch = fields.fecha.match(/\d{4}/);
    if (yearMatch && passLower.includes(yearMatch[0]) && !inputLower.includes(yearMatch[0])) {
      return `Pista Numérica: La mayoría junta nombres con años de nacimiento (${yearMatch[0]}).`;
    }

    if (/\d/.test(passLower) && !/\d/.test(inputLower)) return `Error: El servidor dice que faltan números en tu ataque.`;
    
    return `La víctima camufló muy bien los datos. Mezcla letras, o partes de sus gustos y familia.`;
  };

  const handleHackAttempt = async (e) => {
    e.preventDefault();
    if (!targetUser || attemptCount >= MAX_ATTEMPTS) return;
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const currentAttempt = attemptCount + 1;
    setAttemptCount(currentAttempt);

    if (guess.toLowerCase() === targetUser.password.toLowerCase() || guess === targetUser.password) {
      setHacked(true);
      setClue("");
      playWin();
    } else {
      if (currentAttempt >= MAX_ATTEMPTS) {
        setClue("ALERTA MÁXIMA. IP BLOQUEADA. DESCONECTANDO VÍNCULO.");
        playGameOver();
      } else {
        const newClue = generateClue(guess, targetUser);
        setClue(newClue);
        playLoseAttempt();
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
          <div className="text-7xl md:text-9xl font-black text-red-500 tracking-tighter mix-blend-screen drop-shadow-[0_0_80px_rgba(239,68,68,1)] text-center animate-pulse">
            ¡SISTEMA VULNERADO!
          </div>
          <div className="mt-8 bg-black border border-red-500 p-8 shadow-[0_0_30px_rgba(239,68,68,0.5)] max-w-3xl text-center">
            <p className="text-red-300 font-mono text-2xl typing-effect font-bold mb-4">
              DATOS DE {targetUser.nombre.toUpperCase()} COMPROMETIDOS
            </p>
            <p className="text-gray-300 font-mono text-lg">
              La contraseña real era: <span className="text-white bg-red-900 px-2 py-1 rounded">{targetUser.password}</span>
            </p>
            <p className="mt-8 text-gray-400 text-sm italic">
              "No hackeamos supercomputadoras de millones de dólares. Hackeamos la mente humana.<br/>
              La Ingeniería Social demuestra que sin importar que haya 11 datos o 100, los humanos somos predecibles."
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-12 px-12 py-4 bg-red-600 text-white font-bold uppercase rounded shadow-[0_0_20px_rgba(239,68,68,0.8)] text-xl hover:bg-white hover:text-red-600">
            TERMINAR SIMULACIÓN
          </button>
        </div>
      </div>
    );
  }

  if (!targetUser) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-gray-950 border border-blue-500/30 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.1)] font-mono">
        <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-ping"></span>
          RADARES ACTIVOS: SELECCIONE UN CREADOR A AUDITAR
        </h2>
        {users.length === 0 ? (
          <p className="text-gray-500 italic p-8 text-center border border-dashed border-gray-800">Esperando conexiones en la red local... 0 usuarios detectados.</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {users.map(u => (
              <div key={u.id} onClick={() => selectTarget(u)} className="p-4 bg-black border border-gray-800 hover:border-blue-500 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(59,130,246,0.2)] group flex flex-col justify-between rounded-lg">
                <div>
                  <span className="font-bold text-gray-200 text-lg group-hover:text-blue-400 block mb-2">{u.nombre}</span>
                  <p className="text-gray-600 text-[10px] uppercase font-bold">🎯 Target Activo</p>
                </div>
                <span className="bg-blue-900/40 text-blue-400 text-xs px-2 py-2 rounded text-center mt-4 uppercase border border-blue-500/50">Auditar Perfil</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const isLockedOut = attemptCount >= MAX_ATTEMPTS;

  return (
    <div className="max-w-6xl mx-auto grid xl:grid-cols-4 gap-6 font-mono">
      
      {/* PANEL IZQUIERDO: EXTENSA FICHA DE INTELIGENCIA */}
      <div className="xl:col-span-1 bg-gray-950 rounded-xl overflow-y-auto max-h-[80vh] custom-scrollbar border border-gray-800 shadow-xl border-t-4 border-t-blue-500">
        <div className="sticky top-0 bg-gray-950/90 backdrop-blur text-blue-400 font-black p-4 border-b border-gray-800 flex items-center gap-2 text-sm uppercase">
          DOSSIER CLASIFICADO
        </div>
        <div className="p-5 space-y-5">
          <div className="border border-gray-800 bg-black p-3 rounded-lg">
            <p className="text-gray-500 text-[10px] font-bold">INFO PERSONAL</p>
            <p className="text-white font-black text-xl">{targetUser.nombre}</p>
            <p className="text-cyan-400 text-sm font-bold mt-1">Nac: {targetUser.fecha_nacimiento || '---'}</p>
          </div>

          <div className="space-y-3">
             <p className="text-gray-600 text-xs font-bold border-b border-gray-800 pb-1">VÍNCULOS</p>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Padres</span><span className="text-green-300 font-bold">{targetUser.padres || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Hermanos</span><span className="text-green-300 font-bold">{targetUser.hermanos || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Pareja / Amigo</span><span className="text-green-300 font-bold">{targetUser.pareja || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Mascota</span><span className="text-green-300 font-bold">{targetUser.mascota || '---'}</span></div>
          </div>

          <div className="space-y-3">
             <p className="text-gray-600 text-xs font-bold border-b border-gray-800 pb-1">PSICOLOGÍA / GUSTOS</p>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Pasión / Hobby</span><span className="text-purple-300 font-bold">{targetUser.hobby || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Música / Artista</span><span className="text-purple-300 font-bold">{targetUser.artista || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Película / Serie</span><span className="text-purple-300 font-bold">{targetUser.pelicula || '---'}</span></div>
             <div className="bg-gray-900 px-3 py-2 rounded"><span className="text-gray-500 text-[10px] block">Dieta y Color</span><span className="text-orange-300 font-bold">{targetUser.comida_favorita || '---'} - {targetUser.color_favorito}</span></div>
          </div>
        </div>
      </div>

      {/* PANEL DERECHO: TERMINAL */}
      <div className={`xl:col-span-3 p-8 bg-black border ${isLockedOut ? 'border-red-600' : 'border-green-500/30'} rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col relative`}>
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-8">
          <h2 className={`text-2xl font-black ${isLockedOut ? 'text-red-500' : 'text-green-500'} flex items-center gap-3`}>
            <span className={`w-4 h-4 ${isLockedOut ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-ping`}></span>
            CONSOLA DE INGENIERÍA SOCIAL
          </h2>
          <button onClick={() => selectTarget(null)} className="text-gray-400 text-sm hover:text-white border px-4 py-2 rounded border-gray-700 hover:bg-gray-800 transition-colors">Volver a Lobby</button>
        </div>

        <div className="flex justify-between items-center mb-8 bg-gray-900/50 p-4 rounded-lg border border-gray-800">
          <p className="text-gray-400">Auditoriando a: <span className="text-orange-400 font-bold text-xl ml-2">{targetUser.nombre}</span></p>
          <div className="flex gap-3 items-center">
            <span className="text-sm text-gray-500 uppercase font-bold mr-2">Vidas Restantes:</span>
            {[1,2,3].map(n => (
               <div key={n} className={`w-8 h-4 ${n <= attemptCount ? 'bg-red-600' : 'bg-green-500 border border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]'}`}></div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {isLockedOut ? (
            <div className="p-12 border-4 border-red-600 bg-red-950/20 text-center animate-pulse rounded-xl mt-8">
              <h1 className="text-5xl font-black text-red-500 mb-4 tracking-tighter">ACCESO DENEGADO PERMANENTE</h1>
              <p className="text-red-300 text-xl">Sistema biométrico de defensa activado. Has perdido tus 3 intentos. El objetivo está a salvo.</p>
            </div>
          ) : (
            <form onSubmit={handleHackAttempt} className="space-y-6">
              <div>
                <label className="block text-green-500 mb-4 font-bold">{">_ INGRESE LAS DEDUCCIONES DE CONTRASEÑA EN EL TERMINAL:"}</label>
                <div className="flex flex-col md:flex-row gap-4">
                  <input type="text" required disabled={loading} className="flex-1 bg-gray-900 border-2 border-green-500/30 text-green-400 rounded-xl px-6 py-5 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all font-mono text-3xl" placeholder="Ej: Matrix1999" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={playType} onMouseEnter={playHover} autoComplete="off" />
                  <button type="submit" disabled={loading || !guess} onMouseEnter={playHover} className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-500 text-black font-black px-12 py-5 rounded-xl text-xl uppercase transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] disabled:opacity-50 hover:scale-105">
                    {loading ? "..." : "EJECUTAR ATAQUE"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {clue && (
            <div className={`mt-10 p-6 border-l-4 rounded-r-xl ${isLockedOut ? 'border-red-600 bg-red-900/10 text-red-400' : 'border-yellow-500 bg-yellow-900/10 text-yellow-400'}`}>
              <p className="flex items-start gap-4">
                <span className="text-3xl">{isLockedOut ? '🚨' : '🤖'}</span> 
                <span><strong className={`block mb-1 font-black ${isLockedOut ? 'text-red-300' : 'text-yellow-300'}`}>IA DE APOYO TÁCTICO:</strong><span className="text-lg">{clue}</span></span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
