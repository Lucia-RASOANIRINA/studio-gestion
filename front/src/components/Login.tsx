import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Info,
  Music,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-700 relative overflow-hidden font-sans ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0 flex z-0 animate-gradient-fade">
        <div
          className={`w-1/2 h-full ${
            darkMode
              ? 'bg-gradient-to-br from-[#0e0e0e] via-[#1a0030] to-[#260044]'
              : 'bg-gradient-to-br from-white via-[#fceff9] to-[#e6e6ff]'
          }`}
        />
        <div
          className={`w-1/2 h-full ${
            darkMode
              ? 'bg-gradient-to-tr from-[#3d1b5a] via-[#4a00e0] to-[#000]'
              : 'bg-gradient-to-tr from-[#fdf6ff] via-[#e6dbff] to-white'
          }`}
        />
      </div>

      {/* PARAMÈTRES */}
      <div className="absolute top-3 right-5 z-30 group">
        <div className="transition hover:rotate-12 duration-300 cursor-pointer">
          <Settings
            className={`${
              darkMode ? 'text-purple-300' : 'text-pink-600'
            } hover:scale-110 transition`}
          />
        </div>

        {/* Menu flottant */}
        <div
          className={`absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-4 text-sm space-y-4 font-medium z-50 backdrop-blur-xl transition-all duration-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible
            ${darkMode ? 'bg-black/80 text-purple-200' : 'bg-white/90 text-pink-600'}`}
        >
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 hover:scale-105 transition-all"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Mode clair' : 'Mode sombre'}
          </button>

          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Info size={18} /> À propos
          </button>

          {/* Réseaux sociaux */}
          <div className="border-t pt-5 border-blue space-y-4">
            <ul className="space-y-5">
              {[
                { name: 'Gmail', url: 'https://gmail.com', icon: <Mail size={18} /> },
                { name: 'Twitter', url: 'https://twitter.com', icon: <Twitter size={18} /> },
                { name: 'Facebook', url: 'https://facebook.com', icon: <Facebook size={18} /> },
                { name: 'LinkedIn', url: 'https://linkedin.com', icon: <Linkedin size={18} /> },
              ].map(({ name, url, icon }) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={name}
                    className="flex items-center gap-2 hover:scale-105 transition"
                  >
                    <span className={darkMode ? 'text-purple-200' : 'text-pink-600'}>
                      {icon}
                    </span>
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-6xl md:h-[470px] rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)] flex flex-col md:flex-row backdrop-blur-md border border-white/30 animate-fade-in-up">
        {/* Logo */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-10 text-center">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-20 mb-4 drop-shadow-2xl hover:animate-bounce"
          />
          <h1
            className={`text-4xl font-extrabold tracking-tight animate-fade-in ${
              darkMode ? 'text-white' : 'text-pink-600'
            }`}
          >
            Merix Studio
          </h1>
        </div>

        {/* Formulaire */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
          <form
            className={`w-full max-w-sm space-y-6 p-6 md:p-10 rounded-[1.5rem] shadow-2xl transition-all duration-700 transform hover:scale-[1.015] ${
              darkMode
                ? 'bg-[#18042c]/90 border border-purple-600'
                : 'bg-white/95 backdrop-blur-xl border border-pink-100'
            }`}
          >
            <h2 className={`${darkMode ? 'text-white' : 'text-pink-600'}`}>Authentification</h2>

            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-full border shadow-inner ${
                darkMode
                  ? 'border-purple-500 bg-white/5 text-white focus-within:border-purple-300'
                  : 'border-pink-300 bg-white text-black focus-within:border-pink-500'
              }`}
            >
              <input
                type="email"
                placeholder="Adresse email"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
              />
            </div>

            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-full border shadow-inner ${
                darkMode
                  ? 'border-purple-500 bg-white/5 text-white focus-within:border-purple-300'
                  : 'border-pink-300 bg-white text-black focus-within:border-pink-500'
              }`}
            >
              <input
                type="password"
                placeholder="Mot de passe"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 font-semibold rounded-full transition duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-[#6a00f4] to-[#a100f2] text-white shadow-[0_0_20px_#a855f7aa] hover:shadow-[0_0_30px_#a855f7ee]'
                  : 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-[0_0_20px_#f9a8d4] hover:shadow-[0_0_30px_#ec4899]'
              }`}
            >
              <Music size={18} /> Se connecter
            </button>
          </form>
        </div>
      </div>

      {/* Animation musicale */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${(i % 10) * 0.1}s` }}
            className="animate-[bounce_1s_infinite]"
          >
            <Music size={20} className={`${darkMode ? 'text-purple-300' : 'text-pink-500'}`} />
          </div>
        ))}
      </div>

      {/* Modal À propos */}
      {showAbout && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
    <div
      className={`max-w-3xl w-full p-8 rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] ${
        darkMode ? 'bg-[#1f0036] text-purple-100' : 'bg-white text-black'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Info size={20} /> À propos de l'application
        </h2>
        <button
          onClick={() => setShowAbout(false)}
          className="hover:text-red-500 text-sm font-bold"
        >
          ✕
        </button>
      </div>

      <p className="mb-3">
        Bienvenue dans notre application de gestion de studio d’enregistrement audio, une
        plateforme moderne et intuitive conçue pour simplifier la gestion des opérations d’un
        studio musical professionnel.
      </p>

      <hr className="border-t border-purple-300 my-4 opacity-50" />

      <p className="mb-3">
        Cette application a été pensée pour répondre aux besoins des maisons de production,
        studios indépendants et artistes qui souhaitent centraliser la gestion de leurs
        activités dans une interface fluide, accessible et performante.
      </p>

      <hr className="border-t border-purple-300 my-4 opacity-50" />

      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg">Fonctionnalités et technologies</h3>
        <ul className="space-y-3">
          {[
            { label: "Gestion des clients", description: "Ajout, recherche, historique de projets." },
            { label: "Gestion des services", description: "Enregistrement, mise à jour et suppression." },
            { label: "Gestion des commandes", description: "Suivi des commandes avec états." },
            { label: "Facturation PDF", description: "Génération automatique et export de factures." },
            {
              label: "Technologies",
              description:
                "React, TypeScript, Tailwind CSS, Vite, Node.js, Express.js, MySQL.",
            },
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></span>
              <div>
                <span className="font-semibold">{item.label} :</span>{" "}
                <span>{item.description}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-t border-purple-300 my-4 opacity-50" />

      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Mail size={18} /> Contact
      </h3>
      <p className="mb-1">
        Email :{" "}
        <a
          href="mailto:luciarasoanirina8@gmail.com"
          className="hover:text-purple-600 hover:scale-110 "
        >
          luciarasoanirina8@gmail.com
        </a>
      </p>
      <p >
        Téléphone : <span className="hover:text-purple-600 hover:scale-110 ">038 39 702 36 / 032 86 774 06</span>
      </p>
    </div>
  </div>
)}

    </div>
  );
};

export default App;
