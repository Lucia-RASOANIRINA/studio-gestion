import express from "express";
import {
  getLignesCommandes,
  createLigneCommande,
  updateLigneCommande,
  deleteLigneCommande
} from "../controllers/ligneCommandeController";

const router = express.Router();

router.get("/ligne_commandes", getLignesCommandes);
router.post("/ligne_commandes", createLigneCommande);
router.put("/ligne_commandes/:idCommande/:idService", updateLigneCommande);
router.delete("/ligne_commandes/:idCommande/:idService", deleteLigneCommande);

export default router;
