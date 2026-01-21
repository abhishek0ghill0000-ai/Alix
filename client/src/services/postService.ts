import { apiClient } from './apiClient';

export const postService = {
  createPost: (content: string, image?: string) => apiClient.post('/posts', { content, image }),
  getFeed: () => apiClient.get('/posts/feed'),
  likePost: (postId: string) => apiClient.post(`/posts/${postId}/like`),
};