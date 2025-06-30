import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Accueil from './pages/Accueil';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Commandes from './pages/Commandes';
import About from './pages/about';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/services" element={<Services />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
