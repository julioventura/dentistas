import React from 'react';

interface AppCardProps {
  title: string;
  description: string;
  icon: string;
  url: string;
}

const AppCard: React.FC<AppCardProps> = ({ title, description, icon, url }) => {
  return (
    <a 
      href={url} 
      className="glass-card p-6 flex flex-col items-center text-center"
    >
      <div className="icon mb-4 text-white text-4xl raised p-4 rounded-full bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
      <p className="text-white/80 text-sm emboss p-2 rounded-lg bg-white/5">{description}</p>
    </a>
  );
};

const AccessoRapido: React.FC = () => {
  const apps = [
    {
      title: "Clínica ver. 4",
      description: "FO-UPE e Fernando de Noronha (desde 2024)",
      icon: "🏥",
      url: "#clinica-v4"
    },
    {
      title: "TutFOP",
      description: "Tutor Clínico - ver. 2 (FO-UPE)",
      icon: "👨‍⚕️",
      url: "#tutfop"
    },
    {
      title: "Whatsapp Monitor",
      description: "FO-UFC",
      icon: "💬",
      url: "#whatsapp-monitor"
    }
  ];

  return (
    <section id="aplicativos" className="py-12 px-4 mt-24">
      <div className="glass max-w-6xl mx-auto p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Acesso Rápido</h2>
          <div className="divider"></div>
          <p className="text-white/80 max-w-2xl mx-auto">Seus aplicativos mais utilizados em um só lugar, com acesso imediato</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <AppCard 
              key={index}
              title={app.title}
              description={app.description}
              icon={app.icon}
              url={app.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessoRapido;
