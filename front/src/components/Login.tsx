import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <- Import axios
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
  Eye,
  EyeOff,
} from 'lucide-react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Schéma de validation avec Yup
const schema = yup.object({
  email: yup.string().email("Format d'email invalide").required('Adresse email requise'),
  password: yup.string().required('Mot de passe requis'),
}).required();

type FormData = yup.InferType<typeof schema>;

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  // Charger email enregistré
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setValue('email', savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const onSubmit = async (data: FormData) => {
    setServerError(null);
    if (rememberMe) {
      localStorage.setItem('rememberEmail', data.email);
    } else {
      localStorage.removeItem('rememberEmail');
    }

    try {
      // Envoi POST login au backend
      const response = await axios.post('http://localhost:5000/api/login', data);
      alert(response.data.message);

      // Stocker token JWT pour futures requêtes
      localStorage.setItem('token', response.data.token);

      // Redirection vers page d'accueil
      window.location.href = '/accueil'; // adapte selon ta route d'accueil
    } catch (error: any) {
      if (error.response) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Erreur de connexion au serveur");
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-700 relative overflow-hidden font-sans ${
        darkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      {/* Arrière-plan */}
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

      {/* Paramètres */}
      <div className="absolute top-3 right-5 z-30 group">
        <div className="transition hover:rotate-12 duration-300 cursor-pointer">
          <Settings
            className={`${
              darkMode ? 'text-purple-300' : 'text-pink-600'
            } hover:scale-110 transition`}
          />
        </div>
        <div
          className={`absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-4 text-sm space-y-4 font-medium z-50 backdrop-blur-xl transition-all duration-500 opacity-0 invisible group-hover:opacity-100 group-hover:visible ${
            darkMode ? 'bg-black/80 text-purple-200' : 'bg-white/90 text-pink-600'
          }`}
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
            onSubmit={handleSubmit(onSubmit)}
            className={`w-full max-w-sm space-y-6 p-6 md:p-10 rounded-[1.5rem] shadow-2xl transition-all duration-700 transform hover:scale-[1.015] ${
              darkMode
                ? 'bg-[#18042c]/90 border border-purple-600'
                : 'bg-white/95 backdrop-blur-xl border border-pink-100'
            }`}
          >
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-pink-600'}`}>
              Authentification
            </h2>

            {/* Email */}
            <div className="space-y-1">
              <input
                type="email"
                placeholder="Adresse email"
                {...register('email')}
                onInput={(e) => {
                  const input = e.currentTarget;
                  input.value = input.value.replace(/[^\w@.\-_]/gi, '');
                }}
                className={`w-full px-5 py-3 rounded-full border shadow-inner text-sm bg-transparent outline-none ${
                  darkMode
                    ? 'border-purple-500 text-white placeholder-gray-400'
                    : 'border-pink-300 text-black placeholder-gray-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1 relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                {...register('password')}
                className={`w-full px-5 py-3 pr-10 rounded-full border shadow-inner text-sm bg-transparent outline-none ${
                  darkMode
                    ? 'border-purple-500 text-white placeholder-gray-400'
                    : 'border-pink-300 text-black placeholder-gray-500'
                }`}
              />
              <div
                className="absolute top-2.5 right-4 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className={darkMode ? 'text-white' : 'text-pink-600'} />
                ) : (
                  <Eye size={18} className={darkMode ? 'text-white' : 'text-pink-600'} />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Se souvenir de moi
            </label>

            {/* Affichage erreur serveur */}
            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

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
              Bienvenue dans notre application de gestion de studio d’enregistrement audio.
            </p>
            <hr className="border-t border-purple-300 my-4 opacity-50" />
            <p className="mb-3">
              Cette application est conçue pour centraliser la gestion des activités d’un studio musical.
            </p>
            <hr className="border-t border-purple-300 my-4 opacity-50" />
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-lg">Fonctionnalités</h3>
              <ul className="space-y-3">
                <li>• Gestion des clients, services, commandes</li>
                <li>• Facturation PDF</li>
                <li>• Interface moderne et responsive</li>
              </ul>
            </div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Mail size={18} /> Contact
            </h3>
            <p className="mb-1">
              Email :{' '}
              <a
                href="mailto:luciarasoanirina8@gmail.com"
                className="hover:text-purple-600 hover:scale-110"
              >
                luciarasoanirina8@gmail.com
              </a>
            </p>
            <p>
              Téléphone :{' '}
              <span className="hover:text-purple-600">038 39 702 36 / 032 86 774 06</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
