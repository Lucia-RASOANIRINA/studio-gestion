import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext'; // chemin selon ton arborescence
import Login from './components/Login';
import Accueil from './pages/Accueil';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Commandes from './pages/Commandes';
import Parametres from './pages/Parametres';
import LignesCommandes from './pages/LignesCommandes';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/accueil" element={<Accueil />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/services" element={<Services />} />
          <Route path="/commandes" element={<Commandes />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/lignes-commandes" element={<LignesCommandes />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;
