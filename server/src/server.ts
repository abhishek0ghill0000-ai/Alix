import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const app: Express = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

app.use(cors({ origin: '*' }));
app.use(express.json());

// Auth middleware
const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Register/Login (location client se)
app.post('/auth/register', async (req: Request, res: Response) => {
  const { uniqueId, username, password, location } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { uniqueId, username, passwordHash, location: location || null }
  });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user: { id: user.id, uniqueId, username }, token });
});

app.post('/auth/login', async (req: Request, res: Response) => {
  const { uniqueId, password } = req.body;
  const user = await prisma.user.findUnique({ where: { uniqueId } });
  if (!user || !await bcrypt.compare(password, user.passwordHash || '')) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user, token });
});

// Search user by ID
app.get('/search/:uniqueId', async (req: Request, res: Response) => {
  const { uniqueId } = req.params;
  const user = await prisma.user.findUnique({
    where: { uniqueId },
    select: { id: true, uniqueId: true, username: true, profilePhoto: true }
  });
  res.json(user);
});

// Friend request
app.post('/friends/request', auth, async (req: Request, res: Response) => {
  const { friendId } = req.body;
  const userId = (req as any).userId;
  await prisma.friend.create({ data: { userId, friendId, status: 'pending' } });
  res.json({ message: 'Request sent' });
});

app.put('/friends/:friendId/accept', auth, async (req: Request, res: Response) => {
  const { friendId } = req.params;
  const userId = (req as any).userId;
  await prisma.friend.updateMany({
    where: { userId: friendId, friendId: userId },
    data: { status: 'accepted' }
  });
  res.json({ message: 'Accepted' });
});

// Posts CRUD
app.get('/posts', async (req: Request, res: Response) => {
  const posts = await prisma.post.findMany({
    include: { user: { select: { uniqueId: true, username: true } }, _count: { select: { comments: true, likes: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(posts);
});

app.post('/posts', auth, async (req: Request, res: Response) => {
  const { content, imageUrl } = req.body;
  const userId = (req as any).userId;
  const post = await prisma.post.create({ data: { content, imageUrl, userId } });
  res.json(post);
});

// Comments/Likes
app.post('/posts/:postId/comment', auth, async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = (req as any).userId;
  const comment = await prisma.comment.create({
    data: { content, postId, userId },
    include: { user: { select: { uniqueId: true } } }
  });
  res.json(comment);
});

app.post('/posts/:postId/like', auth, async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = (req as any).userId;
  await prisma.like.upsert({
    where: { userId_postId: { userId, postId } },
    update: {},
    create: { userId, postId }
  });
  res.json({ message: 'Liked' });
});

// Advanced Access
app.post('/access/grant', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { granteeId } = req.body;
  const code = Math.random().toString(36).substring(7);
  const linkToken = Math.random().toString(36).substring(10);
  const grant = await prisma.accessGrant.create({
    data: { granterId: userId, granteeId, code, linkToken }
  });
  res.json({ code, linkToken }); // Send code to grantee OOB
});

app.get('/access/:linkToken', async (req: Request, res: Response) => {
  const { linkToken } = req.params;
  const grant = await prisma.accessGrant.findUnique({
    where: { linkToken },
    include: { granter: {
      select: { totalCallTime: true, callCount: true, screenTime: true, location: true }
    } }
  });
  if (!grant?.active) return res.status(404).json({ error: 'Invalid link' });
  res.json(grant.granter);
});

// Random Video Call - simple match endpoint (client Agora random peer handle)
app.get('/random/match', auth, async (req: Request, res: Response) => {
  // Simulate random user (real: queue/matching service)
  const users = await prisma.user.findMany({ select: { id: true, uniqueId: true }, take: 1 });
  res.json(users[0] || null);
});

// Agora Token
app.get('/agora/token', auth, (req: Request, res: Response) => {
  const appID = process.env.AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE!;
  const channelName = req.query.channel as string || 'alix-random';
  const uid = 0; // Random UID client generate
  const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, RtcRole.PUBLISHER, Math.floor(Date.now()/1000) + 3600);
  res.json({ token, channelName });
});

// Profile & stats update (screen time etc)
app.put('/profile/stats', auth, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { totalCallTime, callCount, screenTime, location } = req.body;
  await prisma.user.update({
    where: { id: userId },
    data: { totalCallTime, callCount, screenTime, location }
  });
  res.json({ message: 'Updated' });
});

app.listen(process.env.PORT || 3000, () => console.log('Alix server running'));