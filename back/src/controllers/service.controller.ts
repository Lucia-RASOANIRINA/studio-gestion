import { Request, Response } from "express";
import { db } from "../config/db";
import { Service } from "../models/service.model";

export const getServices = async (_req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute("SELECT * FROM services");
    // Mapping pour correspondance front
    const formattedRows: Service[] = rows.map((row: any) => ({
      id: row.Num_services,
      titre: row.Titre_services,
      type: row.Types_services,
      unite: row.Unite_services,
    }));
    res.json(formattedRows);
  } catch (err) {
    console.error("Erreur getServices:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const createService = async (req: Request, res: Response) => {
  const { titre, type, unite } = req.body as Service;
  try {
    const [result]: any = await db.execute(
      "INSERT INTO services (Titre_services, Types_services, Unite_services) VALUES (?, ?, ?)",
      [titre, type, unite]
    );
    const newService: Service = {
      id: result.insertId,
      titre,
      type,
      unite,
    };
    res.status(201).json(newService);
  } catch (err) {
    console.error("Erreur createService:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateService = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { titre, type, unite } = req.body as Service;
  try {
    await db.execute(
      "UPDATE services SET Titre_services = ?, Types_services = ?, Unite_services = ? WHERE Num_services = ?",
      [titre, type, unite, id]
    );
    res.status(200).json({ message: "Service mis à jour" });
  } catch (err) {
    console.error("Erreur updateService:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    await db.execute("DELETE FROM services WHERE Num_services = ?", [id]);
    res.status(200).json({ message: "Service supprimé" });
  } catch (err) {
    console.error("Erreur deleteService:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
