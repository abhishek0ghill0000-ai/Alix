import { Router } from 'express';
import { getMe, searchByUniqueId } from '../controllers/userController';
import { authMiddleware, asyncHandler } from '../middlewares';

const router = Router();

router.get('/me', authMiddleware, asyncHandler(getMe));
router.get('/search/:uniqueId', asyncHandler(searchByUniqueId));

export default router;