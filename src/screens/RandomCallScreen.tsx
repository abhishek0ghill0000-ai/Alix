// src/screens/RandomCallScreen.tsx - Backend के साथ complete integration + 100 calls/day + AdMob ads
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AgoraRtcEngine, { RtcEngine, ChannelProfile, RtcStats, UserOfflineReasonType, ErrorCodeType } from 'react-native-agora';
import { InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { AdComponent } from '../components/AdComponent';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Backend API config
const API_BASE = 'https://alix-api.onrender.com';
const AGORA_APP_ID = 'e11f87secd5b86ae8b7a2131';

// AdMob config
const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3781718251647447/7472150463';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
});

const RandomCallScreen = () => {
  const navigation = useNavigation<any>();
  
  // States
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<'waiting' | 'connecting' | 'matched' | 'calling' | 'limitReached'>('waiting');
  const [remoteUid, setRemoteUid] = useState(0);
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [channel, setChannel] = useState('');
  const [userToken, setUserToken] = useState('');
  const [receiverInfo, setReceiverInfo] = useState<any>(null);
  const [dailyCallsLeft, setDailyCallsLeft] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  
  // Animations
  const pulseAnim = useState(new Animated.Value(1))[0];
  
  // Refs
  const callTimeoutRef = useRef<NodeJS.Timeout>();
  const matchingTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize AdMob interstitial
  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener('loaded', () => {
      setAdLoaded(true);
    });

    const unsubscribeClosed = interstitial.addAdEventListener('closed', () => {
      setAdLoaded(false);
      setShowAd(false);
    });

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  // Initialize Agora + Check daily limit
  useEffect(() => {
    initApp();
    return () => {
      engine?.destroy();
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      if (matchingTimeoutRef.current) clearTimeout(matchingTimeoutRef.current);
    };
  }, []);

  const initApp = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'Please login again');
        navigation.goBack();
        return;
      }
      setUserToken(token);

      // Check daily calls limit
      await checkDailyCallsLimit(token);

      // Initialize Agora
      await initAgora();
    } catch (error) {
      console.error('App init error:', error);
      Alert.alert('Error', 'Failed to initialize app');
    }
  };

  // Check daily calls limit (Backend se)
  const checkDailyCallsLimit = async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE}/api/calls/daily-limit`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { callsLeft } = response.data;
      setDailyCallsLeft(callsLeft);
      
      if (callsLeft <= 0) {
        setStatus('limitReached');
      }
    } catch (error: any) {
      console.error('Daily limit check error:', error);
      Alert.alert('Error', 'Unable to check daily limit');
    }
  };

  // Initialize Agora RTC Engine
  const initAgora = async () => {
    try {
      const agoraEngine = await AgoraRtcEngine.create(AGORA_APP_ID);
      await agoraEngine.enableVideo();
      await agoraEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await agoraEngine.enableDualStreamMode(true);
      await agoraEngine.setClientRole(0);

      setEngine(agoraEngine);

      agoraEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('✅ Joined channel:', channel, 'uid:', uid);
        setStatus('calling');
      });

      agoraEngine.addListener('UserJoined', (uid, elapsed) => {
        console.log('✅ Remote user joined:', uid);
        setRemoteUid(uid);
        setStatus('matched');
        if (matchingTimeoutRef.current) clearTimeout(matchingTimeoutRef.current);
      });

      agoraEngine.addListener('UserOffline', (uid, reason) => {
        console.log('❌ User offline:', uid, reason);
        endCall();
      });

      agoraEngine.addListener('Error', (err: ErrorCodeType) => {
        console.log('❌ Agora error:', err);
        endCall();
      });

    } catch (error) {
      console.error('Agora init error:', error);
      Alert.alert('Error', 'Failed to initialize video');
    }
  };

  // Pulse
