import { db } from '../config/dbConfig';
import { posts } from '../schema';
import { eq, desc, and } from 'drizzle-orm';

export class PostModel {
  static async findRecent(limit = 20, page = 1) {
    const offset = (page - 1) * limit;
    return await db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
      limit,
      offset,
    });
  }

  static async create(postData: { userId: string; content: string; imageUrls?: string[] }) {
    const [post] = await db.insert(posts)
      .values(postData)
      .returning();
    return post;
  }

  static async likePost(postId: string) {
    const [post] = await db.update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, postId))
      .returning();
    return post;
  }

  static async getUserPosts(userId: string, limit = 10) {
    return await db.query.posts.findMany({
      where: eq(posts.userId, userId),
      orderBy: desc(posts.createdAt),
      limit,
    });
  }
}