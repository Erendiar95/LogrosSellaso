import { Router } from 'express';
import { getUserProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/:userId', getUserProfile);

export default router;
