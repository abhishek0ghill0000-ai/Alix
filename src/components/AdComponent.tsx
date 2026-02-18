// src/components/AdComponent.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { getInterstitialAdId } from '../config/admobConfig';

// Use real ID in production
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : getInterstitialAdId();

const interstitial = InterstitialAd.createForAdRequest(adUnitId);

export const AdComponent = ({ showAd, onAdDismissed }: { showAd: boolean; onAdDismissed: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener('loaded', () => {
      setLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener('closed', () => {
      setLoaded(false);
      onAdDismissed();
    });

    const unsubscribeError = interstitial.addAdEventListener('error', (error) => {
      console.log('Ad error:', error);
      setLoaded(false);
      onAdDismissed();
    });

    // Load the interstitial straight away
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    if (showAd && loaded) {
      interstitial.show();
    }
  }, [showAd, loaded]);

  return (
    <View style={{ padding: 20 }}>
      <Text>Ad placeholder (Interstitial will auto-show when showAd=true)</Text>
    </View>
  );
};
