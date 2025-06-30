import React, { useState } from 'react';
import { Settings, Moon, Sun, Info } from 'lucide-react';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-700 relative overflow-hidden font-sans ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}
    >
      {/* Background diagonal animated gradient */}
      <div className="absolute inset-0 flex z-0 animate-gradient-fade">
        <div className={`w-1/2 h-full ${darkMode ? 'bg-gradient-to-br from-[#0e0e0e] via-[#1a0030] to-[#260044]' : 'bg-gradient-to-br from-white via-[#fceff9] to-[#e6e6ff]'}`} />
        <div className={`w-1/2 h-full ${darkMode ? 'bg-gradient-to-tr from-[#3d1b5a] via-[#4a00e0] to-[#000]' : 'bg-gradient-to-tr from-[#fdf6ff] via-[#e6dbff] to-white'}`} />
      </div>

      {/* PARAMÈTRES - Hover group */}
      <div className="absolute top-5 right-5 z-30 group">
        <div className="transition hover:rotate-12 duration-300 cursor-pointer">
          <Settings className={`${darkMode ? 'text-purple-300' : 'text-pink-600'} hover:scale-110 transition`} />
        </div>

        {/* Menu affiché au survol */}
        <div
          className={`absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-4 text-sm space-y-4 font-medium z-50 backdrop-blur-xl transition-all duration-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible
            ${darkMode
              ? 'bg-black/80 text-purple-200 '
              : 'bg-white/90 text-sm-600 '
            }`}
        >
          {/* Thème */}
          <button onClick={toggleTheme} className="flex items-center gap-2 hover:scale-105 transition-all">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Mode clair' : 'Mode sombre'}
          </button>

          {/* À propos */}
          <a href="#" className="flex items-center gap-2 hover:scale-105 transition-all">
            <Info size={18} /> À propos
          </a>

          {/* Réseaux sociaux */}
          <div className="border-t pt-5 border-sm-500/30 space-y-4">
            <ul className="space-y-5">
              <li>
                <a
                  href="https://gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Gmail"
                  className="flex items-center gap-2 hover:scale-105 transition"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/gmail-new.png"
                    alt="Gmail"
                    className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`}
                  />
                  <span>Gmail</span>
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Twitter"
                  className="flex items-center gap-2 hover:scale-105 transition"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/twitter--v1.png"
                    alt="Twitter"
                    className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`}
                  />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="flex items-center gap-2 hover:scale-105 transition"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/facebook-new.png"
                    alt="Facebook"
                    className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`}
                  />
                  <span>Facebook</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                  className="flex items-center gap-2 hover:scale-105 transition"
                >
                  <img
                    src="https://img.icons8.com/color/48/000000/linkedin.png"
                    alt="LinkedIn"
                    className={`w-5 h-5 ${darkMode ? 'filter invert' : ''}`}
                  />
                  <span>LinkedIn</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Le contenu principal*/}
      <div className="relative z-10 w-full max-w-6xl h-[550px] md:h-[470px] rounded-[2rem] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)] flex backdrop-blur-md border border-white/30 animate-fade-in-up">
        {/* Left side; contenant le logo du studio*/}
        <div className="w-1/2 flex flex-col justify-center items-center p-10">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-20 mb-4 drop-shadow-2xl animate-bounce"
          />
          <h1
            className={`text-4xl font-extrabold tracking-tight animate-fade-in ${darkMode ? 'text-white' : 'text-pink-600'}`}
          >
            Merix Studio
          </h1>
          
        </div>

        {/* Right side - Formulaire de connexion*/}
        <div className="w-1/2 flex items-center justify-center p-10">
          <form
            className={`w-full max-w-sm space-y-6 p-10 rounded-[1.5rem] shadow-2xl transition-all duration-700 transform hover:scale-[1.015] ${darkMode ? 'bg-[#18042c]/90 border border-purple-600' : 'bg-white/95 backdrop-blur-xl border border-pink-100'}`}
          >
            <h2
              className={`text-2xl font-bold text-center tracking-wide animate-fade-in ${darkMode ? 'text-white' : 'text-pink-600'}`}
            >
              Authentification
            </h2>

            {/* Insértion Email */}
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 border shadow-inner ${
                darkMode
                  ? 'border-purple-500 bg-white/5 text-white focus-within:shadow-[0_0_15px_#a855f799] focus-within:border-purple-300'
                  : 'border-pink-300 bg-white text-black focus-within:shadow-[0_0_12px_#f472b6] focus-within:border-pink-500'
              }`}
            >
              <input
                type="email"
                placeholder="Adresse email"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
              />
            </div>

            {/* Insértion Password */}
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 border shadow-inner ${
                darkMode
                  ? 'border-purple-500 bg-white/5 text-white focus-within:shadow-[0_0_15px_#a855f799] focus-within:border-purple-300'
                  : 'border-pink-300 bg-white text-black focus-within:shadow-[0_0_12px_#f472b6] focus-within:border-pink-500'
              }`}
            >
              <input
                type="password"
                placeholder="Mot de passe"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-gray-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className={`w-full py-2 font-semibold rounded-full transition duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 ${
                darkMode
                  ? 'bg-gradient-to-r from-[#6a00f4] to-[#a100f2] text-white shadow-[0_0_20px_#a855f7aa] hover:shadow-[0_0_30px_#a855f7ee]'
                  : 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-[0_0_20px_#f9a8d4] hover:shadow-[0_0_30px_#ec4899]'
              }`}
            >
              🎧 Se connecter
            </button>
          </form>
        </div>
      </div>

      {/* Audio bar visual */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-1 z-20 ">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`w-1 h-5 rounded-full animate-bounce bg-gradient-to-t ${darkMode ? 'from-purple-600 to-purple-300' : 'from-pink-400 to-pink-200'} animate-delay-${i % 5}`}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
