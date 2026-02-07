// src/screens/RandomCallScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AgoraRtcEngine, { RtcEngine, VideoRenderMode, ChannelProfile } from 'react-native-agora';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type RootStackParamList = {
  RandomCall: undefined;
  ChatScreen: { userId: string; userName: string };
};

// Backend API config
const API_BASE = 'https://alix-api.onrender.com';
const AGORA_APP_ID = 'e11f87secd5b86ae8b7a2131';

const RandomCallScreen = () => {
  const navigation = useNavigation<any>();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState<'waiting' | 'connecting' | 'matched' | 'calling'>('waiting');
  const [remoteUid, setRemoteUid] = useState(0);
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [channel, setChannel] = useState('');
  const pulseAnim = useState(new Animated.Value(1))[0];
  const [userToken, setUserToken] = useState('');

  // Initialize Agora RTC Engine
  useEffect(() => {
    initAgora();
    return () => {
      engine?.destroy();
    };
  }, []);

  const initAgora = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No auth token');
      setUserToken(token);

      // Initialize Agora Engine
      const agoraEngine = await AgoraRtcEngine.create(AGORA_APP_ID);
      await agoraEngine.enableVideo();
      await agoraEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
      await agoraEngine.enableDualStreamMode(true);
      
      setEngine(agoraEngine);
      
      // Event listeners
      agoraEngine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('Joined channel:', channel, 'uid:', uid);
        setStatus('calling');
      });

      agoraEngine.addListener('UserJoined', (uid, elapsed) => {
        console.log('Remote user joined:', uid);
        setRemoteUid(uid);
        setStatus('matched');
      });

      agoraEngine.addListener('UserOffline', (uid, reason) => {
        console.log('User offline:', uid);
        setRemoteUid(0);
        setStatus('waiting');
        setCountdown(5);
      });

      agoraEngine.addListener('RtcStats', (stats) => {
        // Handle stats
      });
    } catch (error) {
      console.error('Agora init error:', error);
      Alert.alert('Error', 'Failed to initialize video call');
    }
  };

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Countdown timer
  useEffect(() => {
    if (status === 'waiting') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            findMatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  // Find match via backend
  const findMatch = async () => {
    try {
      setStatus('connecting');
      
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE}/api/calls`, {
        type: 'random',
        location: { lat: 28.6139, lng: 77.2090 },
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { channel, token: agoraToken, uid } = response.data;
      setChannel(channel);

      // Join Agora channel
      if (engine && agoraToken) {
        await engine?.joinChannel(agoraToken, channel, '', uid || 0);
      }

      setTimeout(() => {
        if (remoteUid === 0) {
          Alert.alert('No Match', 'Try again?');
          setStatus('waiting');
          setCountdown(5);
        }
      }, 10000);
    } catch (error: any) {
      console.error('Match error:', error);
      setStatus('waiting');
      setCountdown(5);
      Alert.alert('Error', 'Failed to find match. Trying again...');
    }
  };

  const startCall = useCallback(async () => {
    // Already in call - navigate to chat
    navigation.navigate('ChatScreen', {
      userId: `REMOTE_${remoteUid}`,
      userName: 'Random Stranger',
    });
  }, [navigation, remoteUid]);

  const declineCall = () => {
    engine?.leaveChannel();
    setStatus('waiting');
    setCountdown(5);
    setRemoteUid(0);
  };

  const renderLocalVideo = () => {
    if (!engine) return null;
    return (
      <View style={styles.localVideoContainer}>
        {/* Local video preview - small corner view */}
      </View>
    );
  };

  const renderRemoteVideo = () => {
    if (!remoteUid || !engine) return null;
    return (
      <View style={styles.remoteVideoContainer}>
        {/* Remote video - full screen */}
        <Text style={styles.videoPlaceholder}>Remote Video Here (UID: {remoteUid})</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/ui/icon_close.png')} style={styles.closeIcon} />
        </TouchableOpacity>

        {/* Video Views */}
        {renderRemoteVideo()}
        {renderLocalVideo()}

        {/* Status Overlay */}
        <View style={styles.statusContainer}>
          {status === 'waiting' && (
            <>
              <Text style={styles.statusTitle}>Finding Match</Text>
              <Animated.View style={[styles.searchingIndicator, { transform: [{ scale: pulseAnim }] }]}>
                <Image source={require('../assets/icons/features/icon_searching.png')} style={styles.searchingIcon} />
              </Animated.View>
              <Text style={styles.countdown}>{countdown}</Text>
            </>
          )}

          {status === 'connecting' && (
            <>
              <Text style={styles.statusTitle}>Connecting...</Text>
              <View style={styles.dotsContainer}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </>
          )}

          {status === 'matched' && (
            <>
              <Image source={require('../assets/images/placeholders/default_avatar.png')} style={styles.matchedAvatar} />
              <Text style={styles.matchedTitle}>Match Found!</Text>
              <Text style={styles.matchedSubtitle}>Ready to chat?</Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        {status === 'matched' && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.declineButton]} onPress={declineCall}>
              <Image source={require('../assets/icons/call/icon_decline.png')} style={styles.actionIcon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={startCall}>
              <Image source={require('../assets/icons/call/icon_accept.png')} style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { flex: 1, position: 'relative' },
  closeButton: {
    position: 'absolute', top: 60, right: 20, zIndex: 10, width: 44, height: 44,
    borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  closeIcon: { width: 22, height: 22, tintColor: '#FFFFFF' },
  statusContainer: { position: 'absolute', top: '20%', alignSelf: 'center', alignItems: 'center', zIndex: 20 },
  statusTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 32 },
  searchingIndicator: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
  },
  searchingIcon: { width: 64, height: 64, tintColor: '#3B82F6' },
  countdown: { fontSize: 48, fontWeight: '900', color: '#3B82F6' },
  dotsContainer: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#94A3B8', marginHorizontal: 4 },
  dot1: { animation: 'pulse 1s infinite' }, dot2: { animation: 'pulse 1s infinite 0.2s' }, dot3: { animation: 'pulse 1s infinite 0.4s' },
  matchedAvatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 24, borderWidth: 4, borderColor: '#10B981' },
  matchedTitle: { fontSize: 28, fontWeight: '900', color: '#10B981', marginBottom: 8 },
  matchedSubtitle: { fontSize: 18, color: '#94A3B8', marginBottom: 48 },
  actionButtons: { position: 'absolute', bottom: 80, flexDirection: 'row', gap: 24, alignSelf: 'center' },
  actionButton: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', elevation: 10 },
  declineButton: { backgroundColor: '#EF4444' },
  acceptButton: { backgroundColor: '#10B981', width: 100, height: 100, borderRadius: 50 },
  actionIcon: { width: 36, height: 36, tintColor: '#FFFFFF' },
  // Video styles
  remoteVideoContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  localVideoContainer: { position: 'absolute', bottom: 200, right: 20, width: 120, height: 160, borderRadius: 12, backgroundColor: '#3B82F6' },
  videoPlaceholder: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', color: '#FFF', fontSize: 16 },
});

export default RandomCallScreen;
