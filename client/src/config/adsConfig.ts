// Alix App - AdMob Configuration
// client/config/adsConfig.ts

import { 
  BannerAdSize, 
  InterstitialAd, 
  BannerAd, 
  TestIds 
} from 'react-native-google-mobile-ads';

// Production AdMob IDs from screenshots
export const ADMOB_APP_ID = 'ca-app-pub-81771574647-48501439';
export const INTERSTITIAL_AD_UNIT_ID = 'ca-app-pub-81771574647-72150463';

// Test IDs for development (remove in production)
export const TEST_INTERSTITIAL_ID = TestIds.INTERSTITIAL;
export const TEST_BANNER_ID = TestIds.BANNER;

// Interstitial ad helper (for random video call ads - every 8 calls)
let interstitialAd: InterstitialAd | null = null;

export const createInterstitialAd = () => {
  interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['social', 'video call', 'chat'],
  });

  interstitialAd.addAdEventListener('adClosed', () => {
    interstitialAd?.load();
  });
  interstitialAd.load();
};

export const showInterstitialAd = async (): Promise<boolean> => {
  if (!interstitialAd) {
    createInterstitialAd();
    return false;
  }
  try {
    const isLoaded = await interstitialAd.show();
    return isLoaded;
  } catch (error) {
    console.error('AdMob interstitial failed:', error);
    return false;
  }
};

// Banner ad component helper (for Advanced Access screens)
export const AdBanner = () => (
  <BannerAd
    unitId={INTERSTITIAL_AD_UNIT_ID} // Reuse or create separate
    size={BannerAdSize.FULL_BANNER}
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
  />
);