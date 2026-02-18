import { Request, Response } from 'express';
import { db } from '../config/dbConfig';
import { chats, messages } from '../schema';

// GET /chats
export const getChats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const data = await db.query.chats.findMany({
      where: (c, { or, eq }) => or(eq(c.user1Id, userId), eq(c.user2Id, userId)),
    });
    res.json({ success: true, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to load chats' });
  }
};

// GET /chats/:id/messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const msgs = await db.query.messages.findMany({
      where: (m, { eq }) => eq(m.chatId, id),
      orderBy: (m, { asc }) => asc(m.timestamp),
    });
    res.json({ success: true, data: msgs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to load messages' });
  }
};

// POST /chats/:id/messages
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { text, imageUrl } = req.body;

    const [msg] = await db.insert(messages).values({
      chatId: id,
      senderId: userId,
      text,
      imageUrl,
    }).returning();

    res.status(201).json({ success: true, data: msg });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Send failed' });
  }
};