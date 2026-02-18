// src/config/admobConfig.ts
import { initialize } from 'react-native-google-mobile-ads';

const ADMOB_APP_ID = 'ca-app-pub-3781718251647447~8945014239';
const ADMOB_INTERSTITIAL_ID = 'ca-app-pub-3781718251647447/7472150463';

export const initAdmob = () => {
  initialize({ appId: ADMOB_APP_ID });
};

export const getInterstitialAdId = () => {
  return ADMOB_INTERSTITIAL_ID;
};
