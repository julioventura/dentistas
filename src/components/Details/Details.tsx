import React from 'react';

interface AppProps {
  title: string;
  description: string;
  year: string;
  icon: string;
  url: string;
}

const AppCard: React.FC<AppProps> = ({ title, description, year, icon, url }) => {
  return (
    <a 
      href={url} 
      className="glass-card p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
    >
      <div className="icon mb-4 text-white text-4xl raised p-4 rounded-full bg-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 gradient-text">{title}</h3>
      <div className="emboss p-2 rounded-lg bg-white/5 mb-2">
        <p className="text-white/80 text-sm">{description}</p>
      </div>
      <span className="text-xs text-white/60 raised px-3 py-1 rounded-full bg-white/10">{year}</span>
    </a>
  );
};

const Details: React.FC = () => {
  const apps = [
    {
      title: "Clínica ver. 2",
      description: "FO-UFRJ e consultórios",
      year: "desde 2017",
      icon: "🏥",
      url: "#clinica-v2"
    },
    {
      title: "Clínica ver. 4",
      description: "FO-UPE e Fernando de Noronha",
      year: "desde 2024",
      icon: "🏥",
      url: "#clinica-v4"
    },
    {
      title: "Software de Endodontia",
      description: "FO-UPE",
      year: "",
      icon: "🦷",
      url: "#endodontia"
    },
    {
      title: "Dentistas Labs",
      description: "Laboratório de inovações",
      year: "",
      icon: "🔬",
      url: "#labs"
    },
    {
      title: "Calendar Monitor",
      description: "Monitoramento de agenda",
      year: "",
      icon: "📅",
      url: "#calendar"
    },
    {
      title: "Gmail Monitor",
      description: "Monitoramento de e-mails",
      year: "",
      icon: "📧",
      url: "#gmail"
    },
    {
      title: "Fastbot Creator",
      description: "Criação de bots automatizados",
      year: "",
      icon: "🤖",
      url: "#fastbot"
    },
    {
      title: "Whatsapp Monitor",
      description: "FO-UFC",
      year: "",
      icon: "💬",
      url: "#whatsapp"
    },
    {
      title: "TutFOP",
      description: "Tutor Clínico - ver. 2 (FO-UPE)",
      year: "",
      icon: "👨‍⚕️",
      url: "#tutfop"
    },
    {
      title: "Gerador de Slides",
      description: "Apostila e Prova no Google Forms",
      year: "",
      icon: "📊",
      url: "#slides"
    },
    {
      title: "Formatador de Referências",
      description: "Referências Bibliográficas",
      year: "",
      icon: "📚",
      url: "#referencias"
    },
    {
      title: "Software de Erupções Dentárias",
      description: "Doutorado FO-UFC",
      year: "",
      icon: "🔍",
      url: "#erupcoes"
    }
  ];

  return (
    <section id="detalhes" className="py-16 px-4">
      <div className="glass max-w-6xl mx-auto p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Nossos Produtos e Serviços</h2>
          <div className="divider"></div>
          <p className="text-white/80 max-w-2xl mx-auto emboss p-4 rounded-lg bg-white/5">
            Explore nossa coleção completa de ferramentas e aplicações desenvolvidas para profissionais e instituições de odontologia
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <AppCard 
              key={index}
              title={app.title}
              description={app.description}
              year={app.year}
              icon={app.icon}
              url={app.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Details;
