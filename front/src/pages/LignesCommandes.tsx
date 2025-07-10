import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Search, Edit, Trash2 } from "lucide-react";

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
};

type Service = {
  id: number;
  titre: string;
  type: string;
  unite: string;
};

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

  useEffect(() => {
    chargerCommandes();
    chargerServices();
    chargerLigneCommandes();
  }, []);

  const chargerCommandes = async () => {
    const res = await axios.get("http://localhost:5000/api/commandes");
    setCommandes(res.data);
  };

  const chargerServices = async () => {
    const res = await axios.get("http://localhost:5000/api/services");
    setServices(res.data);
  };

  const chargerLigneCommandes = async () => {
    const res = await axios.get("http://localhost:5000/api/ligne_commandes");
    setLigneCommandes(res.data);
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

  // ✅ Correction du filtrage
  const lignesFiltres = ligneCommandes.filter((l) => {
    const terme = termeRecherche.toLowerCase();

    const nomService =
      services.find((s) => s.id === l.Num_services)?.titre.toLowerCase() ?? "";

    return (
      l.Id_Commandes.toString().includes(terme) ||
      l.Num_services.toString().includes(terme) ||
      l.Total?.toString().includes(terme) ||
      l.Prix_unitaire.toString().includes(terme) ||
      l.Quantite_services.toString().includes(terme) ||
      nomService.includes(terme)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-violet-50 text-gray-800">
      <Navbar />
      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-pink-500 drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des Lignes de Commande
          </h1>
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 w-full md:w-[300px]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          {/* FORMULAIRE */}
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5"
          >
            <h2 className="text-xl font-semibold text-center text-pink-600">
              {indexModification !== null ? "Modifier Ligne" : "Ajouter Ligne"}
            </h2>

            <select
              name="Num_services"
              value={ligneCommande.Num_services}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-xl border border-violet-300 shadow-sm focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value={0}>-- Sélectionner un service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.titre}
                </option>
              ))}
            </select>

            <select
              name="Id_Commandes"
              value={ligneCommande.Id_Commandes}
              onChange={handleChange}
              className="w-full bg-white px-4 py-3 rounded-xl border border-violet-300 shadow-sm focus:ring-2 focus:ring-pink-300"
              required
            >
              <option value={0}>-- Sélectionner une commande --</option>
              {commandes.map((c) => (
                <option key={c.id} value={c.id}>
                  Commande #{c.id} - {new Date(c.dateCommande).toLocaleDateString()}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="Quantite_services"
              value={ligneCommande.Quantite_services || ""}
              onChange={handleChange}
              min={1}
              placeholder="Quantité"
              className="w-full bg-white px-4 py-3 rounded-xl border border-violet-300 shadow-sm focus:ring-2 focus:ring-pink-300"
              required
            />

            <input
              type="number"
              name="Prix_unitaire"
              value={ligneCommande.Prix_unitaire || ""}
              onChange={handleChange}
              min={0}
              placeholder="Prix unitaire"
              className="w-full bg-white px-4 py-3 rounded-xl border border-violet-300 shadow-sm focus:ring-2 focus:ring-pink-300"
              required
            />

            <button
              type="submit"
              className="w-full py-3 font-semibold rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-400 text-white shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300"
            >
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          {/* LISTE */}
          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-pink-600">Liste des Lignes</h2>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-500 text-white text-sm font-bold">
                {lignesFiltres.length}
              </span>
            </div>

            {lignesFiltres.length === 0 ? (
              <p className="text-violet-500 italic">Aucune ligne trouvée.</p>
            ) : (
              <ul className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {lignesFiltres.map((l, i) => {
                  const nomService =
                    services.find((s) => s.id === l.Num_services)?.titre || `#${l.Num_services}`;
                  return (
                    <li
                      key={`${l.Id_Commandes}-${l.Num_services}`}
                      className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition text-sm relative"
                    >
                      <p><strong>Commande:</strong> #{l.Id_Commandes}</p>
                      <p><strong>Service:</strong> {nomService}</p>
                      <p><strong>Quantité:</strong> {l.Quantite_services}</p>
                      <p><strong>Prix unitaire:</strong> {l.Prix_unitaire.toLocaleString()} Ar</p>
                      <p><strong>Total:</strong> {l.Total?.toLocaleString()} Ar</p>

                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => modifierLigne(i)}
                          className="hover:text-pink-600 hover:scale-110 transition-transform"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => supprimerLigne(i)}
                          className="hover:text-pink-600 hover:scale-110 transition-transform"
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

export default LigneCommandes;
