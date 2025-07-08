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
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";

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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

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

  const handlePasswordChange = async () => {
    if (!email) {
      setMessage("Veuillez entrer votre email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Utilisateur non authentifié.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/changerMotDePasse",
        { email, nouveau: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="min-h-screen bg-white text-black relative overflow-hidden font-sans">
      <div className="absolute inset-0 flex z-0">
        <div className="w-1/2 h-full bg-gradient-to-br from-white via-[#fceff9] to-[#e6e6ff]" />
        <div className="w-1/2 h-full bg-gradient-to-tr from-[#fdf6ff] via-[#e6dbff] to-white" />
      </div>

      <Navbar />

      <div className="relative z-10 pt-20 px-6 w-full flex justify-center gap-3">
        <button
          className="min-w-[210px] bg-pink-500 text-white px-3 py-2 rounded-lg hover:bg-pink-600 transition flex items-center justify-center"
          onClick={() => setShowChangePassword(false)}
        >
          <Info className="inline mr-1" /> À propos
        </button>
        <button
          className="min-w-[170px] bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
          onClick={() => setShowChangePassword(true)}
        >
          <Lock className="inline mr-1" /> Changer mot de passe
        </button>
      </div>

      <main className="relative z-10 pt-10 px-6 w-full flex justify-center mb-20 sm:mb-32">
        {!showChangePassword ? (
          <div className="w-full max-w-5xl md:h-[360px] bg-white/90 backdrop-blur-md border border-pink-200 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
              <img src={studio.Logo} alt="Logo du studio" className="w-24 h-24 object-contain" />
              <h1 className="text-3xl font-extrabold text-pink-600">{studio.nom}</h1>
              <p className="text-lg font-semibold text-gray-700 italic">Responsable</p>
              <p className="text-xl font-medium text-gray-900">{studio.Responsable}</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm text-gray-800">
              <InfoItem icon={<MapPin className="text-pink-400" />} label="Adresse" value={studio.Adresse} />
              <InfoItem icon={<Landmark className="text-pink-400" />} label="Ville" value={studio.Ville} />
              <InfoItem icon={<Building2 className="text-pink-400" />} label="Code Postal" value={studio.Code_Postale} />
              <InfoItem icon={<Phone className="text-pink-400" />} label="Contact" value={studio.Contact} />
              <InfoItem icon={<ShieldCheck className="text-pink-400" />} label="NIF" value={studio.Nif} />
              <InfoItem icon={<BookText className="text-pink-400" />} label="STAT" value={studio.Stat} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md bg-white border border-gray-300 shadow-lg rounded-2xl p-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Changer le mot de passe</h2>
              <button onClick={() => setShowChangePassword(false)}>
                <X className="text-gray-600 hover:text-red-500" />
              </button>
            </div>
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            {message && <p className="text-center text-sm text-red-500">{message}</p>}
            <button
              onClick={handlePasswordChange}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
            >
              Confirmer
            </button>
          </div>
        )}
      </main>

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
};

const InfoItem = ({ icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="font-semibold text-gray-600">{label}</p>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

export default About;
