import { Request, Response } from 'express';
import { db } from '../config/db';

export const getStudioInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.execute('SELECT * FROM studio LIMIT 1');
    if (!Array.isArray(rows) || rows.length === 0) {
      res.status(404).json({ message: 'Aucune information trouvée' });
      return;
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du studio :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
