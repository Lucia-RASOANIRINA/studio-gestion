import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";

export type Recette = {
  annee: number;
  mois: number;
  recette: number;
};

const moisNom = [
  "",
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const Accueil = () => {
  const currentYear = new Date().getFullYear();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [anneeFiltre, setAnneeFiltre] = useState<number | "all">(currentYear);
  const [recherche, setRecherche] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/recettes")
      .then((res) => {
        // Conversion sécurisée pour éviter les "0" en tête
        const recettesNettoyees = res.data.map((r: any) => ({
          ...r,
          recette: Number(r.recette),
        }));
        setRecettes(recettesNettoyees);
      })
      .catch((err) => console.error("Erreur chargement des recettes", err));
  }, []);

  const anneesDisponibles = [];
  for (let y = 2020; y <= currentYear; y++) anneesDisponibles.push(y);

  const recettesFiltrees = anneeFiltre === "all"
    ? recettes
    : recettes.filter((r) => r.annee === anneeFiltre);

  const recettesRecherchees = recettesFiltrees.filter((r) => {
    const search = recherche.toLowerCase();
    return (
      moisNom[r.mois].toLowerCase().includes(search) ||
      r.annee.toString().includes(search) ||
      r.recette.toString().includes(search)
    );
  });

  const recetteAnnuelle = recettesRecherchees.reduce((total, r) => total + r.recette, 0);

  const recettesTriees = [...recettesRecherchees].sort((a, b) => {
    if (a.annee !== b.annee) return a.annee - b.annee;
    return a.mois - b.mois;
  });

  return (
    <div>
      <Navbar />
      <main className="bg-gradient-to-r from-[#fceff9] via-[#fdf6ff] to-[#e6e6ff] pt-20 px-4 md:px-8 min-h-screen">
        {/* Filtres */}
        <div className="p-4 rounded-2xl shadow mb-6 border border-gray-200 bg-white/70 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filtrer les recettes</h2>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Filtre année */}
            <select
              value={anneeFiltre}
              onChange={(e) =>
                setAnneeFiltre(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="w-full md:w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
            >
              <option value="all">Toutes les années</option>
              {anneesDisponibles.map((annee) => (
                <option key={annee} value={annee}>
                  {annee}
                </option>
              ))}
            </select>

            {/* Recherche */}
            <div className="w-full md:w-2/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Rechercher par mois, année ou montant..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Recette annuelle */}
        <div className="mb-6 p-6 rounded-2xl shadow-md border border-pink-200/40 bg-white/90 backdrop-blur max-w-full break-words">
          <h2 className="text-2xl font-bold text-[#ec4899] tracking-wide mb-2">
            Recette annuelle totale
          </h2>
          <p className="text-xl font-extrabold text-gray-900 drop-shadow-sm break-words max-w-full whitespace-pre-wrap">
            {recetteAnnuelle.toLocaleString()} Ar
          </p>
        </div>

        {/* Résultats */}
        {recettesTriees.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-8 italic">
            Aucune recette disponible pour cette année.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recettesTriees.map((r, i) => (
              <div
                key={i}
                className="p-4 bg-white shadow hover:shadow-md rounded-xl border border-gray-200 transition-all duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {moisNom[r.mois]} {r.annee}
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {r.recette.toLocaleString()} Ar
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Accueil;
