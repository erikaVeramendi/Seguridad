import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import HackingConsole from './HackingConsole';

function App() {
  const [role, setRole] = useState(null);

  return (
    <div className="min-h-screen font-mono p-4 bg-gray-950 text-white selection:bg-cyan-500/30">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 text-center mt-8 cursor-pointer" onClick={() => setRole(null)}>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 shadow-cyan-500/50 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-tight">
            TALLER CIBERSEGURIDAD
          </h1>
          <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase animate-pulse">Simulador de Ingeniería Social v2.0</p>
        </header>

        {!role && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
            {/* CREADOR CARD */}
            <div 
              onClick={() => setRole('creador')}
              className="group relative bg-gray-900 border-2 border-cyan-500/30 p-8 rounded-2xl hover:border-cyan-400 cursor-pointer transition-all hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <h2 className="text-3xl font-black text-cyan-400 mb-4">CREADOR</h2>
              <p className="text-gray-400 mb-6 line-clamp-3">
                Tu objetivo: Construir una identidad digital real. Crea tu "Contraseña Maestra" y protégela. Oculta la lógica detrás de tus gustos, pero haz que tenga sentido.
              </p>
              <span className="inline-block bg-cyan-900/50 text-cyan-300 px-4 py-2 rounded font-bold uppercase text-sm border border-cyan-500/50 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                Ingresar como Creador
              </span>
            </div>

            {/* DETECTIVE CARD */}
            <div 
              onClick={() => setRole('detective')}
              className="group relative bg-gray-900 border-2 border-red-500/30 p-8 rounded-2xl hover:border-red-500 cursor-pointer transition-all hover:shadow-[0_0_40px_rgba(239,68,68,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              <h2 className="text-3xl font-black text-red-500 mb-4">DETECTIVE</h2>
              <p className="text-gray-400 mb-6">
                Tu objetivo: Aplicar ingeniería social. Busca patrones en la vida del "Creador", analiza su Ficha de Inteligencia y rompe su contraseña. Tienes 3 intentos por objetivo.
              </p>
              <span className="inline-block bg-red-900/50 text-red-300 px-4 py-2 rounded font-bold uppercase text-sm border border-red-500/50 group-hover:bg-red-500 group-hover:text-white transition-colors">
                Ingresar como Detective
              </span>
            </div>
          </div>
        )}

        {role === 'creador' && (
          <div className="animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setRole(null)} 
              className="mb-8 text-cyan-500 hover:text-cyan-300 flex items-center gap-2 border border-cyan-500/30 px-4 py-1 rounded"
            >
              &larr; Volver al lobby
            </button>
            <RegistrationForm />
          </div>
        )}

        {role === 'detective' && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <button 
              onClick={() => setRole(null)} 
              className="mb-8 text-red-500 hover:text-red-300 flex items-center gap-2 border border-red-500/30 px-4 py-1 rounded"
            >
              &larr; Abortar intrusión
            </button>
            <HackingConsole />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
