import express from 'express';
import { getRecettes } from '../controllers/statistiquesController';

const router = express.Router();

router.get('/recettes', getRecettes);

export default router;