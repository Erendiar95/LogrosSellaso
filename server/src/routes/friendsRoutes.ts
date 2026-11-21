import { Router } from 'express';
import {
  getFriends,
  searchUsers,
  sendFriendRequest,
  respondFriendRequest,
  removeFriend,
} from '../controllers/friendsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getFriends);
router.get('/search', searchUsers);
router.post('/request', sendFriendRequest);
router.put('/respond/:id', respondFriendRequest);
router.delete('/:id', removeFriend);

export default router;
