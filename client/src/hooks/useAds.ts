// Alix App - AdMob Hooks
// client/hooks/useAds.ts

import { useEffect, useState, useCallback } from 'react';
import { 
  InterstitialAd, 
  BannerAd, 
  BannerAdSize,
  TestIds 
} from 'react-native-google-mobile-ads';
import { ADMOB_APP_ID, INTERSTITIAL_AD_UNIT_ID, createInterstitialAd, showInterstitialAd } from '../config/adsConfig';

export const useAds = (isPremium: boolean = false) => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adCallCount, setAdCallCount] = useState(0); // Track random calls for 8-call rule
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

  // Initialize interstitial on mount
  useEffect(() => {
    if (isPremium || !INTERSTITIAL_AD_UNIT_ID) return;

    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
    setInterstitial(ad);

    const unsubscribeLoaded = ad.addAdEventListener('adLoaded', () => {
      setIsAdLoaded(true);
    });

    const unsubscribeClosed = ad.addAdEventListener('adClosed', () => {
      ad.load();
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  // Show ad after every 8 random video calls (free users only)
  const showAdAfterCalls = useCallback(async () => {
    if (isPremium || adCallCount < 8 || !isAdLoaded) return false;

    setAdCallCount(0); // Reset counter
    const result = await showInterstitialAd();
    return result;
  }, [isPremium, adCallCount, isAdLoaded]);

  // Increment call counter
  const onVideoCallEnd = () => {
    if (!isPremium) {
      setAdCallCount(prev => prev + 1);
    }
  };

  // Banner component for Advanced Access screens
  const AdBannerComponent = () => isPremium ? null : (
    <BannerAd
      unitId={INTERSTITIAL_AD_UNIT_ID}
      size={BannerAdSize.LARGE_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
    />
  );

  return {
    isAdReady: isAdLoaded && !isPremium,
    showAd: showAdAfterCalls,
    onCallEnd: onVideoCallEnd,
    Banner: AdBannerComponent,
    callCount: adCallCount,
  };
};