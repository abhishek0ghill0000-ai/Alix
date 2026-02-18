# Posts System - Alix App (Like/Share/Comment)

## Social Feed Features
✅ Create post (text/image/video)
✅ Like/unlike (real-time counter)
✅ Comment threaded (replies)
✅ Delete own posts
✅ Infinite scroll pagination
✅ Agora video posts integration
## Posts Schema (Neon + Drizzle)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[], -- ['https://img1.jpg', 'https://video.mp4']
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id UUID PRIMARY KEY PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- Threaded replies
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);Backend API Endpoints (Node.js + Express)import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and, sql } from 'drizzle-orm';
import authenticateToken from '../middleware/auth.js';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// POST /api/posts - Create post (auth required)
app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content, media_urls = [], is_public = true } = req.body;
    
    const [post] = await db.insert(posts)
      .values({
        user_id: req.user.userId,
        content,
        media_urls,
        is_public
      })
      .returning();
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// GET /api/posts/feed?page=1&limit=20 - Paginated feed
app.get('/api/posts/feed', async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 20);
    const offset = (page - 1) * limit;
    
    const feed = await db.query.posts.findMany({
      where: eq(posts.is_public, true),
      orderBy: [sql`${posts.created_at} DESC`],
      limit,
      offset,
      with: {
        likes_count: sql<number>`(SELECT COUNT(*) FROM ${post_likes} WHERE ${post_likes.post_id} = ${posts.id})`.as('likes_count'),
        user: true // Join user details
      }
    });
    
    res.json(feed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

// POST /api/posts/:postId/like - Toggle like (auth required)
app.post('/api/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const existingLike = await db.query.post_likes.findFirst({
      where: and(
        eq(post_likes.post_id, postId),
        eq(post_likes.user_id, req.user.userId)
      )
    });
    
    if (existingLike) {
      // Unlike
      await db.delete(post_likes).where(eq(post_likes.id, existingLike.id));
      await db.update(posts)
        .set({ likes_count: sql`${posts.likes_count} - 1` })
        .where(eq(posts.id, postId));
    } else {
      // Like
      await db.insert(post_likes).values({
        post_id: postId,
        user_id: req.user.userId
      });
      await db.update(posts)
        .set({ likes_count: sql`${posts.likes_count} + 1` })
        .where(eq(posts.id, postId));
    }
    
    const [updatedPost] = await db.query.posts.findFirst({
      where: eq(posts.id, postId)
    });
    
    res.json({ likes_count: updatedPost.likes_count });
  } catch (error) {
    res.status(500).json({ error: 'Like operation failed' });
  }
});

// POST /api/posts/:postId/comments - Add comment (auth required)
app.post('/api/posts/:postId/comments', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parent_id = null } = req.body;
    
    const [comment] = await db.insert(comments)
      .values({
        post_id: postId,
        parent_id,
        user_id: req.user.userId,
        content
      })
      .returning();
    
    // Update post comments count
    await db.update(posts)
      .set({ comments_count: sql`${posts.comments_count} + 1` })
      .where(eq(posts.id, postId));
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Comment failed' });
  }
});

// DELETE /api/posts/:postId - Delete own post (auth required)
app.delete('/api/posts/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await db.query.posts.findFirst({
      where: and(
        eq(posts.id, postId),
        eq(posts.user_id, req.user.userId)
      )
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found or not owner' });
    }
    
    await db.delete(posts).where(eq(posts.id, postId));
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});Client React Native - PostsScreen.tsximport React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../hooks/useAuth';

const PostsScreen = () => {
  const { user, accessToken } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/feed?page=${pageNum}&limit=20`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const newPosts = await res.json();
      setPosts(pageNum === 1 ? newPosts : [...posts, ...newPosts]);
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [accessToken, posts, page]);

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const createPost = async () => {
    if (!content.trim()) return;
    
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ content: content.trim() })
      });
      
      if (res.ok) {
        setContent('');
        fetchPosts(1); // Refresh feed
      }
    } catch (error) {
      console.error('Create post error:', error);
    }
  };

  const toggleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (res.ok) {
        const { likes_count } = await res.json();
        setPosts(posts.map(p => p.id === postId ? { ...p, likes_count } : p));
      }
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const renderPost = ({ item }) => (
    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.user?.username}</Text>
      <Text>{item.content}</Text>
      {item.media_urls.map(url => (
        <Image key={url} source={{ uri: url }} style={{ height: 200, marginTop: 10 }} />
      ))}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        <TouchableOpacity onPress={() => toggleLike(item.id)}>
          <Text>❤️ {item.likes_count}</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 15 }}>💬 {item.comments_count}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {user && (
        <View style={{ padding: 15 }}>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's happening?"
            multiline
            style={{ borderWidth: 1, borderColor: '#ddd', padding: 10, minHeight: 50 }}
          />
          <TouchableOpacity onPress={createPost} style={{ marginTop: 10, backgroundColor: '#007AFF', padding: 10 }}>
            <Text style={{ color: 'white', textAlign: 'center' }}>Post</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        onEndReached={() => {
          if (!loading) {
            setPage(page + 1);
            fetchPosts(page + 1);
          }
        }}
        onEndReachedThreshold={0.1}
      />
      
      {loading && <Text>Loading more posts...</Text>}
    </View>
  );
};

export default PostsScreen;Test Commands# Create post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello Alix! 🚀","media_urls":["https://example.com/img.jpg"]}'

# Get feed
curl "http://localhost:3000/api/posts/feed?page=1&limit=5"

# Like post
curl -X POST http://localhost:3000/api/posts/POST_UUID/like \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add comment
curl -X POST http://localhost:3000/api/posts/POST_UUID/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post!"}'

# Delete post
curl -X DELETE http://localhost:3000/api/posts/POST_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"