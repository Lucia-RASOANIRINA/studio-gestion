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
  PackageCheck,
  Truck,
  CalendarDays,
  Search,
  Wrench,
  BellOff,
  UploadCloud,
  CalendarCheck
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useDarkMode } from "../context/DarkModeContext";

function HistoriqueAvecFiltre({
  commandes,
  darkMode,
}: {
  commandes: any[];
  darkMode: boolean;
}) {
  const [selectedFilter, setSelectedFilter] = useState("Commandes du jour");
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      key: "Commandes réalisées",
      title: "Commandes réalisées",
      icon: <CheckCircle className="text-green-500 w-5 h-5 mr-2" />,
      color: "text-green-500",
      filter: (c: any) => c.dateRealisation && new Date(c.dateRealisation) < new Date(),
      dateKey: (c: any) => new Date(c.dateRealisation),
      label: (c: any) =>
        `Commande #${c.id} - Réalisée le ${new Date(c.dateRealisation!).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
    },
    {
      key: "Commandes livrées",
      title: "Commandes livrées",
      icon: <PackageCheck className="text-blue-500 w-5 h-5 mr-2" />,
      color: "text-blue-500",
      filter: (c: any) => c.dateLivraison && new Date(c.dateLivraison) < new Date(),
      dateKey: (c: any) => new Date(c.dateLivraison),
      label: (c: any) =>
        `Commande #${c.id} - Livrée le ${new Date(c.dateLivraison!).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
    },
    {
      key: "Commandes à réaliser",
      title: "Commandes à réaliser",
      icon: <Clock className="text-orange-500 w-5 h-5 mr-2" />,
      color: "text-orange-500",
      filter: (c: any) => c.dateRealisation && new Date(c.dateRealisation) > new Date(),
      dateKey: (c: any) => new Date(c.dateRealisation),
      label: (c: any) =>
        `Commande #${c.id} - À réaliser le ${new Date(c.dateRealisation!).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
    },
    {
      key: "Commandes à livrer",
      title: "Commandes à livrer",
      icon: <Truck className="text-purple-500 w-5 h-5 mr-2" />,
      color: "text-purple-500",
      filter: (c: any) => c.dateLivraison && new Date(c.dateLivraison) > new Date(),
      dateKey: (c: any) => new Date(c.dateLivraison),
      label: (c: any) =>
        `Commande #${c.id} - À livrer le ${new Date(c.dateLivraison!).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`,
    },
    {
      key: "Commandes du jour",
      title: "Commandes du jour",
      icon: <CalendarDays className="text-rose-500 w-5 h-5 mr-2" />,
      color: "text-rose-500",
      filter: (c: any) =>
        (c.dateRealisation && new Date(c.dateRealisation).toDateString() === new Date().toDateString()) ||
        (c.dateLivraison && new Date(c.dateLivraison).toDateString() === new Date().toDateString()),
      dateKey: () => new Date(),
      label: (c: any) => {
        const isRealToday = c.dateRealisation && new Date(c.dateRealisation).toDateString() === new Date().toDateString();
        const isLivToday = c.dateLivraison && new Date(c.dateLivraison).toDateString() === new Date().toDateString();
        return (
          `Commande #${c.id}` +
          (isRealToday ? " - Réalisation aujourd'hui" : "") +
          (isLivToday ? " - Livraison aujourd'hui" : "")
        );
      },
    },
  ];

  const currentSection = sections.find((s) => s.title === selectedFilter)!;

  const moisFr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  const filtered = commandes
    .filter(currentSection.filter)
    .filter((c) => {
      const label = currentSection.label(c).toLowerCase();
      const date = currentSection.dateKey(c);
      const moisLettre = moisFr[date.getMonth()];
      const annee = date.getFullYear().toString();
      const moisNum = (date.getMonth() + 1).toString().padStart(2, "0");
      return (
        label.includes(searchTerm.toLowerCase()) ||
        moisLettre.includes(searchTerm.toLowerCase()) ||
        annee.includes(searchTerm) ||
        moisNum.includes(searchTerm)
      );
    });

  const groupedByMonth: { [key: string]: any[] } = {};
  filtered.forEach((c) => {
    const d = currentSection.dateKey(c);
    const key = `${d.toLocaleString("fr-FR", { month: "long" })} ${d.getFullYear()}`;
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(c);
  });

  return (
    <div
      className={`rounded-3xl p-8 space-y-8 transition-all duration-300 border shadow-2xl ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border-gray-700 text-gray-100"
          : "bg-gradient-to-br from-white via-gray-50 to-gray-100 border-gray-200 text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-extrabold mb-4">
Historique des commandes</h2>

      {/* Mini-navbar */}
      <nav className="flex flex-wrap gap-3 mb-6">
        {sections.map(({ title, icon, color }) => (
          <button
            key={title}
            onClick={() => setSelectedFilter(title)}
            className={`flex items-center px-4 py-2 rounded-full border font-medium text-sm transition shadow-sm ${
              selectedFilter === title
                ? `${color} bg-opacity-10 border-current`
                : darkMode
                ? "text-gray-300 border-gray-600 hover:bg-[#2d2d44]"
                : "text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {icon}
            {title}
          </button>
        ))}
      </nav>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        <input
          type="text"
          placeholder="Rechercher une commande, un mois, une année..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`pl-10 pr-4 py-2 w-full rounded-full shadow-sm transition border focus:outline-none focus:ring-2 ${
            darkMode
              ? "bg-[#1a0536] text-white placeholder-gray-400 border-gray-600 focus:ring-purple-400 focus:border-purple-500"
              : "bg-white text-black placeholder-gray-400 border-gray-300 focus:ring-blue-100 focus:border-blue-400"
          }`}
        />
      </div>

      {/* Résultats */}
      {Object.entries(groupedByMonth).length === 0 ? (
        <p className={`text-sm italic ml-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Aucune commande trouvée.</p>
      ) : (
        Object.entries(groupedByMonth).map(([month, entries]) => (
          <div
            key={month}
            className={`ml-2 mb-4 rounded-xl p-5 shadow-md border ${
              darkMode ? "bg-[#1a0536] border-gray-600" : "bg-white border-gray-200"
            }`}
          >
            <h4 className={`text-md font-bold mb-3 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{month}</h4>
            <ul className="space-y-2">
              {entries.map((c) => (
                <li
                  key={c.id}
                  className={`rounded-lg px-4 py-2 border transition ${
                    darkMode
                      ? "bg-[#1a0240] border-gray-700 text-gray-100 hover:bg-[#1a0536]"
                      : "bg-gray-50 border-gray-100 text-gray-700 hover:shadow-md"
                  }`}
                >
                  <span className="text-sm">{currentSection.label(c)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

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
const [commandes, setCommandes] = useState<
  { id: number; dateRealisation: string | null; dateLivraison: string | null }[]
>([]);


  const tabs = [
    { id: "profil", label: "Informations personnelles", icon: <Info /> },
    { id: "motdepasse", label: "Mot de passe", icon: <Lock /> },
    { id: "securite", label: "Sécurité ", icon: <Shield /> },
    { id: "preferences", label: "Préférences", icon: <Settings /> },
    { id: "notifications", label: "Notifications", icon: <Bell /> },
    { id: "historique", label: "Historique ", icon: <Clock /> },
  ];
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Chargement des commandes si l'onglet actif est "historique"
  useEffect(() => {
    if (activeTab === "historique") {
      axios
        .get("http://localhost:5000/api/commandes")
        .then((res) => {
          setCommandes(res.data);
        })
        .catch((err) => {
          console.error("Erreur chargement commandes :", err);
          setCommandes([]);
        });
    }
  }, [activeTab]);

const [showNotifications, setShowNotifications] = useState(false);

// Type des notifications
type Notification = {
  id: number;
  icon: React.ReactNode;
  message: string;
  isRead: boolean;
  date: string; // Date de création ou lecture
};

const [notifications, setNotifications] = useState<Notification[]>([]);

// Nettoyage des notifications lues de plus de 15 jours
const cleanOldReadNotifications = () => {
  const raw = localStorage.getItem("readNotifications");
  if (!raw) return {};

  const parsed: Record<number, { isRead: boolean; date: string }> = JSON.parse(raw);
  const now = new Date();

  const updated: Record<number, { isRead: boolean; date: string }> = {};

  for (const [id, entry] of Object.entries(parsed)) {
    const readDate = new Date(entry.date);
    const diffDays = (now.getTime() - readDate.getTime()) / (1000 * 3600 * 24);
    if (diffDays < 15) {
      updated[Number(id)] = entry;
    }
  }

  localStorage.setItem("readNotifications", JSON.stringify(updated));
  return updated;
};

// Marquer une notification comme lue
const markAsRead = (id: number) => {
  const updatedNotifications = notifications.map((notif) =>
    notif.id === id ? { ...notif, isRead: true } : notif
  );
  setNotifications(updatedNotifications);

  const stored = localStorage.getItem("readNotifications");
  const parsed = stored ? JSON.parse(stored) : {};

  parsed[id] = {
    isRead: true,
    date: new Date().toISOString(), // ← Date de lecture
  };

  localStorage.setItem("readNotifications", JSON.stringify(parsed));
};


useEffect(() => {
  if (activeTab === "notifications") {
    axios
      .get("http://localhost:5000/api/commandes")
      .then((res) => {
        const all = res.data;
        const today = new Date();
        const demain = new Date();
        demain.setDate(today.getDate() + 1);

        const estMemeJour = (a: Date, b: Date) => a.toDateString() === b.toDateString();

        const commandesAujourdhui = all.filter(
          (c: any) =>
            (c.dateRealisation && estMemeJour(new Date(c.dateRealisation), today)) ||
            (c.dateLivraison && estMemeJour(new Date(c.dateLivraison), today))
        );
        const commandesRealisationAujourdhui = all.filter(
          (c: any) => c.dateRealisation && estMemeJour(new Date(c.dateRealisation), today)
        );
        const commandesLivraisonAujourdhui = all.filter(
          (c: any) => c.dateLivraison && estMemeJour(new Date(c.dateLivraison), today)
        );
        const commandesRealisationDemain = all.filter(
          (c: any) => c.dateRealisation && estMemeJour(new Date(c.dateRealisation), demain)
        );
        const commandesLivraisonDemain = all.filter(
          (c: any) => c.dateLivraison && estMemeJour(new Date(c.dateLivraison), demain)
        );

        const readFromStorage = cleanOldReadNotifications();
        const baseDate = new Date().toISOString();

        const notifs: Notification[] = [];

        const pushNotif = (id: number, icon: React.ReactNode, message: string) => {
          const isRead = readFromStorage[id]?.isRead || false;
          const date = readFromStorage[id]?.date || baseDate;
          notifs.push({ id, icon, message, isRead, date });
        };

        if (commandesAujourdhui.length > 0) {
          pushNotif(
            1,
            <PackageCheck className="inline-block w-4 h-4 mr-2" />,
            `${commandesAujourdhui.length} commande(s) enregistrée(s) aujourd’hui`
          );
        }
        if (commandesRealisationAujourdhui.length > 0) {
          pushNotif(
            2,
            <Wrench className="inline-block w-4 h-4 mr-2" />,
            `${commandesRealisationAujourdhui.length} à réaliser aujourd’hui`
          );
        }
        if (commandesLivraisonAujourdhui.length > 0) {
          pushNotif(
            3,
            <Truck className="inline-block w-4 h-4 mr-2" />,
            `${commandesLivraisonAujourdhui.length} à livrer aujourd’hui`
          );
        }
        if (commandesRealisationDemain.length > 0) {
          pushNotif(
            4,
            <CalendarCheck className="inline-block w-4 h-4 mr-2" />,
            `${commandesRealisationDemain.length} à réaliser demain`
          );
        }
        if (commandesLivraisonDemain.length > 0) {
          pushNotif(
            5,
            <UploadCloud className="inline-block w-4 h-4 mr-2" />,
            `${commandesLivraisonDemain.length} à livrer demain`
          );
        }

        setNotifications(notifs);
      })
      .catch((err) => {
        console.error("Erreur chargement stats :", err);
      });
  }
}, [activeTab]);

// Historique des notifications
const HistoriqueNotifications = ({ darkMode }: { darkMode: boolean }) => {
  const [allNotifications, setAllNotifications] = useState<
    { id: number; isRead: boolean; date: string }[]
  >([]);

  useEffect(() => {
    const stored = localStorage.getItem("readNotifications");
    if (stored) {
      const parsed: Record<number, { isRead: boolean; date: string }> = JSON.parse(stored);
      const all = Object.entries(parsed).map(([id, val]) => ({
        id: Number(id),
        isRead: val.isRead,
        date: new Date(val.date).toLocaleString("fr-FR"),
      }));
      setAllNotifications(all);
    }
  }, []);

  return (
    <div className={`mt-10 p-6 rounded-xl shadow border max-w-2xl mx-auto ${
      darkMode ? "bg-[#1a0536] text-white border-purple-600" : "bg-white text-gray-900 border-gray-300"
    }`}>
      <h2 className="text-xl font-bold mb-4">📋 Historique des notifications</h2>
      {allNotifications.length === 0 ? (
        <p className="italic text-sm">Aucune notification enregistrée.</p>
      ) : (
        <>
          <p className="text-sm mb-4">
            Total : <strong>{allNotifications.length}</strong>
          </p>
          <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 dark:scrollbar-thumb-purple-800">
            {allNotifications.map((notif) => (
              <li key={notif.id} className={`p-3 rounded-md border flex justify-between items-center ${
                notif.isRead
                  ? darkMode
                    ? "bg-[#2e1555] border-purple-800 text-gray-400"
                    : "bg-gray-100 border-gray-300 text-gray-600"
                  : darkMode
                  ? "bg-purple-900 border-purple-400"
                  : "bg-purple-50 border-purple-300"
              }`}>
                <div>
                  <p className="font-semibold">Notification #{notif.id}</p>
                  <p className="text-sm">Date : {notif.date}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${
                  notif.isRead
                    ? "bg-green-200 text-green-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}>
                  {notif.isRead ? "Lue" : "Non lue"}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};


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

    // Vérification longueur minimale
    if (newPassword.length < 8) {
        return setMessage("Le mot de passe doit contenir au moins 8 caractères.");
    }

    // Vérification complexité avec Regex
    const regexComplexite = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
    if (!regexComplexite.test(newPassword)) {
        return setMessage(
            "Le mot de passe doit avoir caractéristique complexe."
        );
    }

    // Vérification confirmation
    if (newPassword !== confirmPassword) {
        return setMessage("Les mots de passe ne correspondent pas.");
    }

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
  <div
    className={`relative border shadow-lg rounded-2xl p-8 space-y-6 ${
      darkMode ? "bg-[#1a0536] text-white" : "bg-white text-gray-800"
    }`}
  >
    <div className="absolute top-4 right-4 flex items-center space-x-2">
      <h4 className="text-lg font-semibold">Notifications du jour</h4>
      <div className="relative">
        <button
          className="p-2 rounded-full hover:text-pink-600 transition"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell className="w-6 h-6" />
        </button>
        {notifications.filter((n) => !n.isRead).length > 0 && (
          <span className="absolute -top-1 -right-1 text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.filter((n) => !n.isRead).length}
          </span>
        )}
      </div>
    </div>

    {showNotifications && (
      <div
        className={`mt-6 p-4 rounded-xl border max-w-md mx-auto ${
          darkMode ? "bg-[#2e1555] border-purple-400" : "bg-gray-50 border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setShowNotifications(false)}
            className="text-sm flex items-center gap-1 text-purple-600 hover:underline"
            aria-label="Fermer les notifications"
          >
            <BellOff className="w-4 h-4" />
            Fermer
          </button>
        </div>

        {notifications.length === 0 ? (
          <p className="text-sm italic text-center">
            Aucune notification pour le moment.
          </p>
        ) : (
          <ul className="space-y-2 text-sm max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 dark:scrollbar-thumb-purple-700 dark:scrollbar-track-transparent">
            {notifications
            .filter((notif) => !notif.isRead)
            .map((notif) => (
              <div key={notif.id} className="p-3 border rounded-lg mb-2 flex items-center">
                {notif.icon}
                <span className="ml-2">{notif.message}</span>
                <button
                  className="ml-auto text-sm text-blue-500"
                  onClick={() => markAsRead(notif.id)}
                >
                  Marquer comme lue
                </button>
              </div>
            ))}
          </ul>
        )}
      </div>
    )}

    {/* Historique complet des notifications (en localStorage) */}
    <HistoriqueNotifications darkMode={darkMode} />
  </div>
)}

          {activeTab === "historique" && (
            <HistoriqueAvecFiltre commandes={commandes} darkMode={darkMode} />
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
