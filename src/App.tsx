// Componentes da aplicação
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import ScrollToTop from './components/ui/ScrollToTop';
import Hero from './components/Hero/Hero';
import Clinicas from './components/Clinicas/Clinicas';
import Aplicativos from './components/Aplicativos/Aplicativos';
import Chatbots from './components/Chatbots/Chatbots';
import Footer from './components/Footer/Footer';
// import ChatbotModal from "./components/ChatbotModal";

function App() {
  const [headerVisible, setHeaderVisible] = useState(true);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setHeaderVisible(!!customEvent.detail.visible);
    };
    window.addEventListener('header-visibility', handler);
    return () => {
      window.removeEventListener('header-visibility', handler);
    };
  }, []);

  return (
    <div className="min-h-screen scrollbar-hide">
      <Header />
      <main>
        <Hero />
        <Clinicas />
        <Aplicativos />
        <Chatbots />
      </main>
      <Footer />
      <ScrollToTop visible={!headerVisible} />
      {/* <ChatbotModal /> */}
    </div>
  );
}

export default App;
