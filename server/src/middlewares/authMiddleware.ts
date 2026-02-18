import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/envConfig';

interface AuthRequest extends Request {
  userId?: string;
  userUniqueId?: string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
    if (!decoded.userId) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    // Optional: Fetch user from Neon (cache later)
    // const user = await db.query.users.findFirst({ where: eq(users.id, decoded.userId) });
    
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    console.error('Auth error:', error.message);
    res.status(401).json({ success: false, error: 'Token expired/invalid' });
  }
};

// Admin-only middleware (future)
export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.userId !== 'admin-uuid') { // From env
    return res.status(403).json({ success: false, error: 'Admin required' });
  }
  next();
};