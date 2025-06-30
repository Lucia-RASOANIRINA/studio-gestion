import Navbar from '../components/Navbar';

const Services = () => {
  return (
    <div >
      {/* Le navbar */}
      <Navbar />
      <main className="pt-20 p-6"> {/* pt-20 pour laisser de l'espace sous la navbar */}
      <h1 className="text-3xl font-bold mb-4 ">Bienvenue au studio</h1>
      <p className="text-gray-600">Gérez vos enregistrements, clients, et services.</p>
        {/* Ton contenu ici */}
      </main>
    </div>
  );
};

export default Services;
