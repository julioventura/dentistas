import React, { useState, useEffect } from 'react';

type Theme = 'blue' | 'green' | 'red' | 'dark' | 'purple' | 'teal' | 'orange' | 'pink' | 'indigo' | 'brown';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Obter tema salvo ou usar 'dark' como padrão (paleta 4)
    return (localStorage.getItem('dentistas-theme') as Theme) || 'dark';
  });

  useEffect(() => {
    // Aplicar tema ao carregar o componente
    const savedTheme = localStorage.getItem('dentistas-theme') as Theme | null;
    
    // Se não houver tema salvo, definir 'dark' como padrão
    if (!savedTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('dentistas-theme', 'dark');
      setCurrentTheme('dark');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
      setCurrentTheme(savedTheme);
    }
  }, []);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dentistas-theme', theme);
  };

  if (!isOpen) return null;

  const themeOptions = [
    { id: 'blue', name: 'Azul', gradient: 'linear-gradient(135deg, hsl(270, 100%, 15%), hsl(220, 100%, 20%))' },
    { id: 'green', name: 'Verde', gradient: 'linear-gradient(135deg, hsl(160, 100%, 15%), hsl(140, 100%, 20%))' },
    { id: 'red', name: 'Vermelho', gradient: 'linear-gradient(135deg, hsl(340, 100%, 15%), hsl(0, 100%, 20%))' },
    { id: 'dark', name: 'Escuro', gradient: 'linear-gradient(135deg, hsl(0, 0%, 10%), hsl(0, 0%, 20%))' },
    { id: 'purple', name: 'Roxo', gradient: 'linear-gradient(135deg, hsl(280, 100%, 15%), hsl(260, 100%, 25%))' },
    { id: 'teal', name: 'Turquesa', gradient: 'linear-gradient(135deg, hsl(190, 100%, 15%), hsl(180, 100%, 25%))' },
    { id: 'orange', name: 'Laranja', gradient: 'linear-gradient(135deg, hsl(20, 100%, 15%), hsl(30, 100%, 25%))' },
    { id: 'pink', name: 'Rosa', gradient: 'linear-gradient(135deg, hsl(350, 100%, 15%), hsl(330, 100%, 25%))' },
    { id: 'indigo', name: 'Índigo', gradient: 'linear-gradient(135deg, hsl(230, 100%, 15%), hsl(240, 100%, 25%))' },
    { id: 'brown', name: 'Marrom', gradient: 'linear-gradient(135deg, hsl(20, 50%, 15%), hsl(30, 50%, 25%))' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass max-w-md w-full p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Configurações</h2>
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="divider"></div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Paleta de Cores</h3>
          <div className="grid grid-cols-5 gap-3">
            {themeOptions.map((theme) => (
              <button 
                key={theme.id}
                onClick={() => changeTheme(theme.id as Theme)}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${currentTheme === theme.id ? 'ring-2 ring-white p-0.5' : ''}`}
                title={theme.name}
              >
                <span 
                  className="w-full h-full rounded-full" 
                  style={{ background: theme.gradient }}
                />
              </button>
            ))}
          </div>
          <div className="mt-4 text-sm text-white/70 text-center">
            <p>Selecione uma das 10 paletas de cores disponíveis</p>
          </div>
        </div>
        
        <div className="divider"></div>
        
        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="btn-primary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
