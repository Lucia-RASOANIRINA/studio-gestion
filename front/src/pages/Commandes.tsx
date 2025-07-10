import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Search,
  Edit,
  Trash2,
  CalendarDays,
  User,
} from "lucide-react";

type Commande = {
  id?: number;
  dateCommande: string;
  dateRealisation: string;
  dateLivraison: string;
  idClient: number;
  nomClient?: string;
};

type Client = {
  id: number;
  nom: string;
};

const getToday = () => new Date().toISOString().split("T")[0];

const Commandes = () => {
  const [commande, setCommande] = useState<Commande>({
    dateCommande: getToday(),
    dateRealisation: getToday(),
    dateLivraison: getToday(),
    idClient: 0,
  });

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [indexModification, setIndexModification] = useState<number | null>(null);
  const [termeRecherche, setTermeRecherche] = useState("");

  useEffect(() => {
    chargerCommandes();
    chargerClients();
  }, []);

  const chargerCommandes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/commandes");
      setCommandes(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes:", err);
    }
  };

  const chargerClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Erreur chargement clients:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCommande({ ...commande, [name]: name === "idClient" ? Number(value) : value });
  };

  const ajouterOuModifierCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    const { dateCommande, dateRealisation, dateLivraison, idClient } = commande;

    if (!dateCommande || !dateRealisation || !dateLivraison || !idClient) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      if (indexModification !== null) {
        const commandeAModifier = commandes[indexModification];
        await axios.put(`http://localhost:5000/api/commandes/${commandeAModifier.id}`, commande);
        const nouvelles = [...commandes];
        nouvelles[indexModification] = { ...commande, id: commandeAModifier.id };
        setCommandes(nouvelles);
        setIndexModification(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/commandes", commande);
        setCommandes([...commandes, res.data]);
      }

      setCommande({
        dateCommande: getToday(),
        dateRealisation: getToday(),
        dateLivraison: getToday(),
        idClient: 0,
      });
    } catch (err) {
      console.error("Erreur enregistrement commande:", err);
    }
  };

  const formatDateInput = (date: string) => new Date(date).toISOString().split("T")[0];

  const modifierCommande = (index: number) => {
    const c = commandes[index];
    setCommande({
      ...c,
      dateCommande: formatDateInput(c.dateCommande),
      dateRealisation: formatDateInput(c.dateRealisation),
      dateLivraison: formatDateInput(c.dateLivraison),
    });
    setIndexModification(index);
  };

  const supprimerCommande = async (index: number) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    const id = commandes[index].id;
    try {
      await axios.delete(`http://localhost:5000/api/commandes/${id}`);
      setCommandes(commandes.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erreur suppression commande:", err);
    }
  };

  const commandesFiltres = commandes.filter((c) =>
    Object.values(c).some((val) =>
      val?.toString().toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-pink-50 text-gray-800">
      <Navbar />
      <main className="pt-24 px-4 max-w-5xl mx-auto text-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <h1 className="text-2xl font-bold text-pink-600">Gestion des Commandes</h1>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-md border border-violet-300 bg-violet-50 w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher..."
              className="bg-transparent border-none outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form
            onSubmit={ajouterOuModifierCommande}
            className="bg-white border border-violet-200 p-5 rounded-xl shadow-md space-y-4 text-sm"
          >
            <h2 className="text-lg font-semibold text-center text-pink-600">
              {indexModification !== null ? "Modifier la commande" : "Nouvelle commande"}
            </h2>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-violet-300 bg-violet-100">
              <CalendarDays size={18} />
              <input
                type="date"
                name="dateCommande"
                value={commande.dateCommande}
                readOnly
                className="bg-transparent border-none outline-none w-full text-sm cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-violet-300 bg-violet-50">
              <CalendarDays size={18} />
              <input
                type="date"
                name="dateRealisation"
                value={commande.dateRealisation}
                onChange={handleChange}
                min={getToday()}
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-violet-300 bg-violet-50">
              <CalendarDays size={18} />
              <input
                type="date"
                name="dateLivraison"
                value={commande.dateLivraison}
                onChange={handleChange}
                min={getToday()}
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2.5 rounded-md border border-violet-300 bg-violet-50">
              <User size={18} />
              <select
                name="idClient"
                value={commande.idClient}
                onChange={handleChange}
                className="bg-transparent border-none outline-none w-full text-sm"
              >
                <option value={0}>-- Sélectionner un client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow hover:shadow-lg hover:-translate-y-0.5 transition duration-200"
            >
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          <div className="bg-white border border-violet-200 p-5 rounded-xl shadow-md text-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-pink-600">Liste des Commandes</h2>
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-pink-500 text-white text-[11px] font-bold">
                {commandesFiltres.length}
              </div>
            </div>

            <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {commandesFiltres.map((c, i) => (
                <li
                  key={c.id}
                  className="border border-violet-200 rounded-md p-3 bg-violet-50 hover:bg-violet-100 transition relative"
                >
                  <p><strong>Client:</strong> {clients.find(client => client.id === c.idClient)?.nom || "Inconnu"}</p>
                  <p><strong>Commande:</strong> {formatDateInput(c.dateCommande)}</p>
                  <p><strong>Réalisation:</strong> {formatDateInput(c.dateRealisation)}</p>
                  <p><strong>Livraison:</strong> {formatDateInput(c.dateLivraison)}</p>
                  <div className="absolute top-1 right-1 flex gap-1">
                    <button onClick={() => modifierCommande(i)} title="Modifier">
                      <Edit size={14} className="hover:text-pink-600" />
                    </button>
                    <button onClick={() => supprimerCommande(i)} title="Supprimer">
                      <Trash2 size={14} className="hover:text-pink-600" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Commandes;
