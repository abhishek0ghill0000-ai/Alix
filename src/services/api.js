// services/api.js - **ChatScreen के लिए PERFECT** (SearchScreen wale functions के साथ)

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - तुम्हारा backend API URL
const API_BASE_URL = 'https://alix-api.onrender.com';

// Axios instance with auth token
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - हर API call में JWT token automatically add होगा
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('Token fetch error:', error);
  }
  return config;
});

// ===== SEARCHSCREEN के लिए (रखे हुए हैं) =====
export const searchUsers = async (body) => {
  const response = await api.post('/api/search/users', body);
  return response.data;
};

export const nearbyUsers = async (body) => {
  const response = await api.post('/api/search/nearby', body);
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data.user;
};

export const getTrendingPosts = async () => {
  const response = await api.get('/posts/trending');
  return response.data.posts;
};

// ===== CHATSCREEN के लिए NEW FUNCTIONS =====
// Conversations list (Snapchat-style chat list)
export const fetchConversations = async () => {
  const response = await api.get('/conversations');
  return response.data.conversations || response.data;
};

// Get messages with specific user
export const fetchMessages = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data.messages || response.data;
};

// Send message (text, image, video) + deleteAfter options
export const sendMessage = async (data) => {
  const response = await api.post('/messages', data);
  return response.data;
};

// Delete message (after view, 24h, 2d)
export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

// Typing indicator
export const sendTypingStatus = async (data) => {
  const response = await api.post('/typing', data);
  return response.data;
};

// Call APIs (simple call, video call, group video call)
export const initiateCall = async (data) => {
  const response = await api.post('/calls', data);
  return response.data;
};

export const endCall = async (callId) => {
  const response = await api.post(`/calls/${callId}/end`);
  return response.data;
};

// Group chat APIs
export const createGroup = async (data) => {
  const response = await api.post('/groups', data);
  return response.data;
};

export const getGroupMessages = async (groupId) => {
  const response = await api.get(`/messages/group/${groupId}`);
  return response.data.messages || response.data;
};

export default api;
