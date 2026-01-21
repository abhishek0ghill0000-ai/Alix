import { Router } from 'express';
import { 
  getPosts, 
  createPost, 
  likePost 
} from '../controllers/postController';
import { 
  authMiddleware, 
  postLimiter, 
  asyncHandler 
} from '../middlewares';

const router = Router();

router.get('/', asyncHandler(getPosts));
router.post('/', authMiddleware, postLimiter, asyncHandler(createPost));
router.post('/:id/like', authMiddleware, asyncHandler(likePost));
router.post('/:id/share', authMiddleware, asyncHandler(likePost)); // Reuse logic

export default router;