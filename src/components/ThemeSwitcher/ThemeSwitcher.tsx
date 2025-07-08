import React, { useState, useEffect } from 'react';

type Theme = 'blue' | 'green' | 'red' | 'dark';

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('blue');

  useEffect(() => {
    // Aplicar tema ao carregar o componente
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Verificar se há um tema salvo no localStorage
    const savedTheme = localStorage.getItem('dentistas-theme') as Theme | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dentistas-theme', theme);
  };

  return (
    <div className="theme-switcher fixed top-20 right-4 z-50 glass p-2 rounded-xl">
      <div className="flex flex-col gap-2">
        <button 
          onClick={() => changeTheme('blue')}
          className={`w-8 h-8 rounded-full ${currentTheme === 'blue' ? 'ring-2 ring-white' : ''}`}
          style={{ background: 'linear-gradient(135deg, hsl(270, 100%, 15%), hsl(220, 100%, 20%))' }}
          title="Tema Azul"
        />
        <button 
          onClick={() => changeTheme('green')}
          className={`w-8 h-8 rounded-full ${currentTheme === 'green' ? 'ring-2 ring-white' : ''}`}
          style={{ background: 'linear-gradient(135deg, hsl(120, 100%, 15%), hsl(160, 100%, 20%))' }}
          title="Tema Verde"
        />
        <button 
          onClick={() => changeTheme('red')}
          className={`w-8 h-8 rounded-full ${currentTheme === 'red' ? 'ring-2 ring-white' : ''}`}
          style={{ background: 'linear-gradient(135deg, hsl(0, 100%, 15%), hsl(340, 100%, 20%))' }}
          title="Tema Vermelho"
        />
        <button 
          onClick={() => changeTheme('dark')}
          className={`w-8 h-8 rounded-full ${currentTheme === 'dark' ? 'ring-2 ring-white' : ''}`}
          style={{ background: 'linear-gradient(135deg, hsl(0, 0%, 10%), hsl(0, 0%, 20%))' }}
          title="Tema Escuro"
        />
      </div>
    </div>
  );
};

export default ThemeSwitcher;
