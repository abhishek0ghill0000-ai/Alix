// Alix App - Agora Call Hook
// client/hooks/useAgoraCall.ts

import { useState, useEffect, useCallback } from 'react';
import { RtcEngine, ClientRole, ChannelMediaRelayType } from 'react-native-agora';
import { fetchAgoraToken, createAgoraClient, AGORA_APP_ID, DEFAULT_CHANNEL } from '../config/callConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAgoraCall = (userId: string) => {
  const [engine, setEngine] = useState<RtcEngine | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);
  const [channel, setChannel] = useState(DEFAULT_CHANNEL);
  const [token, setToken] = useState('');

  const uid = parseInt(userId) || 0;

  // Initialize Agora Engine
  useEffect(() => {
    const initEngine = async () => {
      const agoraEngine = await RtcEngine.create(AGORA_APP_ID);
      await agoraEngine.enableVideo();
      await agoraEngine.setChannelProfile(1); // Communication
      setEngine(agoraEngine);
    };
    initEngine();

    return () => {
      engine?.destroy();
    };
  }, []);

  // Join random/private channel
  const joinChannel = useCallback(async (targetChannel?: string, isRandom = true) => {
    if (!engine) return;

    try {
      const ch = targetChannel || DEFAULT_CHANNEL + Date.now(); // Unique for random
      setChannel(ch);

      const newToken = await fetchAgoraToken(ch, uid);
      setToken(newToken);

      await engine.joinChannel(newToken, ch, null, uid);

      // Event listeners
      engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        setIsJoined(true);
        console.log('Joined channel:', channel);
      });

      engine.addListener('UserJoined', (uid, elapsed) => {
        setRemoteUsers(prev => [...prev, uid.toString()]);
        // Show remote user ID at bottom for friend request
        console.log('Remote user ID:', uid);
      });

      engine.addListener('UserOffline', (uid, reason) => {
        setRemoteUsers(prev => prev.filter(u => u !== uid.toString()));
      });

      setIsJoined(true);
    } catch (error) {
      console.error('Join channel failed:', error);
    }
  }, [engine, uid]);

  // Leave channel (end call)
  const leaveChannel = useCallback(async () => {
    if (engine && isJoined) {
      await engine.leaveChannel();
      setIsJoined(false);
      setRemoteUsers([]);
      setToken('');
    }
  }, [engine, isJoined]);

  // Send friend request during call (using remote user ID)
  const sendFriendRequest = async (remoteUid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/friends/request`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await AsyncStorage.getItem('token')}` },
        body: JSON.stringify({ toUserId: remoteUid }),
      });
      return response.ok;
    } catch (error) {
      console.error('Friend request failed:', error);
      return false;
    }
  };

  return {
    engine,
    isJoined,
    remoteUsers,
    channel,
    joinChannel,
    leaveChannel,
    sendFriendRequest,
    localUid: uid,
  };
};