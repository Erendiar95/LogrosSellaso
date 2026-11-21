import { Router } from 'express';
import {
  getFeed,
  createAchievement,
  getAchievementById,
  deleteAchievement,
} from '../controllers/achievementsController.js';
import { toggleReaction } from '../controllers/reactionsController.js';
import { addComment, deleteComment } from '../controllers/commentsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.use(authenticateToken);

// Logros & Feed
router.get('/feed', getFeed);
router.post('/', upload.single('image'), createAchievement);
router.get('/:id', getAchievementById);
router.delete('/:id', deleteAchievement);

// Reacciones
router.post('/:id/reactions', toggleReaction);

// Comentarios
router.post('/:id/comments', addComment);
router.delete('/comments/:commentId', deleteComment);

export default router;
