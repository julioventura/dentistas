// Componentes da aplicação
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import AccessoRapido from './components/AccessoRapido/AccessoRapido';
import Details from './components/Details/Details';
import Footer from './components/Footer/Footer';
import ChatbotModal from "./components/ChatbotModal";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AccessoRapido />
        <Details />
      </main>


      <Footer />

      <ChatbotModal />

    </div>
  );
}

export default App;
