import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

type Client = {
  id?: number;
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
  const [indexModification, setIndexModification] = useState<number | null>(null);
  const [termeRecherche, setTermeRecherche] = useState("");

  useEffect(() => {
    chargerClients();
  }, []);

  const chargerClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const ajouterOuModifierClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.nom || !client.telephone || !client.adresse || !client.email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      if (indexModification !== null) {
        const clientAModifier = clients[indexModification];
        await axios.put(`http://localhost:5000/api/clients/${clientAModifier.id}`, client);
        const nouveaux = [...clients];
        nouveaux[indexModification] = { ...client, id: clientAModifier.id };
        setClients(nouveaux);
        setIndexModification(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/clients", client);
        setClients([...clients, res.data]);
      }

      setClient({ nom: "", telephone: "", adresse: "", email: "" });
    } catch (err) {
      console.error("Erreur d'enregistrement :", err);
    }
  };

  const modifierClient = (index: number) => {
    setClient(clients[index]);
    setIndexModification(index);
  };

  const supprimerClient = async (index: number) => {
    if (!window.confirm("Confirmer la suppression de ce client ?")) return;
    const id = clients[index].id;
    try {
      await axios.delete(`http://localhost:5000/api/clients/${id}`);
      setClients(clients.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  const clientsFiltres = clients.filter((c) =>
    Object.values(c).some((val) =>
      val.toString().toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-violet-50 text-gray-800">
      <Navbar />

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-pink-600 drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des Clients
          </h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher un client..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <form
            onSubmit={ajouterOuModifierClient}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015] h-full"
          >
            <h2 className="text-2xl font-bold text-center tracking-wide text-pink-600">
              {indexModification !== null ? "Modifier le Client" : "Ajouter un Client"}
            </h2>

            {[
              { icon: <User size={18} />, name: "nom", placeholder: "Nom du client" },
              { icon: <Phone size={18} />, name: "telephone", placeholder: "Téléphone" },
              { icon: <MapPin size={18} />, name: "adresse", placeholder: "Adresse" },
              { icon: <Mail size={18} />, name: "email", placeholder: "Email" },
            ].map(({ icon, name, placeholder }) => (
              <div
                key={name}
                className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition"
              >
                {icon}
                <input
                  type="text"
                  name={name}
                  value={client[name as keyof Client]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl backdrop-blur-md hover:scale-[1.015]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-wide text-pink-600">
                Liste des Clients
              </h2>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white text-sm font-bold shadow-md animate-bounce">
                {clientsFiltres.length}
              </div>
            </div>

            <div className="block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full">
              <Search size={18} />
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher un client..."
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            {clientsFiltres.length === 0 ? (
              <p className="text-violet-500 italic">Aucun client trouvé.</p>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {clientsFiltres.map((c) => {
                  const idx = clients.indexOf(c);
                  return (
                    <li
                      key={c.id}
                      className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition-all text-sm space-y-1 relative"
                    >
                      <div className="space-y-2 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-black" />
                          <span><strong>Nom :</strong> {c.nom}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-black" />
                          <span><strong>Téléphone :</strong> {c.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-black" />
                          <span><strong>Adresse :</strong> {c.adresse}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-black" />
                          <span><strong>Email :</strong> {c.email}</span>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => modifierClient(idx)}
                          className="text-sm-600 hover:text-pink-600 hover:scale-110"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => supprimerClient(idx)}
                          className="text-sm-600 hover:text-pink-600 hover:scale-110"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Clients;
