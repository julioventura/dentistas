import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="glass max-w-5xl mx-auto p-8 md:p-12 text-center">
        <div className="raised inline-block px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-white/10 to-white/20">
          <span className="text-sm font-semibold text-white">Plataforma Odontológica Integrada</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
          Hub de Aplicações Odontológicas
        </h1>
        
        <div className="emboss p-6 rounded-xl mb-8 max-w-3xl mx-auto bg-white/5">
          <p className="text-xl md:text-2xl text-white/90">
            Software de código aberto pronto para instalar, configurar e usar.
            Ou use a nossa versão já instalada com acesso gratuito.
          </p>
        </div>
        
        <div className="divider"></div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#aplicativos" className="btn-primary">
            Explorar Aplicativos
          </a>
          <a href="#detalhes" className="btn-secondary">
            Saiba Mais
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
