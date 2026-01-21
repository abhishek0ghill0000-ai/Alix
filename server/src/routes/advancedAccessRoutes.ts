import { Router } from 'express';
import { 
  createAccessLink, 
  confirmAccess, 
  getAccessData 
} from '../controllers/advancedAccessController';
import { authMiddleware, asyncHandler } from '../middlewares';

const router = Router();

router.post('/link', authMiddleware, asyncHandler(createAccessLink));
router.post('/confirm', authMiddleware, asyncHandler(confirmAccess));
router.get('/data/:id', authMiddleware, asyncHandler(getAccessData));

export default router;