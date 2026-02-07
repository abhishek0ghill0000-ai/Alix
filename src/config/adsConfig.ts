// src/config/adsConfig.ts
export const ADS_CONFIG = {
  // 🔥 YOUR AdMob IDs (from images)
  ADMOB: {
    APP_ID: 'ca-app-pub-38711526-4747-89401298',
    REWARDED_VIDEO: 'ca-app-pub-38711526-4747-72150463',
  },
  
  // Ad placement rules
  AD_RULES: {
    FREE_CALLS_PER_DAY: 3,        // After 3 free → Show rewarded ad
    REWARDED_CALLS_PER_DAY: 999,  // Premium users
    INTERSTITIAL_INTERVAL: 5,     // Every 5 calls
  },
  
  // Test IDs (for development)
  TEST_IDS: {
    REWARDED_VIDEO: 'ca-app-pub-3940256099942544/5224354917',
  },
} as const;