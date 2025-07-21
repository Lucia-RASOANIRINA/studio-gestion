import { Request, Response } from 'express';
import { db } from '../config/db';
import jwt from 'jsonwebtoken';
import geoip from 'geoip-lite';
import useragent from 'useragent';

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

    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp.toString().split(',')[0].trim();
    const agent = useragent.parse(req.headers['user-agent'] || '');
    const device = `${agent.os} - ${agent.toAgent()}`;
    
    let location: string;
    if (/^(::1|127\.0\.0\.1|::ffff:127\.0\.0\.1)$/.test(ip)) {
      location = 'Localhost, Dev';
    } else {
      const geo = geoip.lookup(ip);
      location = geo && (geo.city || geo.country)
        ? `${geo.city || 'Ville inconnue'}, ${geo.country || 'Pays inconnu'}`
        : 'Inconnue';
    }

    if (!user) {
      // Tentative échouée : email non trouvé
      await db.execute(
        `INSERT INTO connexions (Num_Utilisateurs, ip, device, location, success)
         VALUES (?, ?, ?, ?, ?)`,
        [null, ip.toString(), device, location, false]
      );
      res.status(401).json({ message: 'Utilisateur inconnu' });
      return;
    }

    const valid = password === user.Mot_de_passe;

    if (!valid) {
      // Tentative échouée : mot de passe incorrect
      await db.execute(
        `INSERT INTO connexions (Num_Utilisateurs, ip, device, location, success)
         VALUES (?, ?, ?, ?, ?)`,
        [user.Num_Utilisateurs, ip.toString(), device, location, false]
      );
      res.status(401).json({ message: 'Mot de passe incorrect' });
      return;
    }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Clé secrète JWT non définie' });
      return;
    }

    // Connexion réussie, on enregistre aussi
    await db.execute(
      `INSERT INTO connexions (Num_Utilisateurs, ip, device, location, success)
       VALUES (?, ?, ?, ?, ?)`,
      [user.Num_Utilisateurs, ip.toString(), device, location, true]
    );

    const token = jwt.sign(
      { id: user.Num_Utilisateurs, email: user.Email_Utilisateurs },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: `Bienvenue ${user.Nom_Utilisateurs}`, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const changerMotDePasse = async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token manquant ou invalide' });
    return;
  }

  const token = authHeader.split(' ')[1];
  let utilisateurEmailToken: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
    utilisateurEmailToken = decoded.email;
  } catch (err) {
    res.status(401).json({ message: 'Token invalide' });
    return;
  }

  const { email, nouveau } = req.body;

  if (!email || !nouveau) {
    res.status(400).json({ message: 'Email et nouveau mot de passe requis.' });
    return;
  }

  if (email !== utilisateurEmailToken) {
    res.status(403).json({ message: 'Email incorrect ou ne correspond pas au token.' });
    return;
  }

  try {
    const [rows] = await db.execute(
      'SELECT * FROM Utilisateurs WHERE Email_Utilisateurs = ?',
      [email]
    );

    const user = Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;

    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé.' });
      return;
    }

    await db.execute(
      'UPDATE Utilisateurs SET Mot_de_passe = ? WHERE Email_Utilisateurs = ?',
      [nouveau, email]
    );

    res.json({ message: 'Mot de passe changé avec succès.' });
  } catch (error) {
    console.error('Erreur changement mot de passe :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
