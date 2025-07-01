import {
  MapPin,
  Phone,
  Building2,
  Landmark,
  ShieldCheck,
  BookText,
  Music2,
} from "lucide-react";
import Navbar from "../components/Navbar";

const studio = {
  nom: "Merix Studio",
  adresse: "Lot II K 45 Antanimena",
  ville: "Antananarivo",
  code_postal: 101,
  contact: "+261 32 12 345 67",
  nif: 123456789012345,
  stat: 987654321098765,
  responsable: "Lucia Rasoanirina",
  logo: "/logo.png",
};

const About = () => {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden font-sans">
      {/* Background gradient */}
      <div className="absolute inset-0 flex z-0">
        <div className="w-1/2 h-full bg-gradient-to-br from-white via-[#fceff9] to-[#e6e6ff]" />
        <div className="w-1/2 h-full bg-gradient-to-tr from-[#fdf6ff] via-[#e6dbff] to-white" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10 pt-24 px-6 w-full flex justify-center">
        <div className="w-full max-w-5xl md:h-[380px] bg-white/90 backdrop-blur-md border border-pink-200 shadow-2xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 hover:scale-[1.01] transition-transform duration-300">
          
          {/* Left column: logo + studio name + responsable centered */}
          <div className="md:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
            <img
              src={studio.logo}
              alt="Logo du studio"
              className="w-24 h-24 object-contain"
            />
            <h1 className="text-3xl font-extrabold text-pink-600 tracking-wide relative inline-block
              after:absolute after:left-0 after:bottom-[-6px]
              after:h-[3px] after:w-0 after:bg-pink-500
              hover:after:w-full after:transition-all after:duration-300"
            >
              {studio.nom}
            </h1>
            <p className="text-lg font-semibold text-gray-700 italic">
              Responsable
            </p>
            <p className="text-xl font-medium text-gray-900">{studio.responsable}</p>
          </div>

          {/* Right column: info grid */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-sm text-gray-800">
            <InfoItem icon={<MapPin className="text-pink-400" />} label="Adresse" value={studio.adresse} />
            <InfoItem icon={<Landmark className="text-pink-400" />} label="Ville" value={studio.ville} />
            <InfoItem icon={<Building2 className="text-pink-400" />} label="Code Postal" value={studio.code_postal} />
            <InfoItem icon={<Phone className="text-pink-400" />} label="Contact" value={studio.contact} />
            <InfoItem icon={<ShieldCheck className="text-pink-400" />} label="NIF" value={studio.nif} />
            <InfoItem icon={<BookText className="text-pink-400" />} label="STAT" value={studio.stat} />
          </div>
        </div>
      </main>

      {/* Music notes animation bottom center */}
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
