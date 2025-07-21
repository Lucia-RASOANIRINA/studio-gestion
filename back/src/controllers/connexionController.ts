import { Request, Response } from 'express';
import { db } from '../config/db';

export const getConnexions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        c.*, 
        COALESCE(u.Nom_Utilisateurs, 'Inconnu') AS nom_utilisateurs
      FROM connexions AS c
      LEFT JOIN Utilisateurs AS u ON c.Num_Utilisateurs = u.Num_Utilisateurs
      ORDER BY c.date_connexion DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erreur récupération connexions :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
