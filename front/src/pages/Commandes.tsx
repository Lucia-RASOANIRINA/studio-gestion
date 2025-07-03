import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Phone,
  Search,
  Edit,
  Trash2,
  Truck,
  Hammer,
  PhoneCall,
  Coins,
} from "lucide-react";

type Commande = {
  id?: number;
  dateCommande: string;
  dateRealisation: string;
  dateLivraison: string;
  total: string;
  reste: string;
  telephoneClient: string;
};

const Commandes = () => {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [commande, setCommande] = useState<Commande>({
    dateCommande: getToday(),
    dateRealisation: "",
    dateLivraison: "",
    total: "",
    reste: "",
    telephoneClient: "",
  });

  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [termeRecherche, setTermeRecherche] = useState("");
  const [indexModification, setIndexModification] = useState<number | null>(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/commandes")
      .then(res => setCommandes(res.data))
      .catch(err => console.error("Erreur chargement commandes", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommande({ ...commande, [name]: value });
  };

  const ajouterOuModifierCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    const { dateRealisation, dateLivraison, total, reste, telephoneClient } = commande;

    if (!dateRealisation || !dateLivraison || !total || !reste || !telephoneClient) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (indexModification !== null && commande.id) {
      await axios.put(`http://localhost:5000/api/commandes/${commande.id}`, commande);
      const updated = [...commandes];
      updated[indexModification] = commande;
      setCommandes(updated);
      setIndexModification(null);
    } else {
      const res = await axios.post("http://localhost:5000/api/commandes", commande);
      setCommandes([...commandes, res.data]);
    }

    setCommande({
      dateCommande: getToday(),
      dateRealisation: "",
      dateLivraison: "",
      total: "",
      reste: "",
      telephoneClient: "",
    });
  };

  const modifierCommande = (index: number) => {
    setCommande(commandes[index]);
    setIndexModification(index);
  };

  const supprimerCommande = async (index: number) => {
    const cmd = commandes[index];
    if (window.confirm("Voulez-vous vraiment supprimer cette commande ?")) {
      await axios.delete(`http://localhost:5000/api/commandes/${cmd.id}`);
      const restants = commandes.filter((_, i) => i !== index);
      setCommandes(restants);
    }
  };

  const commandesFiltrees = commandes.filter((cmd) =>
    Object.values(cmd).some((val) =>
      String(val).toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-#e8e6ff to-#fdf6ff text-gray-800">
      <Navbar />

      <main className="pt-20 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#ec4899] drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des commandes
          </h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher commandes..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <form
            onSubmit={ajouterOuModifierCommande}
            className="bg-white border border-violet-200 p-4 rounded-2xl shadow-xl space-y-4 backdrop-blur-md hover:scale-[1.015]"
          >
            <h2 className="text-2xl font-bold text-center text-pink-600">
              {indexModification !== null ? "Modifier la commande" : "Ajouter une commande"}
            </h2>

            {["dateCommande", "dateRealisation", "dateLivraison", "total", "reste", "telephoneClient"].map((champ, i) => {
              const Icone = [CalendarDays, CalendarCheck, CalendarClock, DollarSign, Coins, Phone][i];
              const type = champ.includes("date") ? "date" : champ === "total" || champ === "reste" ? "number" : "text";
              const placeholder = ["Date commande", "Date réalisation", "Date livraison", "Montant total", "Reste à payer", "Téléphone client"][i];
              return (
                <div key={champ} className="flex items-center gap-2 px-3 py-2 rounded-full border border-violet-300 bg-violet-50">
                  <Icone size={18} />
                  <input
                    type={type}
                    name={champ}
                    value={commande[champ as keyof Commande]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400"
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

          <div className="bg-white border border-violet-200 p-4 rounded-2xl shadow-xl backdrop-blur-md hover:scale-[1.015]">
            <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
              Liste des commandes
            </h2>

            <div className="block md:hidden flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-violet-300 bg-violet-50">
              <Search size={18} />
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            {commandesFiltrees.length === 0 ? (
              <p className="text-violet-500 italic">Aucune commande trouvée.</p>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {commandesFiltrees.map((c, i) => (
                  <li
                    key={i}
                    className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition-all text-sm space-y-1 relative"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2"><CalendarDays size={16} /><span><strong>Commande :</strong> {c.dateCommande}</span></div>
                      <div className="flex items-center gap-2"><Hammer size={16} /><span><strong>Réalisation :</strong> {c.dateRealisation}</span></div>
                      <div className="flex items-center gap-2"><Truck size={16} /><span><strong>Livraison :</strong> {c.dateLivraison}</span></div>
                      <div className="flex items-center gap-2"><DollarSign size={16} /><span><strong>Total :</strong> {c.total} Ar</span></div>
                      <div className="flex items-center gap-2"><Coins size={16} /><span><strong>Reste :</strong> {c.reste} Ar</span></div>
                      <div className="flex items-center gap-2"><PhoneCall size={16} /><span><strong>Client :</strong> {c.telephoneClient}</span></div>
                    </div>

                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => modifierCommande(i)} className="text-sm-600 hover:text-pink-600 hover:scale-110" title="Modifier">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => supprimerCommande(i)} className="text-sm-600 hover:text-pink-600 hover:scale-110" title="Supprimer">
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

export default Commandes;
