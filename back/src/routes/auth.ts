import { Router } from 'express';
import { login, changerMotDePasse } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/changerMotDePasse', changerMotDePasse);

export default router;
