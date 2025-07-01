import { useState } from "react";
import Navbar from "../components/Navbar";
import { User, Phone, MapPin, Mail, Search, Edit, Trash2 } from "lucide-react";

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
  const [termeRecherche, setTermeRecherche] = useState("");
  const [indexModification, setIndexModification] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const ajouterOuModifierClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.nom || !client.telephone || !client.adresse || !client.email) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (indexModification !== null) {
      const nouveauxClients = [...clients];
      nouveauxClients[indexModification] = client;
      setClients(nouveauxClients);
      setIndexModification(null);
    } else {
      setClients([...clients, client]);
    }

    setClient({ nom: "", telephone: "", adresse: "", email: "" });
  };

  const modifierClient = (index: number) => {
    setClient(clients[index]);
    setIndexModification(index);
  };

  const supprimerClient = (index: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce client ?")) {
      const nouveauxClients = clients.filter((_, i) => i !== index);
      setClients(nouveauxClients);
    }
  };

  const clientsFiltres = clients.filter((c) =>
    Object.values(c).some((val) =>
      val.toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-#e8e6ff to-#fdf6ff text-gray-800">
      <Navbar />

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#ec4899] drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des clients
          </h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher client..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <form
            onSubmit={ajouterOuModifierClient}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015]"
          >
            <h2 className="text-2xl font-bold text-center tracking-wide text-pink-600">
              {indexModification !== null ? "Modifier le client" : "Ajouter un client"}
            </h2>

            {["nom", "telephone", "adresse", "email"].map((champ, i) => {
              const Icone = [User, Phone, MapPin, Mail][i];
              const placeholder = ["Nom complet", "0324567890", "Adresse", "client@email.com"][i];
              return (
                <div
                  key={champ}
                  className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition"
                >
                  <Icone size={18} />
                  <input
                    type={champ === "email" ? "email" : "text"}
                    name={champ}
                    value={client[champ as keyof Client]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    maxLength={champ === "telephone" ? 10 : undefined}
                    className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
                  />
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              {indexModification !== null ? "Modifier" : "Enregistrer"}
            </button>
          </form>

          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl backdrop-blur-md hover:scale-[1.015]">
            <h2 className="text-2xl font-bold text-center tracking-wide text-pink-600 mb-4">
              Liste des Clients
            </h2>

            <div className="block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full">
              <Search size={18} />
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher client..."
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            {clientsFiltres.length === 0 ? (
              <p className="text-violet-500 italic">Aucun client trouvé.</p>
            ) : (
              <ul className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {clientsFiltres.map((c, index) => (
                  <li
                    key={index}
                    className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition-all text-sm space-y-1 relative"
                  >
                    <p><strong>👤 Nom:</strong> {c.nom}</p>
                    <p><strong>📞 Téléphone:</strong> {c.telephone}</p>
                    <p><strong>📍 Adresse:</strong> {c.adresse}</p>
                    <p><strong>📧 Email:</strong> {c.email}</p>

                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => modifierClient(index)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => supprimerClient(index)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
