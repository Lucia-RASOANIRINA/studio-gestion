import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Building2,
  Landmark,
  ShieldCheck,
  BookText,
  Music2,
  Info,
  Lock,
  Shield,
  Settings,
  Bell,
  Clock,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeContext";

type StudioData = {
  nom: string;
  Adresse: string;
  Ville: string;
  Code_Postale: number;
  Contact: string;
  Nif: number;
  Stat: number;
  Responsable: string;
  Logo?: string;
};

const About = () => {
  const [studio, setStudio] = useState<StudioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profil");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [connexions, setConnexions] = useState<
  { date_connexion: string; ip: string; device: string; location: string, success: string, nom_utilisateurs: string }[]
>([]);

  const tabs = [
    { id: "profil", label: "Informations personnelles", icon: <Info /> },
    { id: "motdepasse", label: "Mot de passe", icon: <Lock /> },
    { id: "securite", label: "Sécurité ", icon: <Shield /> },
    { id: "preferences", label: "Préférences", icon: <Settings /> },
    { id: "notifications", label: "Notifications (à venir)", icon: <Bell /> },
    { id: "historique", label: "Historique (à faire)", icon: <Clock /> },
  ];
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/studio")
      .then((res) => {
        setStudio({
          nom: "Merix Studio",
          Adresse: res.data.Adresse,
          Ville: res.data.Ville,
          Code_Postale: res.data.Code_Postale,
          Contact: res.data.Contact,
          Nif: res.data.Nif,
          Stat: res.data.Stat,
          Responsable: res.data.Responsable,
          Logo: "/logo.png",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement des données studio :", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
  if (activeTab === "securite") {
    const fetchConnexions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/connexions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConnexions(res.data);
      } catch (err) {
        console.error("Erreur chargement connexions :", err);
      }
    };
    fetchConnexions();
  }
}, [activeTab]);

  const handlePasswordChange = async () => {
    if (!email) return setMessage("Veuillez entrer votre email.");
    if (newPassword !== confirmPassword) return setMessage("Les mots de passe ne correspondent pas.");

    try {
      const token = localStorage.getItem("token");
      if (!token) return setMessage("Utilisateur non authentifié.");

      const response = await axios.post(
        "http://localhost:5000/api/changerMotDePasse",
        { email, nouveau: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erreur lors du changement.");
    }
  };

  if (loading) return <div className="text-center pt-20">Chargement...</div>;
  if (!studio) return <div className="text-center pt-20 text-red-500">Erreur de chargement</div>;

  return (
    <div className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-300 ${darkMode ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-white" : "bg-white text-black"}`}>
      <div className="absolute inset-0 flex z-0">
        {darkMode ? (
          <>
            <div className="w-1/2 h-full bg-gradient-to-br from-[#1a0536] via-[#000] to-[#4a00e0] " />
            <div className="w-1/2 h-full bg-gradient-to-tr from-[#000] via-[#4a00e0] to-[#1a0536]" />
          </>
        ) : (
          <>
            <div className="w-1/2 h-full bg-gradient-to-br from-white via-[#fceff9] to-[#e6e6ff]" />
            <div className="w-1/2 h-full bg-gradient-to-tr from-[#fdf6ff] via-[#e6dbff] to-white" />
          </>
        )}
      </div>

      <Navbar />

      <div className="relative z-10 pt-24 px-6 w-full flex flex-row gap-6 justify-center mb-20 items-start">
        <aside
          className={`
            fixed top-[6rem] left-6 bottom-6
            w-20 md:w-64
            border-r
            flex flex-col gap-2 md:gap-4
            overflow-y-auto
            rounded-xl
            shadow-lg
            z-20
            backdrop-blur-md
            ${darkMode ? 'bg-gradient-to-r from-[#1a0536] via-[#000]  border-[#4a00e0]text-white' : 'bg-white/90 border-gray-300 text-gray-800'}
          `}
          style={{ scrollbarWidth: "thin" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative
                w-full
                flex items-center
                justify-center md:justify-start
                gap-2
                rounded-lg
                px-4 py-2
                text-sm
                transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? darkMode
                      ? "bg-transparent text-white border border-gray-700 shadow-lg"
                      : "bg-pink-100 text-pink-600 border border-pink-200 shadow"
                    : darkMode
                    ? "text-gray-300 hover:bg-[#2e1263] hover:text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-pink-500"
                }
              `}
              title={tab.label}
            >
              {tab.icon}
              <span className="hidden md:inline">{tab.label}</span>

              {activeTab === tab.id && (
                <>
                  <span
                    className={`
                      absolute left-0 top-0 h-full w-1
                      ${
                        darkMode
                          ? "bg-gradient-to-b from-pink-500 via-fuchsia-500 to-pink-600"
                          : "bg-pink-500"
                      }
                      rounded-tr-md rounded-br-md
                    `}
                  />
                  <span
                    className={`
                      absolute bottom-0 left-0 w-full h-[3px]
                      ${
                        darkMode
                          ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-pink-600"
                          : "bg-pink-500"
                      }
                      rounded-bl-md rounded-br-md
                    `}
                  />
                </>
              )}
            </button>
          ))}
        </aside>

        <main className="flex-1 max-w-4xl ml-20 md:ml-72">
                    {activeTab === "profil" && (
                      <div
                        className={`backdrop-blur-md border shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 ${
                          darkMode
                            ? "bg-gradient-to-r from-[#4a00e0] via-[#1a0536] border-[#000] text-white"
                            : "bg-white/90 border-pink-200"
                        }`}
                      >
                        <div className="md:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
                          <img
                            src={studio.Logo}
                            alt="Logo du studio"
                            className="w-24 h-24 object-contain"
                          />
                          <h1
                            className={`text-3xl font-extrabold ${
                              darkMode ? "text-pink-400" : "text-pink-600"
                            }`}
                          >
                            {studio.nom}
                          </h1>
                          <p
                            className={`text-lg font-semibold italic ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Responsable
                          </p>
                          <p
                            className={`text-xl font-medium ${
                              darkMode ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {studio.Responsable}
                          </p>
                        </div>
                        <div
                          className={`md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm ${
                            darkMode ? "text-gray-200" : "text-gray-800"
                          }`}
                        >
                          <InfoItem
                            icon={
                              <MapPin className={darkMode ? "text-pink-300" : "text-pink-400"} />
                            }
                            label="Adresse"
                            value={studio.Adresse}
                            darkMode={darkMode}
                          />
                          <InfoItem
                            icon={
                              <Landmark className={darkMode ? "text-pink-300" : "text-pink-400"} />
                            }
                            label="Ville"
                            value={studio.Ville}
                            darkMode={darkMode}
                          />
                          <InfoItem
                            icon={
                              <Building2 className={darkMode ? "text-pink-300" : "text-pink-400"} />
                            }
                            label="Code Postal"
                            value={studio.Code_Postale}
                            darkMode={darkMode}
                          />
                          <InfoItem
                            icon={
                              <Phone className={darkMode ? "text-pink-300" : "text-pink-400"} />
                            }
                            label="Contact"
                            value={studio.Contact}
                            darkMode={darkMode}
                          />
                          <InfoItem
                            icon={
                              <ShieldCheck
                                className={darkMode ? "text-pink-300" : "text-pink-400"}
                              />
                            }
                            label="NIF"
                            value={studio.Nif}
                            darkMode={darkMode}
                          />
                          <InfoItem
                            icon={
                              <BookText className={darkMode ? "text-pink-300" : "text-pink-400"} />
                            }
                            label="STAT"
                            value={studio.Stat}
                            darkMode={darkMode}
                          />
                        </div>
                      </div>
                    )}
          {activeTab === "motdepasse" && (
            <div className={`shadow-xl rounded-2xl px-6 py-8 space-y-4 w-full max-w-md mx-auto
                            ${
                            darkMode
                            ? "bg-gradient-to-r from-[#4a00e0] via-[#1a0536] border-[#000] text-white"
                            : "bg-white/90 border-pink-200"
                        }`}>
              <h2 className={`text-xl font-bold text-center ${darkMode ? "text-white" : "text-gray-800"}`}>
                Changer le mot de passe
              </h2>

              <input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode ? "text-white bg-[#1f0536] border border-[#1a0536]" : "text-gray-800 border border-gray-300 "
                }`}
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full p-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode ? "text-white bg-[#1f0536] border border-[#1a0536]" : "text-gray-800 border border-gray-300 "
                }`}
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  darkMode ? "text-white bg-[#1f0536] border border-[#1a0536]" : "text-gray-800 border border-gray-300 "
                }`}
              />

              {message && <p className="text-center text-sm text-red-500">{message}</p>}

              <button
                onClick={handlePasswordChange}
                className={`w-full group flex items-center justify-center gap-2 border-y-2 border-l-4 border-r-4 
                            py-2.5 px-4 rounded-md font-semibold relative overflow-hidden transition-all duration-300 ease-in-out
                            ${darkMode 
                              ? "border-l-purple-400 border-r-pink-500 border-t-transparent border-b-transparent text-purple-200 hover:border-l-purple-200 hover:border-r-pink-400 hover:text-white"
                              : "border-l-purple-600 border-r-pink-500 border-t-transparent border-b-transparent text-purple-700 hover:border-l-purple-700 hover:border-r-pink-600 hover:text-purple-900"
                            }`}
              >
                <CheckCircle 
                  size={18} 
                  className={`transition-colors duration-300 
                              ${darkMode ? "text-purple-300 group-hover:text-white" : "text-purple-700 group-hover:text-purple-900"}`}
                />
                <span
                  className={`relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 
                              after:transition-all after:duration-300 
                              group-hover:after:w-full 
                              ${darkMode ? "after:bg-purple-400" : "after:bg-purple-600"}`}
                >
                  Confirmer
                </span>
              </button>

            </div>
          )}

          {activeTab === "securite" && (
            <div
              className={`border shadow-xl rounded-2xl px-4 py-6 max-w-full overflow-x-auto ${
                darkMode
                  ? "bg-gradient-to-r from-[#4a00e0] via-[#1a0536] border-[#000] text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-6 text-center ${
                  darkMode ? "text-purple-400" : "text-pink-600"
                }`}
              >
                Liste de connexion
              </h2>

              {connexions.length === 0 ? (
                <p
                  className={`${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  } italic text-center text-sm`}
                >
                  Aucune connexion trouvée.
                </p>
              ) : (
                <>
                  {/* Table desktop */}
                  <div
                    className={`hidden min-[1125px]:block rounded-xl border shadow-sm w-full ${
                      darkMode ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <table className="w-full text-xs border-collapse table-auto">
                      <thead
                        className={`uppercase tracking-wide text-[11px] ${
                          darkMode
                            ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-white"
                            : "bg-gradient-to-r from-pink-200 to-purple-200 text-gray-800"
                        }`}
                      >
                        <tr>
                          {[
                            "Utilisateur",
                            "Date",
                            "Heure",
                            "IP",
                            "Localisation",
                            "Appareil",
                            "Succès",
                          ].map((title) => (
                            <th
                              key={title}
                              className={`px-2 py-2 text-left font-semibold select-none border-b break-words ${
                                darkMode ? "border-gray-600" : "border-gray-300"
                              }`}
                            >
                              {title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {connexions.map((c, idx) => {
                          const dateObj = new Date(c.date_connexion);
                          const rowBg =
                            darkMode && idx % 2 !== 0
                              ? "bg-[#2e1263]"
                              : !darkMode && idx % 2 !== 0
                              ? "bg-gray-50"
                              : "";

                          return (
                            <tr
                              key={idx}
                              className={`${rowBg} hover:bg-opacity-80 transition-colors cursor-pointer`}
                            >
                              <td className="px-2 py-1 border-b break-words max-w-[130px]">
                                {c.nom_utilisateurs?.trim() || "Inconnu"}
                              </td>
                              <td className="px-2 py-1 border-b whitespace-nowrap">
                                {dateObj.toLocaleDateString()}
                              </td>
                              <td className="px-2 py-1 border-b whitespace-nowrap">
                                {dateObj.toLocaleTimeString()}
                              </td>
                              <td className="px-2 py-1 border-b font-mono text-purple-500 break-words max-w-[100px]">
                                {c.ip}
                              </td>
                              <td className="px-2 py-1 border-b break-words max-w-[130px]">
                                {c.location || "Inconnue"}
                              </td>
                              <td className="px-2 py-1 border-b break-words max-w-[130px]">
                                {c.device}
                              </td>
                              <td className="px-2 py-1 border-b text-center">
                                {c.success ? (
                                  <span className="text-green-500 font-semibold">✓</span>
                                ) : (
                                  <span className="text-red-500 font-semibold">✗</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className={`min-[1125px]:hidden mt-4 space-y-3`}>
                    {connexions.map((c, idx) => {
                      const dateObj = new Date(c.date_connexion);
                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl shadow-md text-sm ${
                            darkMode
                              ? "bg-[#1a0536] text-purple-200 border border-[#311265]"
                              : "bg-white text-black border border-gray-200"
                          }`}
                        >
                          <p>
                            <strong>Utilisateur:</strong>{" "}
                            {c.nom_utilisateurs?.trim() || "Inconnu"}
                          </p>
                          <p>
                            <strong>Date:</strong> {dateObj.toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Heure:</strong> {dateObj.toLocaleTimeString()}
                          </p>
                          <p>
                            <strong>IP:</strong>{" "}
                            <code className="font-mono">{c.ip}</code>
                          </p>
                          <p>
                            <strong>Localisation:</strong>{" "}
                            {c.location || "Inconnue"}
                          </p>
                          <p>
                            <strong>Appareil:</strong> {c.device}
                          </p>
                          <p>
                            <strong>Succès:</strong>{" "}
                            {c.success ? (
                              <span className="text-green-500 font-semibold">✓</span>
                            ) : (
                              <span className="text-red-500 font-semibold">✗</span>
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === "preferences" && (
            <div
            className={`${
              darkMode
                ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-white"
                : "bg-white text-black"
            }`}
          >
            <div
              className={`rounded-2xl p-8 border shadow-lg ${
                darkMode
                  ? "border-gray-700"
                  : "border-gray-300"
              }`}
            >
              <h2 className="text-xl font-bold mb-4">Préférences</h2>
              <div className="space-y-4">
                <div>
                  <label
                    className={`block font-medium mb-1 ${
                      darkMode ? "text-white" : "text-gray-700"
                    }`}
                  >
                    Thème :
                  </label>
                  <select
                    className={`w-full border rounded-lg p-2 ${
                      darkMode
                        ? "bg-[#1a0536] border-gray-600 text-white"
                        : "bg-white border-gray-300 text-black"
                    }`}
                    value={darkMode ? "sombre" : "clair"}
                    onChange={(e) => {
                      if (e.target.value === "sombre") {
                        if (!darkMode) toggleDarkMode();
                      } else {
                        if (darkMode) toggleDarkMode();
                      }
                    }}
                  >
                    <option value="clair">Clair</option>
                    <option value="sombre">Sombre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          )}

          {activeTab === "notifications" && (
            <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
              <p className="text-gray-500 italic">
                Fonctionnalité à venir : alertes email, SMS, préférences de notification...
              </p>
            </div>
          )}

          {activeTab === "historique" && (
            <div className="bg-white border border-gray-300 shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-4">Historique</h2>
              <p className="text-gray-500 italic">Aucune activité récente trouvée.</p>
            </div>
          )}
        </main>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        {[...Array(12)].map((_, i) => (
          <Music2
            key={i}
            size={22}
            className="text-pink-500 opacity-80 animate-bounce"
            style={{ animationDelay: `${(i % 6) * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
};

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  darkMode?: boolean; 
};

const InfoItem = ({ icon, label, value, darkMode = false }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className={`font-semibold ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{label}</p>
      <p className={`${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
    </div>
  </div>
);

export default About;
