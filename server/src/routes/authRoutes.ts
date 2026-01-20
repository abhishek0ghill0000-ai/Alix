import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { authLimiter } from '../middlewares/rateLimiter';
import { asyncHandler } from '../middlewares/errorHandler';

const router = Router();

router.post('/signup', authLimiter, asyncHandler(signup));
router.post('/login', authLimiter, asyncHandler(login));

export default router;