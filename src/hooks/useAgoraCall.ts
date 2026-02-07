// src/hooks/useAgoraCall.ts
import { useState, useCallback, useEffect } from 'react';
import { RtcEngine, ChannelProfile, ClientRole } from 'react-native-agora';
import { CALL_CONFIG, CALL_ROLES } from '../config/callConfig';
import { callsAPI } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAgoraCallReturn {
  initializeCall: (channelName?: string) => Promise<void>;
  joinCall: (token: string) => Promise<void>;
  leaveCall: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  toggleMute: () => Promise<void>;
  isJoined: boolean;
  remoteUsers: number[];
  engine: RtcEngine | null;
}

export const useAgoraCall = (): UseAgoraCallReturn => {
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<number[]>([]);
  const [engine, setEngine] = useRef<RtcEngine | null>(null);

  const initializeEngine = useCallback(async () => {
    const rtcEngine = await RtcEngine.create(CALL_CONFIG.AGORA.APP_ID);
    
    // Setup
    await rtcEngine.enableVideo();
    await rtcEngine.setChannelProfile(ChannelProfile.Communication);
    await rtcEngine.setClientRole(ClientRole.RemoteUser);
    
    // Events
    rtcEngine.addListener('JoinChannelSuccess', () => setIsJoined(true));
    rtcEngine.addListener('UserJoined', (uid) => {
      setRemoteUsers(prev => [...prev, uid]);
    });
    rtcEngine.addListener('UserOffline', (uid) => {
      setRemoteUsers(prev => prev.filter(u => u !== uid));
    });

    setEngine(rtcEngine);
  }, []);

  const initializeCall = async (channelName?: string) => {
    await initializeEngine();
    
    const randomChannel = channelName || generateRandomChannel();
    const { data } = await callsAPI.generateToken(randomChannel);
    
    await AsyncStorage.setItem('currentChannel', randomChannel);
    await AsyncStorage.setItem('currentToken', data.token);
    
    await joinCall(data.token);
  };

  const joinCall = async (token: string) => {
    if (!engine.current) return;
    
    const channel = await AsyncStorage.getItem('currentChannel') || '';
    await engine.current!.joinChannel(token, channel, null, 0);
  };

  const leaveCall = async () => {
    if (engine.current) {
      await engine.current.leaveChannel();
      await engine.current.destroy();
      setEngine(null);
    }
    setIsJoined(false);
    setRemoteUsers([]);
    await AsyncStorage.multiRemove(['currentChannel', 'currentToken']);
  };

  const toggleCamera = async () => {
    if (engine.current) {
      await engine.current.switchCamera();
    }
  };

  const toggleMute = async () => {
    if (engine.current) {
      const muted = await engine.current.isMuteLocalAudioStream();
      await engine.current.muteLocalAudioStream(!muted);
    }
  };

  const generateRandomChannel = () => {
    return `${CALL_CONFIG.CALL_SETTINGS.RANDOM_CHANNEL_PREFIX}${Date.now()}`;
  };

  return {
    initializeCall,
    joinCall,
    leaveCall,
    toggleCamera,
    toggleMute,
    isJoined,
    remoteUsers,
    engine: engine.current,
  };
};