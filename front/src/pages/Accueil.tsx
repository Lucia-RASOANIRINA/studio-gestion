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

const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const Accueil = () => {
  const currentYear = new Date().getFullYear();
  const [recettes, setRecettes] = useState<Recette[]>([]);
  const [anneeFiltre, setAnneeFiltre] = useState<number | "all">(currentYear);
  const [recherche, setRecherche] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    setDarkMode(storedMode === "true");
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/recettes")
      .then((res) => {
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

  const recettesFiltrees =
    anneeFiltre === "all"
      ? recettes
      : recettes.filter((r) => r.annee === anneeFiltre);

  const recettesRecherchees = recettesFiltrees.filter((r) => {
    const search = normalize(recherche);
    const combined = normalize(`${moisNom[r.mois]} ${r.annee} ${r.recette}`);
    return combined.includes(search);
  });

  const recetteAnnuelle = recettesRecherchees.reduce(
    (total, r) => total + r.recette,
    0
  );

  const recettesTriees = [...recettesRecherchees].sort((a, b) => {
    if (a.annee !== b.annee) return a.annee - b.annee;
    return a.mois - b.mois;
  });

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-gray-100"
          : "bg-gradient-to-r from-[#e6e6ff] via-[#fdd6ff] to-[#ffff] text-black border-pink-200/50"
      }`}
    >
      <Navbar />
      <main
        className={`pt-20 px-6 md:px-12 min-h-screen transition-colors duration-500`}
      >
        {/* Filtres */}
        <div
          className={`p-5 rounded-3xl shadow-lg mb-8 border ${
            darkMode
              ? "border-purple-600 bg-[#1a0536] "
              : "bg-gradient-to-r from-[#ffff] via-[#fff0fa] to-[#e6e6ff]"
          }`}
        >
          <h2
            className={`text-xl font-bold  mb-6 tracking-wide ${
              darkMode ? "text-purple-300" : "text-[#ec4899]"
            }`}
          >
            Filtrer les recettes
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Filtre année */}
            <select
              value={anneeFiltre}
              onChange={(e) =>
                setAnneeFiltre(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className={`w-full md:w-1/3 rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-4 transition ${
                darkMode
                  ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0]  text-purple-200 focus:ring-purple-500"
                  : "bg-gradient-to-r from-[#faeff9] via-[#faf0aa] to-[#e6e6bf] border border-white text-xm focus:ring-[#e6e6bf]"
              }`}
            >
              <option value="all">Toutes les années</option>
              {anneesDisponibles.map((annee) => (
                <option key={annee} value={annee}>
                  {annee}
                </option>
              ))}
            </select>

            {/* Barre de recherche */}
            <div className="w-full md:w-2/3 relative">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  darkMode ? "text-purple-400" : "text-xm"
                }`}
                size={22}
              />
              <input
                type="text"
                placeholder="Rechercher par mois, année ou montant..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className={`w-full pl-14 pr-4 py-3 rounded-xl font-semibold placeholder-opacity-70 focus:outline-none focus:ring-4 transition ${
                  darkMode
                    ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border border-purple-700 text-purple-200 focus:ring-purple-500"
                    : "bg-gradient-to-r from-[#faeff9] via-[#faf0aa] to-[#e6e6bf]  border border-white text-xm focus:ring-[#e6e6bf]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Total annuel */}
        <div
          className={`mb-8 p-8 rounded-3xl shadow-xl border max-w-full break-words transition-colors duration-500 ${
            darkMode
              ? "border-purple-500 bg-[#1a0536] text-purple-200"
              : "border-[#faf0aa] bg-gradient-to-r from-[#ffff] via-[#fff0fa] to-[#e6e6ff] text-xm"
          }`}
        >
          <h2 className={`text-2xl font-bold tracking-wide ${
                  darkMode ? "text-purple-300" : "text-[#ec4899]"
                }`}>
            Recette annuelle totale
          </h2>
          <p className="text-2xl font-bold drop-shadow-lg whitespace-pre-wrap">
            {recetteAnnuelle.toLocaleString()} Ar
          </p>
        </div>

        {/* Résultats */}
        {recettesTriees.length === 0 ? (
          <p
            className={`text-center text-lg mt-12 italic font-semibold transition-colors duration-500 ${
              darkMode ? "text-purple-300" : "text-pink-400"
            }`}
          >
            Aucune recette trouvée avec les filtres actuels.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recettesTriees.map((r, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border shadow-lg transition-colors duration-500 hover:shadow-2xl ${
                  darkMode
                    ? "border-purple-700 bg-gradient-to-r from-[#4a00e0] via-[#000] to-[#1a0536]"
                    : "border-pink-200 bg-gradient-to-r from-[#e6e6bf] via-[#faf0aa] to-[#faeff9]"
                }`}
              >
                <h3
                  className={`text-2xl font-bold mb-3 tracking-wide ${
                    darkMode ? "text-purple-300" : "text-xm"
                  }`}
                >
                  {moisNom[r.mois]} {r.annee}
                </h3>
                <p
                  className={`text-2xl font-extrabold ${
                    darkMode ? "text-purple-100" : "text-[#ec4899]"
                  }`}
                >
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
