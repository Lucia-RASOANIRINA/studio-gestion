import { useState } from "react";
import Navbar from "../components/Navbar";
import { User, Phone, MapPin, Mail } from "lucide-react";

type Client = {
  nom: string;
  telephone: string;
  adresse: string;
  email: string;
};

const Clients = () => {
  const [client, setClient] = useState<Client>({
    nom: "",
    telephone: "",
    adresse: "",
    email: "",
  });

  const [clients, setClients] = useState<Client[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const ajouterClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.nom || !client.telephone || !client.adresse || !client.email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    setClients([...clients, client]);
    setClient({ nom: "", telephone: "", adresse: "", email: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-#e8e6ff to-fuchsia-300 text-gray-800">
      <Navbar />

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[#ec4899] mb-8 drop-shadow-md hover:scale-105">
          Gestion des clients
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <form
            onSubmit={ajouterClient}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md"
          >
            <h2 className="text-xl font-bold text-xs mb-4">Enregistrement d'un Client</h2>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <User size={18} />
              <input
                type="text"
                name="nom"
                value={client.nom}
                onChange={handleChange}
                placeholder="Nom complet"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <Phone size={18} />
              <input
                type="tel"
                name="telephone"
                value={client.telephone}
                onChange={handleChange}
                placeholder="0324567890"
                maxLength={10}
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <MapPin size={18} />
              <input
                type="text"
                name="adresse"
                value={client.adresse}
                onChange={handleChange}
                placeholder="Adresse"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={client.email}
                onChange={handleChange}
                placeholder="client@email.com"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              Enregistrer
            </button>
          </form>

          {/* Liste */}
          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-bold text-xs mb-4">Liste des Clients</h2>
            {clients.length === 0 ? (
              <p className="text-violet-500 italic">Aucun client enregistré.</p>
            ) : (
              <ul className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {clients.map((c, index) => (
                  <li
                    key={index}
                    className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition-all text-sm space-y-1"
                  >
                    <p><strong>👤 Nom:</strong> {c.nom}</p>
                    <p><strong>📞 Téléphone:</strong> {c.telephone}</p>
                    <p><strong>📍 Adresse:</strong> {c.adresse}</p>
                    <p><strong>📧 Email:</strong> {c.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;
