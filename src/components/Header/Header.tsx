import React, { useState } from 'react';
import Settings from '../Settings/Settings';
import MobileMenu from '../MobileMenu/MobileMenu';

const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Função para alternar o estado do menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  return (
    <>
      <header className="glass fixed top-0 left-0 right-0 z-50 px-6 py-4 mx-4 mt-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dentistas.com.br</h1>
        </div>
        <nav className="hidden md:flex space-x-6 items-center">
          {['Início', 'Aplicativos', 'Detalhes', 'Contato'].map((item, index) => (
            <a 
              key={index}
              href={`#${item.toLowerCase()}`} 
              className="text-white hover:text-blue-100 transition-colors relative group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-violet-400 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-white hover:text-blue-100 transition-colors p-2 raised rounded-full ml-2"
            title="Configurações"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </nav>
        <div className="md:hidden flex items-center">
          {/* Botão de configurações removido da versão mobile */}
          <button 
            onClick={toggleMobileMenu}
            className="text-white raised p-2 rounded-lg"
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
    </>
  );
};

export default Header;
