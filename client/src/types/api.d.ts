// Alix App - API Response Types
// All backend endpoints from Render server (https://alix-renderer.com)

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AgoraTokenResponse {
  token: string;
  uid: number;
  channel: string;
  expire: number;
}

export interface SendMessageRequest {
  text: string;
  imageUrl?: string;
}

export interface PostRequest {
  content: string;
  imageUrls?: string[];
}

export interface AdvancedAccessData {
  totalCallTimeToday: number;
  totalCallTimeWeekly: number;
  callCount: number;
  screenTime: number;
  locationLastChecked?: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}

// API Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Backend URLs constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
  },
  CHATS: '/chats',
  POSTS: '/posts',
  CALLS: '/calls',
  AGORA_TOKEN: 'https://agora-node-token-server-two-renderer.onrender.com/agora-token', // External
} as const;