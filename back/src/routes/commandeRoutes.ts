import express from 'express';
import {
  getCommandes,
  createCommande,
  deleteCommande,
  updateCommande
} from "../controllers/commandeController";

const router = express.Router();

router.get('/commandes', getCommandes);
router.post('/commandes', createCommande);
router.delete('/commandes/:id', deleteCommande);
router.put('/commandes/:id', updateCommande);

export default router;