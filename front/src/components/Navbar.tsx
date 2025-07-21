import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Home, Users, Music, Package,
  LogOut, Menu, X, Settings, FileText,
} from 'lucide-react';
import { useDarkMode } from "../context/DarkModeContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useDarkMode();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkStyle =
    "relative flex items-center gap-2 text-sm hover:text-[#f472b6] hover:scale-110 transition-all duration-200 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#f472b6] hover:after:w-full after:transition-all after:duration-300";

  const handleLogout = () => {
    const confirmed = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmed) {
      toggleMenu();
      window.location.href = "/";
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 shadow-lg border-b transition-colors duration-300
      ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-white border-purple-800"
          : "bg-gradient-to-r from-[#fceff9] via-[#fdf6ff] to-[#e6e6ff] text-black border-pink-200/50"
      }`}
    >
      <div className="w-full flex justify-between items-center px-5 py-4">
        <Link
          to="/"
          className={`flex items-center gap-3 text-2xl font-bold tracking-wider transition-transform duration-200 hover:scale-105 ${
            darkMode ? "text-purple-300" : "text-[#ec4899]"
          }`}
        >
          <img src="/logo.png" alt="Logo" className="w-11 h-9" />
          Merix Studio
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden min-[1200px]:flex items-center gap-10 font-medium text-sm">
          <li><Link to="/accueil" className={linkStyle}><Home size={18} /> Accueil</Link></li>
          <li><Link to="/clients" className={linkStyle}><Users size={18} /> Clients</Link></li>
          <li><Link to="/services" className={linkStyle}><Music size={18} /> Services</Link></li>
          <li><Link to="/commandes" className={linkStyle}><Package size={18} /> Commandes</Link></li>
          <li><Link to="/lignes-commandes" className={linkStyle}><FileText size={18} /> Lignes de commande</Link></li>
          <li><Link to="/parametres" className={linkStyle}><Settings size={18} /> Paramètres</Link></li>
          <li>
            <button onClick={handleLogout} className={linkStyle}>
              <LogOut size={18} /> Déconnexion
            </button>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleMenu}
          className={`min-[1200px]:hidden focus:outline-none transition-transform duration-200 ${
            darkMode ? "text-purple-300 hover:text-purple-500" : "hover:text-[#f472b6]"
          }`}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 z-50 w-2/3 max-w-sm h-full shadow-2xl transform transition-transform duration-300 ease-in-out
        ${
          darkMode
            ? "bg-gradient-to-br from-[#1a0536] via-[#3b0070] to-[#520099] text-white"
            : "bg-gradient-to-br from-[#fceff9] via-[#fdf6ff] to-[#e6e6ff] text-black"
        }
        ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="flex justify-between items-center p-5 border-b border-opacity-20 border-white/30">
          <span className={`text-base font-bold ${darkMode ? "text-purple-300" : "text-[#ec4899]"}`}>
            Menu
          </span>
          <button
            onClick={toggleMenu}
            className={`${darkMode ? "text-purple-300 hover:text-purple-500" : "text-black hover:text-[#f472b6]"}`}
          >
            <X size={30} />
          </button>
        </div>

        <div className="p-5 space-y-5 font-normal text-sm">
          <Link to="/accueil" onClick={toggleMenu} className={linkStyle}><Home size={20} /> Accueil</Link>
          <Link to="/clients" onClick={toggleMenu} className={linkStyle}><Users size={20} /> Clients</Link>
          <Link to="/services" onClick={toggleMenu} className={linkStyle}><Music size={20} /> Services</Link>
          <Link to="/commandes" onClick={toggleMenu} className={linkStyle}><Package size={20} /> Commandes</Link>
          <Link to="/lignes-commandes" onClick={toggleMenu} className={linkStyle}><FileText size={20} /> Lignes de commande</Link>
          <hr className={`mx-auto border-b ${darkMode ? "border-purple-500" : "border-black/10"}`} />
          <Link to="/parametres" onClick={toggleMenu} className={linkStyle}><Settings size={20} /> Paramètres</Link>
          <button onClick={handleLogout} className={linkStyle}><LogOut size={20} /> Déconnexion</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
