import { Request, Response } from "express";
import { db } from "../config/db";
import { LigneCommande } from "../models/LigneCommande";
import { RowDataPacket } from "mysql2";

interface LigneCommandeAvecTotal extends LigneCommande {
  Total: number;
}

export const getLignesCommandes = async (_req: Request, res: Response) => {
  const [rows] = await db.query<(LigneCommandeAvecTotal & RowDataPacket)[]>(
    "SELECT *, Total FROM ligne_commande order by Id_commandes desc"
  );
  res.json(rows);
};

export const createLigneCommande = async (req: Request, res: Response) => {
  const { Quantite_services, Prix_unitaire, Num_services, Id_Commandes }: LigneCommande = req.body;

  await db.query(
    `INSERT INTO ligne_commande (Quantite_services, Prix_unitaire, Num_services, Id_Commandes) VALUES (?, ?, ?, ?)`,
    [Quantite_services, Prix_unitaire, Num_services, Id_Commandes]
  );

  const [rows] = await db.query<(LigneCommandeAvecTotal & RowDataPacket)[]>(
    `SELECT *, Total FROM ligne_commande WHERE Id_Commandes = ? AND Num_services = ?`,
    [Id_Commandes, Num_services]
  );

  res.json(rows[0]);
};

export const updateLigneCommande = async (req: Request, res: Response) => {
  const { idCommande, idService } = req.params;
  const { Quantite_services, Prix_unitaire }: LigneCommande = req.body;

  await db.query(
    `UPDATE ligne_commande SET Quantite_services = ?, Prix_unitaire = ? WHERE Id_Commandes = ? AND Num_services = ?`,
    [Quantite_services, Prix_unitaire, idCommande, idService]
  );

  const [rows] = await db.query<(LigneCommandeAvecTotal & RowDataPacket)[]>(
    `SELECT *, Total FROM ligne_commande WHERE Id_Commandes = ? AND Num_services = ?`,
    [idCommande, idService]
  );

  res.json(rows[0]);
};

export const deleteLigneCommande = async (req: Request, res: Response) => {
  const { idCommande, idService } = req.params;

  await db.query(
    `DELETE FROM ligne_commande WHERE Id_Commandes = ? AND Num_services = ?`,
    [idCommande, idService]
  );

  res.json({ message: "Ligne supprimée." });
};
