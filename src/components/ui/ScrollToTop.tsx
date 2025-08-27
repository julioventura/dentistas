import React from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopProps {
  visible: boolean;
}

const ScrollToTop: React.FC<ScrollToTopProps> = ({ visible }) => {
  if (!visible) return null;

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Voltar ao topo"
      style={{
        position: 'fixed',
        top: 16,
        right: 24,
        zIndex: 50,
        background: 'transparent',
        borderRadius: '999px',
        // boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: 'none',
        padding: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.3s',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="backdrop-blur-md hover:bg-white/20"
    >
      <ChevronUp size={28} color="#d1d5db" />
    </button>
  );
};

export default ScrollToTop;
