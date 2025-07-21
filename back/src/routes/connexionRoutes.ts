import express from 'express';
import { getConnexions } from '../controllers/connexionController';

const router = express.Router();

router.get('/connexions', getConnexions);

export default router;
