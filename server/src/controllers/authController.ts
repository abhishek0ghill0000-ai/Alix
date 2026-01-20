import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/dbConfig';
import env from '../config/envConfig';
import { users } from '../schema';

const createToken = (userId: string) =>
  jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ success: false, error: 'Missing fields' });

    const existing = await db.query.users.findFirst({ where: (u, { eq }) => eq(u.email, email) });
    if (existing) return res.status(409).json({ success: false, error: 'Email already used' });

    const hash = await bcrypt.hash(password, 10);
    const uniqueId = username.toLowerCase() + Math.floor(10000 + Math.random() * 89999).toString();

    const [user] = await db.insert(users).values({
      username,
      email,
      uniqueId,
      passwordHash: hash,
    }).returning();

    const token = createToken(user.id);
    res.status(201).json({ success: true, token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Signup failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.username, username),
    });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid creds' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, error: 'Invalid creds' });

    const token = createToken(user.id);
    res.json({ success: true, token, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};