import { Request, Response } from 'express';
import { db } from '../config/db'; 
import jwt from 'jsonwebtoken';

interface User {
  Num_Utilisateurs: number;
  Nom_Utilisateurs: string;
  Email_Utilisateurs: string;
  Mot_de_passe: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM Utilisateurs WHERE Email_Utilisateurs = ?',
      [email]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? (rows[0] as User) : null;

    if (!user) {
      res.status(401).json({ message: 'Email invalide' });
      return;
    }

    const valid = password === user.Mot_de_passe;
    if (!valid) {
      res.status(401).json({ message: 'Mot de passe incorrect' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Clé secrète JWT non définie' });
      return;
    }

    const token = jwt.sign(
      { id: user.Num_Utilisateurs, email: user.Email_Utilisateurs },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Message personnalisé avec nom utilisateur
    res.json({ message: `Bienvenue ${user.Nom_Utilisateurs}`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
