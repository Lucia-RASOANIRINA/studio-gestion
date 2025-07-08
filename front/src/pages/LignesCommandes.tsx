import React, { useState } from 'react';

const Parametres = () => {
  const [ancien, setAncien] = useState('');
  const [nouveau, setNouveau] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (nouveau !== confirmation) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    // À remplacer par une requête à votre API
    alert("Mot de passe modifié avec succès !");
    setAncien('');
    setNouveau('');
    setConfirmation('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold text-[#ec4899] mb-4">Paramètres</h1>

      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">À propos</h2>
        <p className="text-gray-700 text-sm leading-6">
          Merix Studio est une application de gestion simple permettant de gérer les clients,
          services, commandes et plus encore dans un studio ou entreprise.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Changer le mot de passe</h2>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            value={ancien}
            onChange={e => setAncien(e.target.value)}
            placeholder="Ancien mot de passe"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            value={nouveau}
            onChange={e => setNouveau(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            value={confirmation}
            onChange={e => setConfirmation(e.target.value)}
            placeholder="Confirmer le mot de passe"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <button type="submit" className="bg-[#ec4899] text-white px-4 py-2 rounded hover:bg-pink-600">
            Enregistrer
          </button>
        </form>
      </section>
    </div>
  );
};

export default Parametres;
