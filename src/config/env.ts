// src/config/env.ts
export const ENV = {
  // API Base URLs (Tumhare Render Backend)
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://alix-renderer.com/api',
  WS_BASE_URL: process.env.EXPO_PUBLIC_WS_URL || 'wss://echo.websocket.org',
  
  // Agora Video Call (Tumhara App ID)
  AGORA_APP_ID: process.env.EXPO_PUBLIC_AGORA_APP_ID || 'e11f87sec4db58bae87b72131',
  
  // Firebase Cloud Messaging
  FCM_SENDER_ID: process.env.EXPO_PUBLIC_FCM_SENDER_ID || '387115264747-90414298',
  
  // AdMob (Optional - Tumhare IDs)
  ADMOB_APP_ID: process.env.EXPO_PUBLIC_ADMOB_APP_ID || 'ca-app-pub-38711526474790414298~something',
  ADMOB_BANNER_ID: process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || 'ca-app-pub-3871152647477150463',
  
  // Feature Flags
  ENABLE_VIDEO_CALLS: process.env.EXPO_PUBLIC_ENABLE_VIDEO_CALLS === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_POST_FEATURE: process.env.EXPO_PUBLIC_ENABLE_POST_FEATURE === 'true',
  ENABLE_ADMOB: process.env.EXPO_PUBLIC_ENABLE_ADMOB === 'true',
  
  // App Config
  APP_VERSION: '1.0.2',
  SUPPORTED_LANGUAGES: ['en', 'hi'],
  DEFAULT_LANGUAGE: 'en',
  
  // Auth Endpoints
  LOGIN_ENDPOINT: '/auth/login',
  REGISTER_ENDPOINT: '/auth/register',
  REFRESH_TOKEN_ENDPOINT: '/auth/refresh',
  
  // Social Endpoints
  POSTS_ENDPOINT: '/posts',
  CHATS_ENDPOINT: '/chats',
  USERS_ENDPOINT: '/users',
  
  // Development Mode
  IS_DEV: __DEV__,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Storage Keys
  ASYNC_STORAGE_KEYS: {
    USER_TOKEN: 'userToken',
    USER_DATA: 'userData',
    LANGUAGE: 'appLanguage',
    NOTIFICATION_SETTINGS: 'notificationSettings',
  } as const,
};

// API/WebSocket Config
export const API_TIMEOUT = 15000; // 15 seconds (Render slow)
export const WS_RECONNECT_DELAY = 5000;
export const WS_MAX_RETRIES = 5;

// File Upload Limits
export const MAX_POST_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_POST_TEXT_LENGTH = 2000;

// Rate Limits
export const CALL_RATE_LIMIT = 60; // 1 call/minute
export const POST_RATE_LIMIT = 10; // 10 posts/hour