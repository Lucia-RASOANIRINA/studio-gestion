import { Request, Response } from 'express';
import { db } from '../config/db';

export const getRecettes = async (_: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        YEAR(Date_Commandes) AS annee,
        MONTH(Date_Commandes) AS mois,
        SUM(Quantite_services * Prix_unitaire) AS recette
      FROM commandes
      JOIN ligne_commande ON commandes.Id_Commandes = ligne_commande.Id_Commandes
      GROUP BY annee, mois
      ORDER BY annee DESC, mois DESC`
    );

    res.json(rows);
  } catch (err) {
    console.error("Erreur lors de la récupération des recettes :", err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};