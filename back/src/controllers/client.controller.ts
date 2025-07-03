import { Request, Response } from "express";
import { db } from "../config/db";
import { Client } from "../models/client.model";

// Récupérer tous les clients avec noms adaptés front
export const getClients = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute("SELECT * FROM clients");

    const formattedRows: Client[] = rows.map((row: any) => ({
      id: row.Id_Cli,
      nom: row.Nom_Cli,
      telephone: row.Telephon_Cli,
      adresse: row.Adresse_Cli,
      email: row.Email_Cli,
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Erreur dans getClients:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer un nouveau client
export const createClient = async (req: Request, res: Response) => {
  const { nom, telephone, adresse, email } = req.body as Client;
  try {
    const [result]: any = await db.execute(
      "INSERT INTO clients (Nom_Cli, Telephon_Cli, Adresse_Cli, Email_Cli) VALUES (?, ?, ?, ?)",
      [nom, telephone, adresse, email]
    );
    const newClient: Client = {
      id: result.insertId,
      nom,
      telephone,
      adresse,
      email,
    };
    res.status(201).json(newClient);
  } catch (err) {
    console.error("Erreur dans createClient:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Mettre à jour un client
export const updateClient = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { nom, telephone, adresse, email } = req.body as Client;
  try {
    await db.execute(
      "UPDATE clients SET Nom_Cli = ?, Telephon_Cli = ?, Adresse_Cli = ?, Email_Cli = ? WHERE Id_Cli = ?",
      [nom, telephone, adresse, email, id]
    );
    res.status(200).json({ message: "Client mis à jour" });
  } catch (err) {
    console.error("Erreur dans updateClient:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un client
export const deleteClient = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await db.execute("DELETE FROM clients WHERE Id_Cli = ?", [id]);
    res.status(200).json({ message: "Client supprimé" });
  } catch (err) {
    console.error("Erreur dans deleteClient:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
