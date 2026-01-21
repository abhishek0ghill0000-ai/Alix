import { Router } from 'express';
import advancedAccessRoutes from './advancedAccessRoutes';
import authRoutes from './authRoutes';
import callRoutes from './callRoutes';
import chatRoutes from './chatRoutes';
import postRoutes from './postRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/chats', chatRoutes);
router.use('/calls', callRoutes);
router.use('/advanced-access', advancedAccessRoutes);

export default router;