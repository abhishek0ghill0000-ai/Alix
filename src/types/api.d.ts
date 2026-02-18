// src/types/api.d.ts
import type { ENV } from '../config/env';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  token?: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
  device_token?: string;
}

export interface SignupRequest {
  phone: string;
  name: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  device_token?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other';
  is_verified: boolean;
  is_premium: boolean;
  advanced_access: boolean;
  total_calls: number;
  free_calls_left: number;
  status: 'online' | 'offline' | 'busy' | 'typing';
  location?: {
    lat: number;
    lng: number;
    last_updated: string;
  };
  created_at: string;
}

export interface Chat {
  id: string;
  participants: string[];
  last_message: {
    text: string;
    sender: string;
    timestamp: string;
    is_read: boolean;
  };
  unread_count: number;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender: string;
  receiver: string;
  text: string;
  type: 'text' | 'image' | 'voice' | 'video';
  is_read: boolean;
  timestamp: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  is_liked: boolean;
  created_at: string;
}

export interface AdvancedAccessData {
  call_monitoring: boolean;
  screen_time: number;
  location_tracking: boolean;
  vpn_status: boolean;
  speed_boost: boolean;
}