import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  DollarSign,
  Phone,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

type Commande = {
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
  const [indexModification, setIndexModification] = useState<number | null>(null);
  const [termeRecherche, setTermeRecherche] = useState("");

  useEffect(() => {
    setCommande((prev) => ({ ...prev, dateCommande: getToday() }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommande({ ...commande, [name]: value });
  };

  const ajouterOuModifierCommande = (e: React.FormEvent) => {
    e.preventDefault();
    const { dateRealisation, dateLivraison, total, reste, telephoneClient } = commande;
    if (!dateRealisation || !dateLivraison || !total || !reste || !telephoneClient) {
      alert("Veuillez remplir tous les champs sauf la date de commande (automatique).");
      return;
    }

    if (indexModification !== null) {
      const nouvelles = [...commandes];
      nouvelles[indexModification] = commande;
      setCommandes(nouvelles);
      setIndexModification(null);
    } else {
      setCommandes([...commandes, commande]);
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

  const supprimerCommande = (index: number) => {
    if (window.confirm("Supprimer cette commande ?")) {
      setCommandes(commandes.filter((_, i) => i !== index));
    }
  };

  const commandesFiltrees = commandes.filter((cmd) =>
    Object.values(cmd).some((val) =>
      val.toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-violet-50 text-gray-800">
      <Navbar />
      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-pink-600 hover:scale-[1.015]">Gestion des Commandes</h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher une commande..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          {/* Formulaire */}
          <form
            onSubmit={ajouterOuModifierCommande}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5 hover:scale-[1.015]"
          >
            <h2 className="text-xl font-semibold text-center text-pink-600">
              {indexModification !== null ? "Modifier la commande" : "Nouvelle commande"}
            </h2>

            {/* Date de commande (auto) */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <CalendarDays size={18} />
              <input
                type="date"
                name="dateCommande"
                value={commande.dateCommande}
                readOnly
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <CalendarCheck size={18} />
              <input
                type="date"
                name="dateRealisation"
                value={commande.dateRealisation}
                onChange={handleChange}
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <CalendarClock size={18} />
              <input
                type="date"
                name="dateLivraison"
                value={commande.dateLivraison}
                onChange={handleChange}
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <DollarSign size={18} />
              <input
                type="number"
                name="total"
                value={commande.total}
                onChange={handleChange}
                placeholder="Montant total"
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <DollarSign size={18} />
              <input
                type="number"
                name="reste"
                value={commande.reste}
                onChange={handleChange}
                placeholder="Reste à payer"
                className="bg-transparent border-none outline-none w-full text-sm"
              />
            </div>

            {/* Numéro de téléphone client */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-violet-50">
              <Phone size={18} />
              <input
                type="tel"
                name="telephoneClient"
                value={commande.telephoneClient}
                onChange={handleChange}
                placeholder="Téléphone du client "
                className="bg-transparent border-none outline-none w-full text-sm"
                maxLength={10}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow hover:shadow-xl hover:-translate-y-1 transition"
            >
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          {/* Liste commandes */}
          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl hover:scale-[1.015]">
            <h2 className="text-xl font-semibold text-center text-pink-600 mb-4">Liste des Commandes</h2>

            {commandesFiltrees.length === 0 ? (
              <p className="italic text-violet-500">Aucune commande trouvée.</p>
            ) : (
              <ul className="space-y-3 max-h-[350px] overflow-y-auto pr-2 text-sm">
                {commandesFiltrees.map((c, i) => (
                  <li
                    key={i}
                    className="border border-violet-100 rounded-lg p-4 bg-violet-50 relative"
                  >
                    <p><strong>📆 Commande :</strong> {c.dateCommande}</p>
                    <p><strong>🛠 Réalisation :</strong> {c.dateRealisation}</p>
                    <p><strong>🚚 Livraison :</strong> {c.dateLivraison}</p>
                    <p><strong>💰 Total :</strong> {c.total} Ar</p>
                    <p><strong>💸 Reste :</strong> {c.reste} Ar</p>
                    <p><strong>📞 Client :</strong> {c.telephoneClient}</p>

                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => modifierCommande(i)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => supprimerCommande(i)}
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

export default Commandes;
