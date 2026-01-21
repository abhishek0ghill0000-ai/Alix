import { Request, Response } from 'express';
import { db } from '../config/dbConfig';
import { posts } from '../schema';

// GET /posts
export const getPosts = async (_: Request, res: Response) => {
  try {
    const data = await db.query.posts.findMany({
      orderBy: (p, { desc }) => desc(p.createdAt),
      limit: 50,
    });
    res.json({ success: true, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
};

// POST /posts
export const createPost = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { content, imageUrls = [] } = req.body;
    if (!content) return res.status(400).json({ success: false, error: 'Content required' });

    const [post] = await db.insert(posts).values({
      userId,
      content,
      imageUrls,
    }).returning();

    res.status(201).json({ success: true, data: post });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Create failed' });
  }
};

// POST /posts/:id/like
export const likePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await db.query.posts.findFirst({ where: (p, { eq }) => eq(p.id, id) });
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

    const updated = await db
      .update(posts)
      .set({ likes: post.likes + 1 })
      .where((p, { eq }) => eq(p.id, id))
      .returning();

    res.json({ success: true, data: updated[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Like failed' });
  }
};