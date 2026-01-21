import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BACKEND_URL = 'https://alix-renderer.com';

interface Post {
  id: string;
  userId: string;
  uniqueId: string;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  timestamp: number;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = { posts: [], loading: false, error: null };

export const fetchPosts = createAsyncThunk('post/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/posts`);
    if (!response.ok) throw new Error('Fetch posts failed');
    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const createPost = createAsyncThunk('post/createPost', async ({ content }: { content: string }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Create failed');
    return await response.json();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const likePost = createAsyncThunk('post/likePost', async (postId: string, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Like failed');
    return postId;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updatePostLikes: (state, action: PayloadAction<{ id: string; likes: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.id);
      if (post) post.likes = action.payload.likes;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.loading = false;
      });
  },
});

export const { updatePostLikes, clearError } = postSlice.actions;
export default postSlice.reducer;