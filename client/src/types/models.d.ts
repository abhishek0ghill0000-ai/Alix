// Alix App - Core Data Models
// For Redux, screens, Neon DB tables

export interface User {
  id: string;
  username: string;
  uniqueId: string; // For search
  email?: string;
  profilePhoto?: string;
  bio?: string;
  createdAt: number;
  isOnline?: boolean;
  friends?: string[]; // uniqueIds
}

export interface FriendRequest {
  id: string;
  fromUniqueId: string;
  toUniqueId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderUniqueId: string;
  text: string;
  imageUrl?: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image' | 'voice';
}

export interface Chat {
  id: string;
  participants: string[]; // user IDs
  friendUniqueId: string;
  lastMessage: string;
  unreadCount: number;
  lastTimestamp: number;
  messages: Message[];
}

export interface Post {
  id: string;
  userId: string;
  uniqueId: string; // poster uniqueId
  username: string;
  profilePhoto?: string;
  content: string;
  imageUrls: string[];
  likes: number;
  shares: number;
  comments: number;
  likedByMe: boolean;
  sharedByMe: boolean;
  timestamp: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  postId: string;
  userUniqueId: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface Call {
  id: string;
  localUid: number;
  remoteUid: number;
  channel: string; // 'Alix' for random
  type: 'random_video' | 'friend_video' | 'voice';
  status: 'idle' | 'connecting' | 'connected' | 'ended';
  duration: number;
  timestamp: number;
  remoteUniqueId?: string; // For friend request
}

export interface AdvancedAccess {
  linkId: string;
  ownerUniqueId: string;
  accessedBy: string;
  totalCallTimeToday: number; // seconds
  totalCallTimeWeekly: number;
  callCount: number;
  screenTime: number; // app usage
  lastLocationCheck?: LocationData;
  active: boolean;
}

export interface LocationData {
  lat: number;
  lng: number;
  timestamp: number;
  accuracy: number;
}

export interface AdMobConfig {
  appId: string; // ca-app-pub-81751574647485-01439
  interstitialUnitId: string; // ca-app-pub-81751574647485-72150463
  bannerSize: 'adaptive' | 'standard';
}

// Enums
export enum CallType {
  RANDOM_VIDEO = 'random_video',
  FRIEND_VIDEO = 'friend_video',
}

export enum PostAction {
  LIKE = 'like',
  SHARE = 'share',
  COMMENT = 'comment',
}