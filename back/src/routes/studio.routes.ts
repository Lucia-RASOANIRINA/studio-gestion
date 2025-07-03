import { Router } from 'express';
import { getStudioInfo } from '../controllers/studio.controllers';

const router = Router();

router.get('/studio', getStudioInfo);

export default router;
