// src/hooks/useAds.ts
import { useState, useEffect } from 'react';
import { 
  RewardedAd, 
  RewardedAdEventType, 
  TestIds 
} from '@react-native-firebase/admob';
import { ADS_CONFIG } from '../config/adsConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAdsReturn {
  showRewardedAd: () => Promise<boolean>;
  isAdReady: boolean;
  rewardedCallsToday: number;
  watchAdForCall: () => Promise<boolean>;
}

export const useAds = (): UseAdsReturn => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [rewardedCallsToday, setRewardedCallsToday] = useState(0);

  useEffect(() => {
    const rewarded = RewardedAd.createForAdRequest(ADS_CONFIG.ADMOB.REWARDED_VIDEO, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = rewarded.onAdEvent((type) => {
      if (type === RewardedAdEventType.LOADED) {
        setIsAdReady(true);
      }
    });

    const unsubscribeEarned = rewarded.onAdEvent((type) => {
      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('✅ Rewarded ad completed!');
      }
    });

    rewarded.load();
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const getRewardedCallsCount = async () => {
    const count = await AsyncStorage.getItem('rewardedCallsToday');
    return parseInt(count || '0') || 0;
  };

  const watchAdForCall = async (): Promise<boolean> => {
    const rewarded = RewardedAd.createForAdRequest(ADS_CONFIG.ADMOB.REWARDED_VIDEO);
    
    try {
      const result = await rewarded.show();
      if (result.completed) {
        // Increment rewarded calls
        const current = await getRewardedCallsCount();
        await AsyncStorage.setItem('rewardedCallsToday', (current + 1).toString());
        setRewardedCallsToday(current + 1);
        return true;
      }
      return false;
    } catch (error) {
      console.log('Ad error:', error);
      return false;
    }
  };

  const showRewardedAd = watchAdForCall;

  return {
    showRewardedAd,
    isAdReady,
    rewardedCallsToday,
    watchAdForCall,
  };
};