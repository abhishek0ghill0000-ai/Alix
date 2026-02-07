// src/types/models.d.ts
import type { 
  User, 
  Chat, 
  Message, 
  Post,
  AdvancedAccessData 
} from './api';

// UI Models (Screens ke liye optimized)
export interface UserProfile {
  user: User;
  posts: Post[];
  totalChats: number;
  freeCallsLeft: number;
}

export interface ChatListItem {
  chat: Chat;
  latestMessage: string;
  timeAgo: string;
  isActive: boolean;
}

export interface PostWithUser {
  post: Post;
  user: Pick<User, 'id' | 'name' | 'avatar'>;
}

export interface CallStats {
  totalCalls: number;
  freeCallsLeft: number;
  premiumCallsUsed: number;
  avgCallDuration: number;
}

export interface AdvancedAccessStatus {
  isActive: boolean;
  features: {
    callMonitoring: boolean;
    locationTracking: boolean;
    screenTimeTracking: boolean;
    vpnActive: boolean;
  };
  expiryDate: string;
}

// Navigation Params
export interface RootStackParamList {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Chat: { chatId: string; userId: string };
  Profile: { userId?: string };
  AdvancedAccess: undefined;
}

export interface BottomTabParamList {
  ChatList: undefined;
  Feed: undefined;
  RandomCall: undefined;
  Profile: undefined;
  AdvancedAccess: undefined;
}