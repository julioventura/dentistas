import React, { useState, useEffect, useRef } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';

type Theme = 'blue' | 'green' | 'red' | 'dark' | 'purple' | 'teal' | 'orange' | 'pink' | 'indigo' | 'brown';

interface ThemeOption {
  id: Theme;
  name: string;
  gradient: string;
  preview: string;
}

const ThemeSwitcher: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>('blue');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes: ThemeOption[] = [
    {
      id: 'blue',
      name: 'Azul Oceano',
      gradient: 'linear-gradient(135deg, hsl(270, 100%, 25%), hsl(220, 100%, 35%))',
      preview: 'from-blue-600 to-purple-600'
    },
    {
      id: 'green',
      name: 'Verde Floresta',
      gradient: 'linear-gradient(135deg, hsl(160, 100%, 25%), hsl(140, 100%, 35%))',
      preview: 'from-green-600 to-emerald-600'
    },
    {
      id: 'red',
      name: 'Vermelho Rubi',
      gradient: 'linear-gradient(135deg, hsl(340, 100%, 25%), hsl(0, 100%, 35%))',
      preview: 'from-red-600 to-pink-600'
    },
    {
      id: 'purple',
      name: 'Roxo Ametista',
      gradient: 'linear-gradient(135deg, hsl(280, 100%, 25%), hsl(260, 100%, 35%))',
      preview: 'from-purple-600 to-violet-600'
    },
    {
      id: 'teal',
      name: 'Turquesa',
      gradient: 'linear-gradient(135deg, hsl(190, 100%, 25%), hsl(180, 100%, 35%))',
      preview: 'from-teal-600 to-cyan-600'
    },
    {
      id: 'orange',
      name: 'Laranja Sunset',
      gradient: 'linear-gradient(135deg, hsl(20, 100%, 25%), hsl(30, 100%, 35%))',
      preview: 'from-orange-600 to-amber-600'
    },
    {
      id: 'pink',
      name: 'Rosa Sakura',
      gradient: 'linear-gradient(135deg, hsl(350, 100%, 25%), hsl(330, 100%, 35%))',
      preview: 'from-pink-600 to-rose-600'
    },
    {
      id: 'indigo',
      name: 'Índigo Noite',
      gradient: 'linear-gradient(135deg, hsl(230, 100%, 25%), hsl(240, 100%, 35%))',
      preview: 'from-indigo-600 to-blue-600'
    },
    {
      id: 'brown',
      name: 'Marrom Terra',
      gradient: 'linear-gradient(135deg, hsl(20, 50%, 25%), hsl(30, 50%, 35%))',
      preview: 'from-amber-700 to-orange-700'
    },
    {
      id: 'dark',
      name: 'Escuro Elegante',
      gradient: 'linear-gradient(135deg, hsl(0, 0%, 15%), hsl(0, 0%, 25%))',
      preview: 'from-gray-800 to-gray-600'
    }
  ];

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

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dentistas-theme', theme);
    setIsOpen(false);
  };

  const getCurrentThemeName = () => {
    return themes.find(theme => theme.id === currentTheme)?.name || 'Tema Atual';
  };

  return (
    <div className="theme-switcher fixed top-20 right-4 z-50" ref={dropdownRef}>
      {/* Botão Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass p-3 rounded-xl flex items-center gap-2 min-w-[160px] hover:bg-white/15 transition-all duration-300 group"
        aria-label="Seletor de Tema"
      >
        <div className="flex items-center gap-2 flex-1">
          <Palette size={18} className="text-white/80 group-hover:text-white transition-colors" />
          <span className="text-white/90 text-sm font-medium truncate">
            {getCurrentThemeName()}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-white/60 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 glass rounded-xl p-2 shadow-2xl backdrop-blur-lg border border-white/20">
          <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-white/10">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => changeTheme(theme.id)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 group"
              >
                {/* Preview do Tema */}
                <div
                  className="w-8 h-8 rounded-full shadow-md ring-2 ring-white/20 flex-shrink-0"
                  style={{ background: theme.gradient }}
                />

                {/* Nome do Tema */}
                <span className="text-white/90 text-sm font-medium flex-1 text-left group-hover:text-white transition-colors">
                  {theme.name}
                </span>

                {/* Indicador de Seleção */}
                {currentTheme === theme.id && (
                  <Check size={16} className="text-green-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
