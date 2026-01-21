import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { RtcEngine, ChannelProfile, ClientRole, VideoRenderMode } from 'react-native-agora';
import { useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialIcons';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob'; // Or expo-ads-admob
import { InterstitialAd, AdEventType } from '@react-native-firebase/admob';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ADMOB_APP_ID = 'ca-app-pub-5171256747475043~904923918';
const ADMOB_AD_UNIT = 'ca-app-pub-5171256747472150~4306';
const AGORA_APP_ID = 'e117c5d58b6ea7b2133'; // Your full App ID from screenshot
const TOKEN_SERVER = 'https://agora-node-token-two-renderer.com';
const BACKEND_URL = 'https://alix-renderer.com';

const interstitial = InterstitialAd.createForAdRequest(ADMOB_AD_UNIT, {
  // Test on emulator
});

let callCount = 0; // Persist via AsyncStorage in production

const RandomCallScreen = () => {
  const router = useRouter();
  const engine = useRef<RtcEngine | null>(null);
  const [isJoined = false, setJoined] = useState(false);
  const [remoteUid, setRemoteUid] = useState(0);
  const [remoteUserId, setRemoteUserId] = useState('');
  const [channel, setChannel] = useState('random_' + Math.random().toString(36).substr(2, 9));
  const [showAd, setShowAd] = useState(false);
  const localVideoRef = useRef<View>(null);
  const remoteVideoRef = useRef<View>(null);

  useEffect(() => {
    initAgora();
    return () => {
      leaveChannel();
    };
  }, []);

  const initAgora = async () => {
    engine.current = await RtcEngine.create(AGORA_APP_ID);
    await engine.current.enableVideo();
    await engine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await engine.current.setClientRole(ClientRole.Broadcaster);

    engine.current.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      setJoined(true);
      console.log('Joined channel:', channel, uid);
    });

    engine.current.addListener('UserJoined', (uid, elapsed) => {
      setRemoteUid(uid);
      fetchRemoteUserId(uid);
    });

    engine.current.addListener('UserOffline', (uid, reason) => {
      setRemoteUid(0);
      endCall();
    });

    engine.current.addListener('LeaveChannel', () => {
      setJoined(false);
    });

    // Start random match
    startRandomCall();
  };

  const fetchRemoteUserId = async (uid: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/user-by-uid/${uid}`);
      const data = await res.json();
      setRemoteUserId(data.uniqueId || 'Unknown');
    } catch (e) {
      setRemoteUserId('User' + uid);
    }
  };

  const startRandomCall = async () => {
    try {
      // Get random channel and token from backend
      const res = await fetch(`${BACKEND_URL}/random-match`, { method: 'POST' });
      const { channel: ch, token } = await res.json();
      setChannel(ch);

      await engine.current?.joinChannel(token, ch, null, 0);
      callCount++;
      if (callCount % 8 === 0) {
        setShowAd(true);
      }
    } catch (e) {
      Alert.alert('Match Error', 'Try again');
      router.back();
    }
  };

  const leaveChannel = async () => {
    await engine.current?.leaveChannel();
    setJoined(false);
    setRemoteUid(0);
  };

  const endCall = () => {
    leaveChannel();
    if (showAd) {
      interstitial.load();
      interstitial.show();
    } else {
      startRandomCall(); // Next match
    }
  };

  const sendFriendRequest = () => {
    fetch(`${BACKEND_URL}/friend-request`, {
      method: 'POST',
      body: JSON.stringify({ toId: remoteUserId }),
      headers: { 'Content-Type': 'application/json' },
    });
    Alert.alert('Friend request sent!');
  };

  if (!isJoined) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.waitText}>Finding random match...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Remote Video - Full Screen */}
      <View style={styles.remoteVideo} ref={remoteVideoRef}>
        {remoteUid ? (
          engine.current?.setupRemoteVideo(remoteVideoRef.current!, remoteUid, VideoRenderMode.Hidden, 0)
        ) : (
          <ActivityIndicator size="large" color="#fff" />
        )}
      </View>

      {/* Local Video - Small Overlay */}
      <View style={styles.localVideo} ref={localVideoRef}>
        {engine.current?.setupLocalVideo(localVideoRef.current!, VideoRenderMode.Hidden, 0)}
      </View>

      {/* Bottom Bar: User ID, Controls */}
      <View style={styles.bottomBar}>
        <Text style={styles.userId}>@{remoteUserId}</Text>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.iconBtn} onPress={sendFriendRequest}>
            <Icon name="person-add" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.endBtn} onPress={endCall}>
            <Icon name="call-end" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
            <Icon name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Ad if needed */}
      {showAd && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={ADMOB_AD_UNIT}
            size={BannerAdSize.FULL_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#222',
  },
  localVideo: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  userId: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
  },
  waitText: {
    marginTop: 20,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RandomCallScreen;