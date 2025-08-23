import React from 'react';
import { Bot } from "lucide-react";

interface AppProps {
  title: string;
  description: string;
  description2: string;
  icon: string | React.ReactElement;
  url: string;
}

const AppCard: React.FC<AppProps> = ({ title, description, description2, icon, url }) => {
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
      <span className="text-xs text-white/60 raised px-3 py-1 rounded-full bg-white/10">{description2}</span>
    </a>
  );
};

const OurChatbots: React.FC = () => {
  const apps = [

    {
      title: "LGPD-BOT",
      description: "Lei Geral de Proteção de Dados",
      description2: "Chatbot especializado",
      icon: <Bot size={32} />,
      url: "#clinica"
    },
    {
      title: "TutFOP",
      description: "Tutor Clínico - ver. 2 (FO-UPE)",
      description2: "",
      icon: <Bot size={32} />,
      url: "#tutfop"
    },
    {
      title: "Gerador de Slides",
      description: "Apostila e Prova no Google Forms",
      description2: "",
      icon: <Bot size={32} />,
      url: "#slides"
    },
    {
      title: "Formatador de Referências",
      description: "Referências Bibliográficas",
      description2: "",
      icon: <Bot size={32} />,
      url: "#referencias"
    },
  ];

  return (
    <section id="chatbots" className="py-16 px-4">
      <div className="glass max-w-6xl mx-auto p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Nossos Chatbots Públicos</h2>
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
              description2={app.description2}
              icon={app.icon}
              url={app.url}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurChatbots;
