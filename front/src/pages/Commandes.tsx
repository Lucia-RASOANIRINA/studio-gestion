import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Select from "react-select";
import {
  Search,
  Edit,
  Trash2,
  CalendarDays,
  User,
  X,
} from "lucide-react";

// Types
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
  telephone: string;
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
  const [messageErreur, setMessageErreur] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    setDarkMode(storedMode === "true");
  }, []);

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
    if (messageErreur) setMessageErreur("");
  };

  const ajouterOuModifierCommande = async (e: React.FormEvent) => {
    e.preventDefault();
    const { dateCommande, dateRealisation, dateLivraison, idClient } = commande;

    if (!dateCommande || !dateRealisation || !dateLivraison || !idClient) {
      setMessageErreur("Veuillez remplir tous les champs.");
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
        // Vérifier les limites
        const nbRealisation = commandes.filter(
          (c) => c.dateRealisation === commande.dateRealisation
        ).length;

        const nbLivraison = commandes.filter(
          (c) => c.dateLivraison === commande.dateLivraison
        ).length;

        if (nbRealisation >= 10) {
          setMessageErreur("Limite atteinte : 10 commandes déjà prévues pour cette date de réalisation.");
          return;
        }

        if (nbLivraison >= 15) {
          setMessageErreur("Limite atteinte : 15 commandes déjà prévues pour cette date de livraison.");
          return;
        }

        const res = await axios.post("http://localhost:5000/api/commandes", commande);
        setCommandes([...commandes, res.data]);
      }

      setCommande({
        dateCommande: getToday(),
        dateRealisation: getToday(),
        dateLivraison: getToday(),
        idClient: 0,
      });
      setMessageErreur("");
    } catch (err) {
      console.error("Erreur enregistrement commande:", err);
      setMessageErreur("Erreur lors de l'enregistrement, veuillez réessayer.");
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
    setMessageErreur("");
  };

  const annulerModification = () => {
    setCommande({
      dateCommande: getToday(),
      dateRealisation: getToday(),
      dateLivraison: getToday(),
      idClient: 0,
    });
    setIndexModification(null);
    setMessageErreur("");
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

  const nbRealisationRestante = 10 - commandes.filter(c => c.dateRealisation === commande.dateRealisation).length;
  const nbLivraisonRestante = 15 - commandes.filter(c => c.dateLivraison === commande.dateLivraison).length;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-gray-100"
          : "bg-gradient-to-r from-[#e6e6ff] via-[#fdd6ff] to-[#ffff]text-black border-pink-200/50"
      }`}>
      <Navbar />
      <main className="pt-24 px-4 max-w-5xl mx-auto text-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
          <h1 className="text-2xl font-bold text-pink-600">Gestion des Commandes</h1>

         <div
          className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-md border w-full md:w-[300px] transition-all duration-300
            ${darkMode
              ? "bg-[#1a053f] border-gray-600"
              : "bg-violet-50 border-violet-300"}
          `}
        >
          <Search
            size={18}
            className={darkMode ? "text-purple-200" : "text-violet-700"}
          />
          <input
            type="text"
            value={termeRecherche}
            onChange={(e) => setTermeRecherche(e.target.value)}
            placeholder="Rechercher..."
            className={`bg-transparent border-none outline-none w-full text-sm transition-all duration-300 placeholder-violet-400 
              ${darkMode ? "text-white placeholder-purple-300" : "text-gray-800"}`}
          />
        </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form
            onSubmit={ajouterOuModifierCommande}
            className={`p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015] h-full transition-colors duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border border-gray-700 text-white"
              : "bg-white border border-violet-200 text-black"
          }`}
          >
            <h2 className={`text-xl font-semibold text-center tracking-wide ${
                  darkMode ? "text-purple-300" : "text-pink-600"
                }`}>
              {indexModification !== null ? "Modifier la commande" : "Nouvelle commande"}
            </h2>

            <div  className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
              darkMode
                ? "border-violet-700 bg-violet-990"
                : "border-violet-300 bg-violet-50"
            }`}>
              <CalendarDays size={18}  className={darkMode ? "text-white" : "text-black"}/>
              <input
                type="date"
                name="dateCommande"
                value={commande.dateCommande}
                readOnly
                className={`bg-transparent border-none outline-none w-full text-xs cursor-not-allowed ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              />
            </div>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
                darkMode
                  ? "border-violet-700 bg-violet-990"
                  : "border-violet-300 bg-violet-50"
              }`}>
              <CalendarDays size={18} className={darkMode ? "text-white" : "text-black"}/>
              <input
                type="date"
                name="dateRealisation"
                value={commande.dateRealisation}
                onChange={handleChange}
                min={getToday()}
                className={`bg-transparent border-none outline-none w-full text-xs ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              />
            </div>
            <p className="text-xs text-gray-500 italic text-center dark:text-gray-300">
              {nbRealisationRestante > 0
                ? `${nbRealisationRestante} Commande(s) restante(s) pour cette date de réalisation.`
                : "Limite atteinte pour cette date de réalisation."}
            </p>

            <div className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
                darkMode
                  ? "border-violet-700 bg-violet-990"
                  : "border-violet-300 bg-violet-50"
              }`}>
              <CalendarDays size={18} className={darkMode ? "text-white" : "text-black"} />
              <input
                type="date"
                name="dateLivraison"
                value={commande.dateLivraison}
                onChange={handleChange}
                min={getToday()}
                className={`bg-transparent border-none outline-none w-full text-xs ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              />
            </div>
            <p className="text-xs text-gray-500 italic text-center">
              {nbLivraisonRestante > 0
                ? `${nbLivraisonRestante} Commande(s) restante(s) pour cette date de livraison.`
                : "Limite atteinte pour cette date de livraison."}
            </p>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10">
                <User size={18} className={darkMode ? "text-white" : "text-black"}/>
              </div>
              <Select
                options={clients.map((client) => ({
                  value: client.id,
                  label: `${client.nom} (${client.telephone})`,
                }))}
                value={
                  commande.idClient !== 0
                    ? {
                        value: commande.idClient,
                        label: (() => {
                          const c = clients.find((c) => c.id === commande.idClient);
                          return c ? `${c.nom} (${c.telephone})` : "";
                        })(),
                      }
                    : null
                }
                onChange={(selected) => {
                  setCommande({ ...commande, idClient: selected ? selected.value : 0 });
                  if (messageErreur) setMessageErreur("");
                }}
                placeholder="Sélectionner un client"
                isClearable
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    paddingLeft: "2.2rem",
                    borderRadius: "9999px",
                    borderColor: darkMode ? "#6d28d9" : "#c4b5fd",
                    backgroundColor: darkMode ? "#2e1065" : "#f5f3ff",
                    fontSize: "0.75rem",
                    color: darkMode ? "#f9fafb" : "#1f2937",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: darkMode ? "#ddd6fe" : "#a78bfa",
                  }),
                  singleValue: (base) => ({
                  ...base,
                  color: darkMode ? "#fff" : "#000",
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: darkMode ? "#1f2937" : "#fff",
                    color: darkMode ? "#fff" : "#000",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused
                    ? darkMode
                      ? "#44445d"
                      : "#f0f0f0"
                    : darkMode  
                    ? "#2a2a3d"
                    : "#fff",
                    color: darkMode ? "#f9fafb" : "#000",
                  }),
                }}
              />
            </div>

            {messageErreur && (
              <div className="text-red-600 text-sm font-medium text-center">{messageErreur}</div>
            )}

            <button
              type="submit"
              className={`w-full py-2 font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-pink-700 to-fuchsia-700 text-white"
                  : "bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black"
              }`}>
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          <div className={`p-6 rounded-2xl shadow-xl hover:scale-[1.015] border ${
              darkMode
                ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border-gray-700"
                : "bg-white border-violet-200"
            }`}>
            <div className="flex justify-between items-center mb-3">
              <h2 className={`text-xl font-semibold tracking-wide ${
                  darkMode ? "text-purple-300" : "text-pink-600"
                }`}>
                  Liste des Commandes</h2>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-md ${
                  darkMode ? "bg-purple-600" : "bg-pink-500"
                }`}>
                {commandesFiltres.length}
              </div>
            </div>
            <div
              className={`block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border ${
                darkMode
                  ? "border-purple-700 bg-[#260044]"
                  : "border-violet-300 bg-violet-50"
              }`}
            >
              <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"} />
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher un client..."
                className={`bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 ${
                  darkMode ? "text-purple-100" : "text-gray-800"
                }`}
              />
            </div>

            <ul className={`space-y-3 max-h-[320px] overflow-y-auto pr-2 ${
                    darkMode ? "scrollbar-dark" : ""
                  }`}>
              {commandesFiltres.map((c, i) => {
                const client = clients.find(client => client.id === c.idClient);
                return (
                  <li
                    key={c.id}
                     className={`rounded-lg p-4 transition-all text-sm space-y-1 relative border ${
                      darkMode
                        ? "bg-[#1a0536] border-gray-700 hover:bg-[#0a0536]  text-purple-100"
                        : "bg-violet-50/50 border-violet-200 hover:bg-violet-100 text-gray-800"
                    }`}>
                    <p>
                      <strong>Client:</strong> {client ? `${client.nom} (${client.telephone})` : "Inconnu"}
                    </p>
                    <p><strong>Commande:</strong> {formatDateInput(c.dateCommande)}</p>
                    <p><strong>Réalisation:</strong> {formatDateInput(c.dateRealisation)}</p>
                    <p><strong>Livraison:</strong> {formatDateInput(c.dateLivraison)}</p>
                    <div className="absolute top-1 right-1 flex gap-1">
                      {indexModification === i ? (
                        <button onClick={annulerModification} title="Annuler">
                          <X size={14} className="text-red-500 hover:scale-110" />
                        </button>
                      ) : (
                        <button onClick={() => modifierCommande(i)} title="Modifier">
                          <Edit size={14} className="hover:text-pink-600" />
                        </button>
                      )}
                      <button onClick={() => supprimerCommande(i)} title="Supprimer">
                        <Trash2 size={14} className="hover:text-pink-600" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Commandes;
