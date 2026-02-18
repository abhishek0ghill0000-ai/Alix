import { Request, Response } from 'express';
import { db } from '../config/dbConfig';
import { advancedAccess } from '../schema';

// POST /advanced-access/link
export const createAccessLink = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).userId;
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // one-time code

    const [link] = await db.insert(advancedAccess).values({
      ownerId,
      code,
      active: true,
    }).returning();

    res.status(201).json({ success: true, data: link });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to create link' });
  }
};

// POST /advanced-access/confirm
export const confirmAccess = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { code } = req.body;

    const link = await db.query.advancedAccess.findFirst({
      where: (a, { and, eq }) => and(eq(a.code, code), eq(a.active, true)),
    });

    if (!link) return res.status(400).json({ success: false, error: 'Invalid code' });

    await db
      .update(advancedAccess)
      .set({ accessedBy: userId })
      .where((a, { eq }) => eq(a.id, link.id));

    res.json({ success: true, data: link });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Confirm failed' });
  }
};

// GET /advanced-access/data/:id
export const getAccessData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await db.query.advancedAccess.findFirst({
      where: (a, { eq }) => eq(a.id, id),
    });
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Fetch failed' });
  }
};