import { Router } from 'express';
import { 
  getChats, 
  getMessages, 
  sendMessage 
} from '../controllers/chatController';
import { authMiddleware, asyncHandler } from '../middlewares';

const router = Router();

router.get('/', authMiddleware, asyncHandler(getChats));
router.get('/:id/messages', authMiddleware, asyncHandler(getMessages));
router.post('/:id/messages', authMiddleware, asyncHandler(sendMessage));

export default router;