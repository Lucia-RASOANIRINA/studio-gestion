import { Request, Response } from 'express';
import { db } from "../config/db";
import { Commande, LigneCommande } from '../models/Commande';

export const getCommandes = async (_: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.Id_Commandes AS id,
        c.Date_Commandes AS dateCommande,
        c.Date_realisation AS dateRealisation,
        c.Date_livraison AS dateLivraison,
        c.Id_Clients AS idClient,
        cl.Nom_Cli AS nomClient
      FROM commandes c
      JOIN clients cl ON cl.Id_Cli = c.Id_Clients
      ORDER BY c.Date_Commandes DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération commandes' });
  }
};

export const createCommande = async (req: Request, res: Response) => {
  const {
    dateCommande,
    dateRealisation,
    dateLivraison,
    idClient,
    lignes = [],
  }: Commande & { lignes?: LigneCommande[] } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result]: any = await conn.query(
      'INSERT INTO commandes (Date_Commandes, Date_realisation, Date_livraison, Id_Clients) VALUES (?, ?, ?, ?)',
      [dateCommande, dateRealisation, dateLivraison, idClient]
    );

    const commandeId = result.insertId;

    for (const ligne of lignes) {
      await conn.query(
        'INSERT INTO ligne_commande (Id_Commandes, Num_services, Quantite_services, Prix_negocie) VALUES (?, ?, ?, ?)',
        [commandeId, ligne.num_services, ligne.quantite_services, ligne.prix_negocie]
      );
    }

    await conn.commit();
    res.status(201).json({
      id: commandeId,
      dateCommande,
      dateRealisation,
      dateLivraison,
      idClient,
    });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Erreur insertion commande', err });
  } finally {
    conn.release();
  }
};

export const deleteCommande = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM ligne_commande WHERE Id_Commandes = ?', [id]);
    await db.query('DELETE FROM commandes WHERE Id_Commandes = ?', [id]);
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
};

export const updateCommande = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { dateCommande, dateRealisation, dateLivraison, idClient } = req.body;

  try {
    await db.query(
      'UPDATE commandes SET Date_Commandes=?, Date_realisation=?, Date_livraison=?, Id_Clients=? WHERE Id_Commandes=?',
      [dateCommande, dateRealisation, dateLivraison, idClient, id]
    );
    res.json({ message: 'Commande modifiée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur modification' });
  }
};
