// Alix App - Environment Configuration
// client/config/env.ts

// Base API URL (your Render backend)
export const API_BASE_URL = 'https://alix-renderer.com/api'; // From screenshot

// Database (Neon/PostgreSQL) - Backend only, client uses API endpoints
export const DB_CONFIG = {
  connectionString: process.env.NEON_DATABASE_URL || '', // Set in .env for server
  // Client doesn't connect directly to DB, uses REST API
};

// Auth & Features
export const JWT_SECRET = process.env.JWT_SECRET || 'alix-dev-secret-change-in-prod';
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Agora & AdMob (imported from other configs)
export { AGORA_APP_ID, ADMOB_APP_ID } from './adsConfig'; // Reuse where needed
export { AGORA_APP_ID } from './callConfig';

// Feature Flags (for subscriptions, advanced access)
export const FEATURES = {
  RANDOM_VIDEO_CALLS: true,
  ADVANCED_ACCESS: true,
  ADS_ENABLED: !IS_PRODUCTION,
  LOCATION_TRACKING: true, // Mandatory on login
};

// API Endpoints for app features
export const API_ENDPOINTS = {
  searchUsers: `${API_BASE_URL}/users/search`,
  randomMatch: `${API_BASE_URL}/random/call`,
  friendRequest: `${API_BASE_URL}/friends/request`,
  advancedAccess: `${API_BASE_URL}/access/:id`,
  posts: `${API_BASE_URL}/posts`,
  auth: `${API_BASE_URL}/auth/login`,
};

// Default headers for API calls
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};