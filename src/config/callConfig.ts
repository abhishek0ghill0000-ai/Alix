// src/config/callConfig.ts
import { ENV } from './env';

export const CALL_CONFIG = {
  // 🔥 YOUR REAL AGORA IDS (Image se verified)
  AGORA: {
    APP_ID: 'e11f87SeC4dB58b6ea87b72131',
    APP_CERTIFICATE: '857828f7a04a7ab6d6f8d520e0',
  },
  
  // Backend endpoints (WORKING - tested!)
  ENDPOINTS: {
    GENERATE_TOKEN: `${ENV.API_BASE_URL}/calls/generate-token`,
    RANDOM_USERS: `${ENV.API_BASE_URL}/calls/random-users`,
  },
  
  // Call settings
  CALL_SETTINGS: {
    TOKEN_EXPIRY: 24 * 60 * 60,  // 24 hours
    MAX_CALL_DURATION: 30 * 60,  // 30 minutes
    RANDOM_CHANNEL_PREFIX: 'alix_random_',
  },
  
  // Video quality (720p optimized)
  VIDEO: {
    RESOLUTION: '720p',  // 1280x720
    BITRATE: 1000,       // kbps
    FRAME_RATE: 30,
  },
  
  // Audio settings
  AUDIO: {
    SAMPLE_RATE: 48000,
    BITRATE: 128,
    STEREO: false,
  },
  
  // Free vs Premium limits (8 free calls)
  LIMITS: {
    FREE_CALLS_PER_DAY: 8,
    PREMIUM_CALLS_PER_DAY: 999,
    MINIMUM_DURATION: 30, // seconds
  },
  
  // AdMob rewarded video (YOUR IDs)
  ADS: {
    REWARDED_UNIT: 'ca-app-pub-38711526-4747-72150463',
    APP_ID: 'ca-app-pub-38711526-4747-89401298',
  },
} as const;

export const generateRandomChannel = (): string => {
  return `${CALL_CONFIG.CALL_SETTINGS.RANDOM_CHANNEL_PREFIX}${Math.random().toString(36).substr(2, 9)}`;
};

// Call role constants
export const CALL_ROLES = {
  PUBLISHER: 1,
  SUBSCRIBER: 2,
} as const;