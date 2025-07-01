import { useState } from "react";
import Navbar from "../components/Navbar";
import { Search, Edit, Trash2, ClipboardList, Layers, Box } from "lucide-react";

type Service = {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const ajouterOuModifierService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.titre || !service.type || !service.unite) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (indexModification !== null) {
      const nouveaux = [...services];
      nouveaux[indexModification] = service;
      setServices(nouveaux);
      setIndexModification(null);
    } else {
      setServices([...services, service]);
    }

    setService({ titre: "", type: "", unite: "" });
  };

  const modifierService = (index: number) => {
    setService(services[index]);
    setIndexModification(index);
  };

  const supprimerService = (index: number) => {
    if (window.confirm("Confirmer la suppression de ce service ?")) {
      const restants = services.filter((_, i) => i !== index);
      setServices(restants);
    }
  };

  const servicesFiltres = services.filter((s) =>
    Object.values(s).some((val) =>
      val.toLowerCase().includes(termeRecherche.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-violet-50 text-gray-800">
      <Navbar />

      <main className="pt-24 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-pink-600 drop-shadow-md hover:scale-105 transition duration-300">
            Gestion des Services
          </h1>

          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full md:w-[300px]">
            <Search size={18} />
            <input
              type="text"
              value={termeRecherche}
              onChange={(e) => setTermeRecherche(e.target.value)}
              placeholder="Rechercher un service..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
          {/* Formulaire d'ajout/modif */}
          <form
            onSubmit={ajouterOuModifierService}
            className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl space-y-5 backdrop-blur-md hover:scale-[1.015]"
          >
            <h2 className="text-2xl font-bold text-center tracking-wide text-pink-600">
              {indexModification !== null ? "Modifier le Service" : "Ajouter un Service"}
            </h2>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <ClipboardList size={18} />
              <input
                type="text"
                name="titre"
                value={service.titre}
                onChange={handleChange}
                placeholder="Titre du service"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <Layers size={18} />
              <input
                type="text"
                name="type"
                value={service.type}
                onChange={handleChange}
                placeholder="Type de service"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition">
              <Box size={18} />
              <input
                type="text"
                name="unite"
                value={service.unite}
                onChange={handleChange}
                placeholder="Unité (heure, forfait, etc.)"
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-fuchsia-300 text-black shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
            >
              {indexModification !== null ? "Modifier" : "Ajouter"}
            </button>
          </form>

          {/* Liste des services */}
          <div className="bg-white border border-violet-200 p-6 rounded-2xl shadow-xl backdrop-blur-md hover:scale-[1.015]">
            <h2 className="text-2xl font-bold text-center tracking-wide text-pink-600 mb-4">
              Liste des Services
            </h2>

            <div className="block md:hidden flex items-center gap-3 mb-4 px-4 py-2 rounded-full border border-violet-300 bg-violet-50 focus-within:ring-2 focus-within:ring-violet-400 transition w-full">
              <Search size={18} />
              <input
                type="text"
                value={termeRecherche}
                onChange={(e) => setTermeRecherche(e.target.value)}
                placeholder="Rechercher un service..."
                className="bg-transparent border-none outline-none w-full text-sm placeholder-violet-400 text-gray-800"
              />
            </div>

            {servicesFiltres.length === 0 ? (
              <p className="text-violet-500 italic">Aucun service trouvé.</p>
            ) : (
              <ul className="space-y-3 max-h-[340px] overflow-y-auto pr-2">
                {servicesFiltres.map((s, index) => (
                  <li
                    key={index}
                    className="border border-violet-200 rounded-lg p-4 bg-violet-50/50 hover:bg-violet-100 transition-all text-sm space-y-1 relative"
                  >
                    <p><strong>📝 Titre:</strong> {s.titre}</p>
                    <p><strong>📂 Type:</strong> {s.type}</p>
                    <p><strong>📏 Unité:</strong> {s.unite}</p>

                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => modifierService(index)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => supprimerService(index)}
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

export default Services;
