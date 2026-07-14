import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import HackingConsole from './HackingConsole';

function App() {
  const [objetivoHackeo, setObjetivoHackeo] = useState(null);

  return (
    <div className="min-h-screen font-mono p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center mt-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 shadow-cyan-500/50 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            TALLER CIBERSEGURIDAD
          </h1>
          <p className="text-gray-400 mt-2 text-sm tracking-widest uppercase">Simulador de Intrusión v1.0</p>
        </header>
        
        {!objetivoHackeo ? (
          // Primera Fase: Usuario Secreto se Registra
          <RegistrationForm onRegister={(user) => setObjetivoHackeo(user)} />
        ) : (
          // Segunda Fase: El estudiante Hacker intenta entrar
          <div className="animate-in fade-in zoom-in duration-500">
            <HackingConsole targetUser={objetivoHackeo} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
