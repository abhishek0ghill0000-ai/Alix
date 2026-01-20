import { Router } from 'express';
import { getAgoraToken } from '../controllers/callController';
import { agoraTokenLimiter, asyncHandler } from '../middlewares';

const router = Router();

router.get('/token', agoraTokenLimiter, asyncHandler(getAgoraToken));

export default router;