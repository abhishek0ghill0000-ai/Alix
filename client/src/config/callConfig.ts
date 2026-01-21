// Alix App - Agora Call Configuration
// client/config/callConfig.ts

import { createClient, ClientRole } from 'agora-rn-uikit'; // or agora-rtc-sdk-ng

// Production Agora credentials from screenshots
export const AGORA_APP_ID = 'e1127c5d5b6ea8b72133';
export const AGORA_CERTIFICATE = '85572970a4b60f8d520e'; // App Certificate
export const AGORA_TOKEN_SERVER_URL = 'https://agora-node-token-server-2vonrder.com'; // Your Render server
export const DEFAULT_CHANNEL = 'Synce'; // Default for random calls, override for private

// Token expiration (24 hours for production)
const TOKEN_EXPIRATION = 24 * 60 * 60; // seconds

// Fetch RTC token from your Node.js token server
export const fetchAgoraToken = async (channel: string, uid: number): Promise<string> => {
  try {
    const response = await fetch(`${AGORA_TOKEN_SERVER_URL}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channelName: channel || DEFAULT_CHANNEL,
        uid: uid.toString(),
        role: ClientRole.Broadcaster, // For video calls
        appId: AGORA_APP_ID,
        expiration: TOKEN_EXPIRATION,
      }),
    });

    if (!response.ok) throw new Error('Token fetch failed');
    
    const { rtcToken } = await response.json();
    return rtcToken;
  } catch (error) {
    console.error('Agora token error:', error);
    throw error;
  }
};

// Create Agora client helper for random/private calls
export const createAgoraClient = (token: string, channel: string, uid: number) => {
  const client = createClient({
    appId: AGORA_APP_ID,
    channel,
    token,
    uid,
    role: ClientRole.Broadcaster,
    enableVideo: true,
    enableAudio: true,
  });

  // Renew token on expiry
  client.on('token-privilege-will-expire', async () => {
    try {
      const newToken = await fetchAgoraToken(channel, uid);
      await client.renewToken(newToken);
    } catch (error) {
      console.error('Token renewal failed:', error);
    }
  });

  return client;
};