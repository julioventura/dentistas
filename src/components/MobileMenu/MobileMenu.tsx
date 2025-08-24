import React, { useState, useEffect } from 'react';
import './MobileMenu.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimationClass('menu-slide-in');
      // Prevenir rolagem do body quando o menu está aberto
      document.body.style.overflow = 'hidden';
    } else {
      setAnimationClass('menu-slide-out');
      // Restaurar rolagem do body quando o menu está fechado
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && animationClass !== 'menu-slide-in') return null;

  const menuItems = [
    { name: 'Início', href: '#inicio' },
    { name: 'Aplicativos', href: '#aplicativos' },
    { name: 'Detalhes', href: '#detalhes' },
    { name: 'Contato', href: '#contato' },
  ];

  const handleLinkClick = () => {
    // Fecha o menu ao clicar em um link
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40">
      {/* Overlay escuro para fechar o menu ao clicar fora */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu lateral */}
      <div className={`fixed top-0 right-0 h-full w-64 glass-dark ${animationClass}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-full"
              aria-label="Fechar menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="divider"></div>

          <nav className="flex-1">
            <ul className="space-y-4">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="text-white hover:text-blue-100 transition-colors block py-2 px-4 rounded-lg hover:bg-white/10"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
