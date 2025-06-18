import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Connexion from './pages/Connexion';
import Accueil from './pages/Accueil';
import GestionClients from './pages/GestionClients';
import GestionServices from './pages/GestionServices';
import GestionCommandes from './pages/GestionCommandes';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/clients" element={<GestionClients />} />
        <Route path="/services" element={<GestionServices />} />
        <Route path="/commandes" element={<GestionCommandes />} />
      </Routes>
    </Router>
  );
};

export default App;
