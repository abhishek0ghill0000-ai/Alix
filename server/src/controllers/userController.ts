import { Request, Response } from 'express';
import { db } from '../config/dbConfig';
import { users } from '../schema';

// GET /users/me
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.id, userId) });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

// GET /users/search/:uniqueId
export const searchByUniqueId = async (req: Request, res: Response) => {
  try {
    const { uniqueId } = req.params;
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.uniqueId, uniqueId),
    });
    if (!user) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Search failed' });
  }
};