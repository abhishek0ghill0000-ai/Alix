import { PostModel } from '../models/postModel';
import { UserModel } from '../models/userModel';

export class PostService {
  static async createPost(userId: string, content: string, imageUrls: string[] = []) {
    const user = await UserModel.findById(userId);
    if (!user) throw new Error('User not found');

    const post = await PostModel.create({
      userId,
      uniqueId: user.uniqueId,
      username: user.username,
      content,
      imageUrls,
    });

    return post;
  }

  static async getFeed(page = 1, limit = 20) {
    const posts = await PostModel.findRecent(limit, page);
    
    // Enrich with user data
    const enriched = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        user: await UserModel.findByUniqueId(post.uniqueId!),
      }))
    );

    return enriched;
  }

  static async toggleLike(userId: string, postId: string) {
    // Check if already liked (simplified)
    const post = await PostModel.likePost(postId);
    return post;
  }

  static async getUserFeed(uniqueId: string, limit = 10) {
    const user = await UserModel.findByUniqueId(uniqueId);
    if (!user) throw new Error('User not found');

    return await PostModel.getUserPosts(user.id!, limit);
  }
}