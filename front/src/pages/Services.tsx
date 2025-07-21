import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  Search,
  Edit,
  Trash2,
  ClipboardList,
  Layers,
  Box,
  FileText,
  Folder,
  Ruler,
  X,
} from "lucide-react";

type Service = {
  id?: number;
  titre: string;
  type: string;
  unite: string;
};

const Services = () => {
  const [service, setService] = useState<Service>({
    titre: "",
    type: "",
    unite: "",
  });
  const [services, setServices] = useState<Service[]>([]);
  const [indexModification, setIndexModification] = useState<number | null>(null);
  const [termeRecherche, setTermeRecherche] = useState("");
  const [erreurDoublon, setErreurDoublon] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    setDarkMode(storedMode === "true");
  }, []);

  useEffect(() => {
    chargerServices();
  }, []);

  const chargerServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
    setErreurDoublon("");
  };

  const ajouterOuModifierService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.titre || !service.type || !service.unite) {
      setErreurDoublon("Veuillez remplir tous les champs.");
      return;
    }

    const doublonExact = services.some((s, idx) => {
      if (indexModification !== null && idx === indexModification) return false;
      return (
        s.titre.toLowerCase() === service.titre.toLowerCase() &&
        s.type.toLowerCase() === service.type.toLowerCase() &&
        s.unite.toLowerCase() === service.unite.toLowerCase()
      );
    });

    const doublonTitreType = services.some((s, idx) => {
      if (indexModification !== null && idx === indexModification) return false;
      return (
        s.titre.toLowerCase() === service.titre.toLowerCase() &&
        s.type.toLowerCase() === service.type.toLowerCase()
      );
    });

    if (doublonExact) {
      setErreurDoublon("Ce service existe déjà avec ce titre, type et unité.");
      return;
    }

    if (doublonTitreType) {
      setErreurDoublon("Un service avec ce titre et ce type existe déjà.");
      return;
    }

    try {
      if (indexModification !== null) {
        const serviceAModifier = services[indexModification];
        await axios.put(`http://localhost:5000/api/services/${serviceAModifier.id}`, service);
        const nouveaux = [...services];
        nouveaux[indexModification] = { ...service, id: serviceAModifier.id };
        setServices(nouveaux);
        setIndexModification(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/services", service);
        setServices([...services, res.data]);
      }

      setService({ titre: "", type: "", unite: "" });
      setErreurDoublon("");
    } catch (err) {
      console.error("Erreur d’enregistrement :", err);
    }
  };

  const modifierService = (index: number) => {
    setService(services[index]);
    setIndexModification(index);
    setErreurDoublon("");
  };

  const annulerModification = () => {
    setService({ titre: "", type: "", unite: "" });
    setIndexModification(null);
    setErreurDoublon("");
  };

  const supprimerService = async (index: number) => {
    if (!window.confirm("Confirmer la suppression de ce service ?")) return;
    const id = services[index].id;
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      setServices(services.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Erreur de suppression :", err);
    }
  };

  const servicesFiltres = services.filter((s) =>
    Object.values(s).some((val) =>
      val.toString().toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] text-gray-100"
          : "bg-gradient-to-r from-[#e6e6ff] via-[#fdd6ff] to-[#ffff] text-black border-pink-200/50"
      }`}>
      <Navbar />

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-pink-500 drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des Services
          </h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 focus-within:ring-2 focus-within:ring-violet-400 transition w-full md:w-[300px]">
            <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher un service..."
              className={`bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 ${
                darkMode ? "text-purple-100" : "text-gray-800"
              }`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          <form
            onSubmit={ajouterOuModifierService}
            className={`p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015] h-full transition-colors duration-500 ${
            darkMode
              ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border border-gray-700 text-white"
              : "bg-white border border-violet-200 text-black"
          }`}
          >
            <h2 className={`text-xl font-semibold text-center tracking-wide ${
                  darkMode ? "text-purple-300" : "text-pink-600"
                }`}>
              {indexModification !== null ? "Modifier le Service" : "Ajouter un Service"}
            </h2>

            {[
              { icon: <ClipboardList size={18} />, name: "titre", placeholder: "Titre du service" },
              { icon: <Layers size={18} />, name: "type", placeholder: "Type de service" },
              { icon: <Box size={18} />, name: "unite", placeholder: "Unité (heure, forfait, etc.)" },
            ].map(({ icon, name, placeholder }) => (
              <div
                key={name}
               className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-colors ${
                darkMode
                  ? "border-violet-700 bg-violet-990"
                  : "border-violet-300 bg-violet-50"
              }`}>
                {icon}
                <input
                  type="text"
                  name={name}
                  value={service[name as keyof Service]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 ${
                  darkMode ? "text-purple-100" : "text-gray-800"
                }`}
                />
              </div>
            ))}

            {erreurDoublon && (
              <div className="text-red-600 text-sm text-center italic">{erreurDoublon}</div>
            )}

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

          <div className={`p-6 rounded-2xl shadow-xl hover:scale-[1.015] border ${
              darkMode
                ? "bg-gradient-to-r from-[#1a0536] via-[#000] to-[#4a00e0] border-gray-700"
                : "bg-white border-violet-200"
            }`}
            >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold tracking-wide ${
                  darkMode ? "text-purple-300" : "text-pink-600"
                }`}
                >
                Liste des Services
              </h2>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold shadow-md ${
                  darkMode ? "bg-purple-600" : "bg-pink-500"
                }`}
                >
                {servicesFiltres.length}
              </div>
            </div>

            <div className={`block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border ${
                darkMode
                  ? "border-purple-700 bg-[#260044]"
                  : "border-violet-300 bg-violet-50"
              }`}
              >
              <Search size={18} className={darkMode ? "text-purple-300" : "text-violet-700"}/>
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher un service..."
                className={`bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 ${
                  darkMode ? "text-purple-100" : "text-gray-800"
                }`}
                />
            </div>

            {servicesFiltres.length === 0 ? (
              <p className="text-violet-500 italic">Aucun service trouvé.</p>
            ) : (
              <ul className={`space-y-3 max-h-[300px] overflow-y-auto pr-2 ${
                  darkMode ? "scrollbar-dark" : ""
                }`}>
                {servicesFiltres.map((s) => {
                  const idx = services.indexOf(s);
                  return (
                    <li
                      key={s.id}
                      className={`rounded-lg p-4 transition-all text-sm space-y-1 relative border ${
                      darkMode
                        ? "bg-[#1a0536] border-gray-700 hover:bg-[#0a0536] text-purple-100"
                        : "bg-violet-50/50 border-violet-200 hover:bg-violet-100 text-gray-800"
                      }`}
                      >
                      <div className="space-y-2 text-sm ">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className={darkMode ? "text-purple-300" : "text-black"} />
                          <span><strong>Titre :</strong> {s.titre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Folder size={16} className={darkMode ? "text-purple-300" : "text-black"} />
                          <span><strong>Type :</strong> {s.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Ruler size={16} className={darkMode ? "text-purple-300" : "text-black"} />
                          <span><strong>Unité :</strong> {s.unite}</span>
                        </div>
                      </div>

                      <div className="absolute top-2 right-2 flex gap-2">
                        {indexModification === idx ? (
                          <button
                            onClick={annulerModification}
                            className="text-red-500 hover:scale-110"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => modifierService(idx)}
                            className="text-sm-600 hover:text-pink-600 hover:scale-110"
                            title="Modifier"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => supprimerService(idx)}
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

export default Services;
