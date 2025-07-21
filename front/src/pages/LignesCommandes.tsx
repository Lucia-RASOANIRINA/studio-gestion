import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Search, Edit, Trash2, Eye, FileText, Box, X} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Select from "react-select";

type LigneCommande = {
  Quantite_services: number;
  Prix_unitaire: number;
  Num_services: number;
  Id_Commandes: number;
  Total?: number;
};

type Commande = {
  id: number;
  dateCommande: string;
  nomClient: string;
};

type Service = {
  id: number;
  titre: string;
  type: string;
  unite: string;
};

type Studio = {
  Id_Studio: number;
  Adresse: string;
  Ville: string;
  Code_Postale: number;
  Contact: string;
  Nif: number;
  Stat: number;
  Responsable: string;
};

// Composant facture imprimable (format simplifié, adapte selon besoin)
const FactureImprimable = React.forwardRef<
  HTMLDivElement,
  {
    commande: Commande;
    lignesDetails: {
      description: string;
      unite: string;
      quantite: number;
      prix: number;
      montant: number;
    }[];
    total: number;
    studio: Studio;
  }
>(({ commande, lignesDetails, total, studio }, ref) => {
  const today = new Date().toLocaleDateString();
  const dateCommande = new Date(commande.dateCommande).toLocaleDateString();

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, sans-serif",
        padding: 30,
        width: 700,
        margin: "0 auto",
        color: "#000",
      }}
    >
      {/* Logo seul, aligné à gauche */}
      <div style={{ marginBottom: 20, textAlign: "left" }}>
        <img src="/facture.png" alt="Logo" style={{ maxHeight:60, maxWidth: 150, height: "auto", width: "auto"}} />
      </div>

      {/* Ligne avec coordonnées studio à gauche, infos facture à droite */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        {/* Coordonnées studio */}
        <div style={{ flex: 1, textAlign: "left" }}>
          <p style={{ margin: 1 }}>{studio.Adresse}</p>
          <p style={{ margin: 1 }}>
            {studio.Ville} {studio.Code_Postale}
          </p>
          <p style={{ margin: 1 }}>Tél : {studio.Contact}</p>
          <p style={{ margin: 1 }}>NIF: {studio.Nif} </p>
          <p style={{ margin: 1 }}>STAT: {studio.Stat}
          </p>
        </div>

        {/* Infos facture */}
        <div style={{ flex: 1, textAlign: "right" }}>
          <p style={{ margin: 1 }}>
            <strong>Facture n° :</strong> {commande.id.toString().padStart(5, "0")}
          </p>
          <p style={{ margin: 1 }}>
            <strong>Date de facturation :</strong> {today}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Date de commande :</strong> {dateCommande}
          </p>
        </div>
      </div>

      {/* Infos client au-dessus du tableau, aligné à droite */}
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <p style={{ margin: 0 }}>
          <strong>Client :</strong> {commande.nomClient}
        </p>
      </div>

      {/* Tableau des détails */}
      <table style={{ width: "100%", borderCollapse: "collapse" }} border={1}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Description</th>
            <th>Unité</th>
            <th>Quantité</th>
            <th>Prix unitaire (Ar)</th>
            <th>Montant (Ar)</th>
          </tr>
        </thead>
        <tbody>
          {lignesDetails.map((l, i) => (
            <tr key={i}>
              <td style={{ padding: 5 }}>{l.description}</td>
              <td style={{ textAlign: "center" }}>{l.unite}</td>
              <td style={{ textAlign: "center" }}>{l.quantite}</td>
              <td style={{ textAlign: "right", padding: "0 5px" }}>
                {l.prix.toLocaleString()}
              </td>
              <td style={{ textAlign: "right", padding: "0 5px" }}>
                {l.montant.toLocaleString()}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: "bold" }}>
            <td colSpan={4} style={{ textAlign: "right", padding: 5 }}>
              TOTAL
            </td>
            <td style={{ textAlign: "right", padding: 5  }}>
              {total.toLocaleString()} Ariary
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature */}
      <div style={{ marginTop: 60, textAlign: "right" }}>
        <p>{studio.Responsable}, Gérant</p>
        <p style={{ marginTop: 10 }}>Signature</p>
      </div>
    </div>
  );
});

const LigneCommandes = () => {
  const [ligneCommande, setLigneCommande] = useState<LigneCommande>({
    Quantite_services: 0,
    Prix_unitaire: 0,
    Num_services: 0,
    Id_Commandes: 0,
  });

  const [ligneCommandes, setLigneCommandes] = useState<LigneCommande[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [indexModification, setIndexModification] = useState<number | null>(null);
  const [termeRecherche, setTermeRecherche] = useState(""); 
  const [termeRechercheFacture, setTermeRechercheFacture] = useState(""); 
  const [darkMode, setDarkMode] = useState(false);
  
    useEffect(() => {
      const storedMode = localStorage.getItem("darkMode");
      setDarkMode(storedMode === "true");
    }, []);

  // Etat facture active pour impression
  const [factureActive, setFactureActive] = useState<null | {
    commande: Commande;
    lignesDetails: {
      description: string;
      unite: string;
      quantite: number;
      prix: number;
      montant: number;
    }[];
    total: number;
  }>(null);

  const factureRef = useRef<HTMLDivElement>(null);

  // Impression via react-to-print
  const handlePrint = useReactToPrint({
    contentRef: factureRef,
  });

  const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  // Imprime dès que factureActive est défini
  useEffect(() => {
    if (factureActive) {
      handlePrint();
    }
  }, [factureActive, handlePrint]);

  useEffect(() => {
    chargerCommandes();
    chargerServices();
    chargerLigneCommandes();
    chargerStudio();
  }, []);

  const chargerCommandes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/commandes");
      setCommandes(res.data);
    } catch (err) {
      console.error("Erreur chargement commandes :", err);
    }
  };

  const [studio, setStudio] = useState<Studio | null>(null);

  const chargerStudio = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/studio");
    setStudio(res.data);
  } catch (err) {
    console.error("Erreur chargement studio :", err);
  }
};

  const chargerServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Erreur chargement services :", err);
    }
  };

  const chargerLigneCommandes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ligne_commandes");
      setLigneCommandes(res.data);
    } catch (err) {
      console.error("Erreur chargement lignes commandes :", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLigneCommande({ ...ligneCommande, [name]: Number(value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...ligneCommande,
      Quantite_services: Number(ligneCommande.Quantite_services),
      Prix_unitaire: Number(ligneCommande.Prix_unitaire),
    };

    try {
      if (indexModification !== null) {
        const ligne = ligneCommandes[indexModification];
        await axios.put(
          `http://localhost:5000/api/ligne_commandes/${ligne.Id_Commandes}/${ligne.Num_services}`,
          payload
        );
        const updated = [...ligneCommandes];
        updated[indexModification] = payload;
        setLigneCommandes(updated);
        setIndexModification(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/ligne_commandes", payload);
        setLigneCommandes([...ligneCommandes, res.data]);
      }

      setLigneCommande({
        Quantite_services: 0,
        Prix_unitaire: 0,
        Num_services: 0,
        Id_Commandes: 0,
      });
    } catch (err) {
      console.error("Erreur :", err);
      alert("Erreur d'enregistrement.");
    }
  };

  const modifierLigne = (index: number) => {
    const ligne = ligneCommandes[index];
    setLigneCommande({ ...ligne });
    setIndexModification(index);
  };

  const supprimerLigne = async (index: number) => {
    const ligne = ligneCommandes[index];
    if (!window.confirm("Supprimer cette ligne ?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/ligne_commandes/${ligne.Id_Commandes}/${ligne.Num_services}`
      );
      setLigneCommandes(ligneCommandes.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression.");
    }
  };

  // Filtre lignes selon termeRecherche (sur lignes de commandes)
  const lignesFiltres = ligneCommandes.filter((l) => {
    const terme = termeRecherche.toLowerCase();
    const nomService =
      services.find((s) => s.id === l.Num_services)?.titre.toLowerCase() ?? "";

    return (
      l.Id_Commandes.toString().includes(terme) ||
      l.Num_services.toString().includes(terme) ||
      (l.Total?.toString() ?? "").includes(terme) ||
      l.Prix_unitaire.toString().includes(terme) ||
      l.Quantite_services.toString().includes(terme) ||
      nomService.includes(terme)
    );
  });

  // Construire liste commandes avec lignes filtrées
    const commandesAvecLignes = commandes
    .map((commande) => {
      const lignes = lignesFiltres.filter((l) => l.Id_Commandes === commande.id);
      const lignesDetails = lignes.map((l) => {
        const s = services.find((srv) => srv.id === l.Num_services);
        const montant = l.Quantite_services * l.Prix_unitaire;
        return {
          description: s?.titre || "Inconnu",
          unite: s?.unite || "-",
          quantite: l.Quantite_services,
          prix: l.Prix_unitaire,
          montant,
        };
      });
      const total = lignesDetails.reduce((sum, l) => sum + l.montant, 0);
      return { commande, lignesDetails, total };
    })
    .filter((c) => c.lignesDetails.length > 0)
    .sort(
      (a, b) =>
        new Date(b.commande.dateCommande).getTime() -
        new Date(a.commande.dateCommande).getTime()
    );

  // Filtrer les factures selon termeRechercheFacture
  const commandesFiltres = commandesAvecLignes.filter(({ commande, total, lignesDetails }) => {
  const terme = normalize(termeRechercheFacture);

  const contenuGlobal = normalize(
    `${commande.id} ${commande.nomClient} ${new Date(commande.dateCommande).toLocaleDateString()} ${total} ` +
    lignesDetails.map(l => `${l.description} ${l.unite} ${l.quantite} ${l.prix} ${l.montant}`).join(" ")
  );

  return contenuGlobal.includes(terme);
});

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-gray-100"
          : "bg-gradient-to-r from-[#e6e6ff] via-[#fdd6ff] to-[#ffff] text-black border-pink-200/50"
      }`}>
      <Navbar />
      <main className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold text-pink-500 drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des Lignes de Commande
          </h1>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 w-full md:w-[300px]">
            <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"}/>
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher..."
              className={`bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 ${
                darkMode ? "text-purple-100" : "text-gray-800"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className={`p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015] h-full transition-colors duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border border-gray-700 text-white"
              : "bg-white border border-violet-200 text-black"
          }`}
          >
            <h2 className={`text-xl font-semibold text-center tracking-wide ${
                  darkMode ? "text-purple-300" : "text-pink-600"
                }`}>
              {indexModification !== null ? "Modifier Ligne" : "Ajouter Ligne"}
            </h2>

            {/* Select Service */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              <Box size={18} />
            </div>
            <Select
              options={services.map((s) => ({ value: s.id, label: `${s.titre} (${s.type})`, }))}
              value={services.find((s) => s.id === ligneCommande.Num_services) ? {
                value: ligneCommande.Num_services,
                label: services.find((s) => s.id === ligneCommande.Num_services)?.titre || ""
              } : null}
              onChange={(selected) =>
                setLigneCommande({ ...ligneCommande, Num_services: selected?.value || 0 })
              }
              placeholder="Sélectionner un service"
              isClearable
              classNamePrefix="react-select"
              styles={{
              control: (base) => ({
                ...base,
                paddingLeft: "2.2rem",
                borderRadius: "9999px",
                borderColor: darkMode ? "#6d28d9" : "#c4b5fd",
                backgroundColor: darkMode ? "#2e1065" : "#f5f3ff",
                color: darkMode ? "#fff" : "#000",
                fontSize: "0.875rem",
                minHeight: "40px",
                boxShadow: "none",
              }),
              singleValue: (base) => ({
                ...base,
                color: darkMode ? "#fff" : "#000",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: darkMode ? "#2a2a3d" : "#fff",
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
                color: darkMode ? "#fff" : "#000",
              }),
            }}
            />
          </div>

            {/* Select Commande */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                <FileText size={18} />
              </div>
              <Select
                options={commandes.map((c) => ({
                  value: c.id,
                  label: `#${c.id} - ${c.nomClient} - ${new Date(c.dateCommande).toLocaleDateString()}`,
                }))}
                value={commandes.find((c) => c.id === ligneCommande.Id_Commandes) ? {
                  value: ligneCommande.Id_Commandes,
                  label: `#${ligneCommande.Id_Commandes} - ${commandes.find((c) => c.id === ligneCommande.Id_Commandes)?.nomClient} - ${new Date(commandes.find((c) => c.id === ligneCommande.Id_Commandes)?.dateCommande || "").toLocaleDateString()}`,
                } : null}
                onChange={(selected) =>
                  setLigneCommande({ ...ligneCommande, Id_Commandes: selected?.value || 0 })
                }
                placeholder="Sélectionner une commande"
                isClearable
                classNamePrefix="react-select"
                styles={{
                control: (base) => ({
                  ...base,
                  paddingLeft: "2.2rem",
                  borderRadius: "9999px",
                  borderColor: darkMode ? "#6d28d9" : "#c4b5fd",
                  backgroundColor: darkMode ? "#2e1065" : "#f5f3ff",
                  color: darkMode ? "#fff" : "#000",
                  fontSize: "0.875rem",
                  minHeight: "40px",
                  boxShadow: "none",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: darkMode ? "#fff" : "#000",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: darkMode ? "#2a2a3d" : "#fff",
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
                  color: darkMode ? "#fff" : "#000",
                }),
              }}
              />
            </div>

            <input
              type="number"
              name="Quantite_services"
              value={ligneCommande.Quantite_services || ""}
              onChange={handleChange}
              min={1}
              placeholder="Quantité"
              className={`w-full px-4 py-2 rounded-full border shadow-sm focus:ring-2 ${
                darkMode
                  ? "bg-[#2e1065] text-white border-gray-600 placeholder-gray-400 focus:ring-pink-400"
                  : "bg-white text-black border-violet-300 placeholder-violet-400 focus:ring-pink-300"
              }`}
              required
            />

            <input
              type="number"
              name="Prix_unitaire"
              value={ligneCommande.Prix_unitaire || ""}
              onChange={handleChange}
              min={0}
              placeholder="Prix unitaire"
              className={`w-full px-4 py-2 rounded-full border shadow-sm focus:ring-2 ${
                darkMode
                  ? "bg-[#2e1065] text-white border-gray-600 placeholder-gray-400 focus:ring-pink-400"
                  : "bg-white text-black border-violet-300 placeholder-violet-400 focus:ring-pink-300"
              }`}
              required
            />

            <button
              type="submit"
              className={`w-full py-2 font-semibold rounded-full shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300 ${
                darkMode
                  ? "bg-gradient-to-r from-purple-800 to-purple-900 text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  : "bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
              }`}>
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          {/* LISTE DES LIGNES */}
          <div
              className={`${
                darkMode
                  ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border border-gray-700 text-white"
                  : "bg-white border-violet-200 text-gray-900"
              } border p-6 rounded-2xl shadow-xl`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-purple-300" : "text-pink-600"
                  }`}
                >
                  Liste des Lignes
                </h2>
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-md ${
                  darkMode ? "bg-purple-600" : "bg-pink-500"
                }`}
                >
                  {lignesFiltres.length}
                </span>
              </div>

              {/* Barre de recherche visible uniquement sur mobile dans la liste */}
              <div
                className={`block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border ${
                  darkMode
                    ? "border-violet-500 bg-violet-700"
                    : "border-violet-300 bg-violet-50"
                } focus-within:ring-2 focus-within:ring-violet-400 transition w-full`}
              >
                <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"}/>
                <input
                  type="text"
                  value={termeRecherche}
                  onChange={(e) => setTermeRecherche(e.target.value)}
                  placeholder="Rechercher..."
                  className={`bg-transparent border-none outline-none w-full text-sm ${
                    darkMode ? "placeholder-gray-300 text-white" : "text-gray-900"
                  }`}
                  aria-label="Rechercher dans les lignes"
                />
              </div>

              {lignesFiltres.length === 0 ? (
                <p className={`italic ${
                  darkMode ? "text-violet-300" : "text-violet-500"
                }`}>Aucune ligne trouvée.</p>
              ) : (
                <ul  className={`space-y-3 max-h-[300px] overflow-y-auto pr-2 ${
                    darkMode ? "scrollbar-dark" : ""
                  }`}>
                  {lignesFiltres.map((l, i) => {
                    const nomService =
                      services.find((s) => s.id === l.Num_services)?.titre || `#${l.Num_services}`;
                    return (
                      <li
                        key={`${l.Id_Commandes}-${l.Num_services}`}
                        className={`rounded-lg p-4 transition-all text-sm space-y-1 relative border ${
                      darkMode
                        ? "bg-[#1a0536] border-gray-700 hover:bg-[#0a0536]  text-purple-100"
                        : "bg-violet-50/50 border-violet-200 hover:bg-violet-100 text-gray-800"
                    }`}
                      >
                        <p>
                          <strong>Commande:</strong> #{l.Id_Commandes}
                        </p>
                        <p>
                          <strong>Service:</strong> {nomService}
                        </p>
                        <p>
                          <strong>Quantité:</strong> {l.Quantite_services}
                        </p>
                        <p>
                          <strong>Prix unitaire:</strong> {l.Prix_unitaire.toLocaleString()} Ar
                        </p>
                        <p>
                          <strong>Total:</strong>{" "}
                          {(l.Quantite_services * l.Prix_unitaire).toLocaleString()} Ar
                        </p>

                        <div className="absolute top-2 right-2 flex gap-2">
                          {indexModification === i ? (
                          <button
                            onClick={() => {
                              setIndexModification(null);
                              setLigneCommande({
                                Quantite_services: 0,
                                Prix_unitaire: 0,
                                Num_services: 0,
                                Id_Commandes: 0,
                              });
                            }}
                            className="hover:text-red-500 hover:scale-110 transition-transform"
                            title="Annuler modification"
                          >
                            <X size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => modifierLigne(i)}
                            className="hover:text-pink-600 hover:scale-110 transition-transform"
                            title="Modifier ligne"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                          <button
                            onClick={() => supprimerLigne(i)}
                            className="hover:text-pink-600 hover:scale-110 transition-transform"
                            title="Supprimer ligne"
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

        {/* FACTURES FILTRÉES */}
        <div className="space-y-10 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-2 gap-3">
            <h2 className="text-2xl font-bold text-pink-600">Factures</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-300 w-full max-w-xs">
              <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"}/>
              <input
                type="text"
                value={termeRechercheFacture}
                onChange={(e) => setTermeRechercheFacture(e.target.value)}
                placeholder="Rechercher une facture ..."
                className={`bg-transparent border-none outline-none w-full text-sm ${
                  darkMode ? "text-white placeholder-gray-300" : "text-gray-800"
                }`}
              />
            </div>
          </div>

          {commandesFiltres.length === 0 ? (
            <p className="text-center italic text-violet-500">Aucune facture à afficher.</p>
          ) : (
            commandesFiltres.map(({ commande, lignesDetails, total }) => (
              <div
                key={commande.id}
                className={`p-6 rounded-xl shadow border ${
                  darkMode
                    ? "border-purple-700 bg-gradient-to-r from-[#4a00e0] via-[#000] to-[#1a0536] text-white border-gray-600"
                    : "bg-white text-black border-violet-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <h3 className="text-lg font-semibold text-pink-600">
                    Commande #{commande.id} – {commande.nomClient} –{" "}
                    {new Date(commande.dateCommande).toLocaleDateString()}
                  </h3>
                  <button
                    onClick={() => setFactureActive({ commande, lignesDetails, total })}
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded-full transition duration-300 ${
                      darkMode
                        ? "text-purple-300 hover:text-white"
                        : "text-pink-600 hover:text-fuchsia-600"
                    }`}
                    aria-label={`Imprimer et voir la facture commande ${commande.id}`}
                  >
                    <Eye size={18} />
                    <span className="hidden group-hover:inline text-sm font-medium">Voir & Imprimer</span>
                  </button>
                </div>

                {/* Conteneur scrollable horizontal pour la table sur petit écran */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-collapse min-w-[600px] sm:min-w-full">
                    <thead className={darkMode ? "bg-[#0a0536]  text-white" : "bg-gray-100 text-black"}>
                      <tr>
                        <th className="border px-3 py-2 text-left whitespace-nowrap">
                          Description
                        </th>
                        <th className="border px-3 py-2 text-center whitespace-nowrap">Unité</th>
                        <th className="border px-3 py-2 text-center whitespace-nowrap">Quantité</th>
                        <th className="border px-3 py-2 text-right whitespace-nowrap">
                          Prix unitaire (Ar)
                        </th>
                        <th className="border px-3 py-2 text-right whitespace-nowrap">
                          Montant (Ar)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lignesDetails.map((l, i) => (
                        <tr key={i} className={darkMode ? "hover:bg-[#0a0536]" : "hover:bg-gray-50"}>
                          <td className="border px-3 py-1">{l.description}</td>
                          <td className="border px-3 py-1 text-center">{l.unite}</td>
                          <td className="border px-3 py-1 text-center">{l.quantite}</td>
                          <td className="border px-3 py-1 text-right">
                            {l.prix.toLocaleString()}
                          </td>
                          <td className="border px-3 py-1 text-right">
                            {l.montant.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4} className="border px-3 py-2 text-right">
                          TOTAL
                        </td>
                        <td className="border px-3 py-2 text-right text-pink-600">
                          {total.toLocaleString()} Ar
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FACTURE À IMPRIMER (hors écran, toujours dans le DOM) */}
        <div style={{ position: "absolute", left: "-10000px", top: 0 }}>
          {factureActive && studio && (
            <FactureImprimable
              ref={factureRef}
              commande={factureActive.commande}
              lignesDetails={factureActive.lignesDetails}
              total={factureActive.total}
              studio={studio}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default LigneCommandes;
