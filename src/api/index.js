// src/api/index.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV } from '../config/env';
import type { 
  ApiResponse, 
  LoginRequest, 
  SignupRequest, 
  User 
} from '../types/api';

// Axios instance with base config
const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh + errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // TODO: Implement refresh token logic
        await AsyncStorage.removeItem('authToken');
        // Redirect to login (useNavigation in components)
      } catch (refreshError) {
        // Refresh failed, clear auth
        await AsyncStorage.clear();
      }
      
      // Redirect to login screen
      throw new Error('Session expired. Please login again.');
    }
    
    return Promise.reject(error);
  }
);

// 🔥 AUTH API
export const authAPI = {
  login: (data: LoginRequest) => api.post<ApiResponse<User>>('/authRoutes/login', data),
  signup: (data: SignupRequest) => api.post<ApiResponse<User>>('/authRoutes/signup', data),
};

// 🔥 CALLS API (Agora)
export const callsAPI = {
  generateToken: (channelName: string) => 
    api.post('/calls/generate-token', { channelName }),
  getRandomUsers: () => 
    api.get('/calls/random-users'),
};

// 🔥 USERS API
export const usersAPI = {
  getProfile: (userId: string) => 
    api.get(`/users/${userId}`),
  searchUsers: (query: string) => 
    api.get('/users/search', { params: { q: query } }),
  updateProfile: (data: Partial<User>) => 
    api.patch('/users/profile', data),
};

// 🔥 CHATS API
export const chatsAPI = {
  getChatList: () => api.get('/chatRoutes/chats'),
  getMessages: (chatId: string) => 
    api.get(`/chatRoutes/messages/${chatId}`),
  sendMessage: (chatId: string, message: string) => 
    api.post(`/chatRoutes/messages/${chatId}`, { message }),
};

// 🔥 POSTS API
export const postsAPI = {
  getFeed: () => api.get('/postRoutes/feed'),
  createPost: (content: string, image?: string) => 
    api.post('/postRoutes', { content, image }),
  getPost: (postId: string) => 
    api.get(`/postRoutes/${postId}`),
};

// 🔥 NOTIFICATIONS API
export const notificationsAPI = {
  saveToken: (token: string) => 
    api.post('/notifications/save-token', { token }),
};

// 🔥 DEFAULT EXPORT
export default api;