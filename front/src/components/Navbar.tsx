import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Home,  Users,  Music,  Package,  Info,  LogOut,  Menu,  X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
//   design des liens de navigation
  const linkStyle =
    "relative flex items-center gap-2 text-sm text-sm hover:text-[#f472b6] hover:scale-110 transition-all duration-200 after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-0 after:bg-[#f472b6] hover:after:w-full after:transition-all after:duration-300";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#fceff9] via-[#fdf6ff] to-[#e6e6ff] text-black shadow-lg border-b border-pink-200/50">
      <div className="container mx-auto flex justify-between items-center px-5 py-4">

        {/* Logo avec Le Mot Merix Studio*/}
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold tracking-wider text-[#ec4899] hover:scale-105 transition-transform duration-200"
        >
          <img src="/logo.png" alt="Logo" className="w-11 h-9" />
          Merix Studio
        </Link>

        {/* Desktop Menu ; le navbar */}
        <ul className="hidden md:flex items-center gap-10 font-medium text-sm">
          <li><Link to="/accueil" className={linkStyle}><Home size={18} /> Accueil</Link></li>
          <li><Link to="/clients" className={linkStyle}><Users size={18} /> Clients</Link></li>
          <li><Link to="/services" className={linkStyle}><Music size={18} /> Services</Link></li>
          <li><Link to="/commandes" className={linkStyle}><Package size={18} /> Commandes</Link></li>
          <li><Link to="/about" className={linkStyle}><Info size={18} /> À propos</Link></li>
          <li>
            <button
                onClick={() => {
                    toggleMenu();
                    const confirmed = window.confirm("Voulez-vous vraiment vous déconnecter ?");
                    if (confirmed) {
                    // Par exemple, rediriger vers la page de login
                    window.location.href = "/"; // ou la page que tu veux ouvrir
                    }
                }}
                className={linkStyle}
                >
                <LogOut size={18} /> Déconnexion
            </button>
          </li>
        </ul>

        {/* Mobile Toggle Button; menu humbarger*/}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none hover:text-[#f472b6] transition-transform duration-200"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Drawer ; transaction entre le menu et x*/}
      <div
        className={`fixed top-0 right-0 w-2/5 max-w-xs h-full bg-gradient-to-br from-[#fceff9] via-[#fdf6ff] to-[#e6e6ff] text-black shadow-2xl transform transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-black/10"> 
          <span className="text-base font-bold text-[#ec4899]">Menu</span>
          <button onClick={toggleMenu} className="text-black hover:text-[#f472b6]">
            <X size={30} />
          </button>
        </div>
{/* listes des liens */}
        <div className="p-5 space-y-5 font-normal text-xs">
          <Link to="/accueil" onClick={toggleMenu} className={linkStyle}><Home size={20} /> Accueil</Link>
          <Link to="/clients" onClick={toggleMenu} className={linkStyle}><Users size={20} /> Clients</Link>
          <Link to="/services" onClick={toggleMenu} className={linkStyle}><Music size={20} /> Services</Link>
          <Link to="/commandes" onClick={toggleMenu} className={linkStyle}><Package size={20} /> Commandes</Link>
          <hr className="mx-auto border-b border-black/10 " />
          <Link to="/about" onClick={toggleMenu} className={linkStyle}><Info size={18} /> À propos</Link>
          {/* déconnexion; affichage d'un message de confirmation */}
          <button
            onClick={() => {
                toggleMenu();
                const confirmed = window.confirm("Voulez-vous vraiment vous déconnecter ?");
                if (confirmed) {
                // Par exemple, rediriger vers la page de login
                window.location.href = "/"; // ou la page que tu veux ouvrir
                }
            }}
            className={linkStyle}
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
