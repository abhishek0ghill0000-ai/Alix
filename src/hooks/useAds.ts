// src/hooks/useAds.ts
import { useState, useEffect, useCallback } from 'react';
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
  fetchAd: (type: 'post' | 'reel') => Promise<any | null>;
  insertAdEvery7th: (items: any[]) => any[];
}

export const useAds = (): UseAdsReturn => {
  const [isAdReady, setIsAdReady] = useState(false);
  const [rewardedCallsToday, setRewardedCallsToday] = useState(0);

  // Existing rewarded ad logic - unchanged
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

  // NEW: Post/Reel ads logic (har 7th item ke liye)
  const fetchAd = useCallback(async (type: 'post' | 'reel'): Promise<any | null> => {
    try {
      // Backend se ad fetch karo
      const response = await fetch(`https://alix-api.onrender.com/api/ads?type=${type}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return data.ad || null;
    } catch (error) {
      console.log('Fetch ad error:', error);
      return null;
    }
  }, []);

  const insertAdEvery7th = useCallback((items: any[]) => {
    const result: any[] = [];
    items.forEach((item, index) => {
      result.push(item);
      if ((index + 1) % 7 === 0) {
        // Har 7th item ke baad ad insert karo
        // Note: Actual ad fetch PostScreen/ReelScreen me onEndReached me karna better hoga
        result.push({ isAd: true, placeholder: true, type: 'ad' });
      }
    });
    return result;
  }, []);

  const showRewardedAd = watchAdForCall;

  return {
    showRewardedAd,
    isAdReady,
    rewardedCallsToday,
    watchAdForCall,
    fetchAd,           // NEW
    insertAdEvery7th,  // NEW
  };
};
