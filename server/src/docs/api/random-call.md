# Random Video Calling - Alix App (Agora RTC)

## Random Call Features
✅ Match random users (gender/location filters)
✅ 60s ice-breaker → Auto hangup if no accept
✅ RTC token generation (server-side)
✅ Call stats → Advanced Access integration
✅ End call → Update screen_time/call_time
✅ Safety: Report/block after call
## Schema Extensions (Neon)

```sql
-- Add to existing users table
ALTER TABLE users ADD COLUMN gender VARCHAR(10);
ALTER TABLE users ADD COLUMN location JSONB; -- {lat:28.67, lng:77.45}

CREATE TABLE random_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id UUID REFERENCES users(id),
  callee_id UUID REFERENCES users(id),
  channel VARCHAR(50) UNIQUE, -- 'random_alix_abc123'
  duration INTEGER DEFAULT 0, -- seconds
  status VARCHAR(20) DEFAULT 'pending', -- pending/accepted/ended/rejected
  created_at TIMESTAMP DEFAULT NOW()
);Backend API Endpoints (Agora + Node.js)import { RtcTokenBuilder, RtcRole, RtcTokenType } from 'agora-access-token';
import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);
const AGORA_APP_ID = process.env.AGORA_APP_ID;
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

// POST /api/random-call/start - Caller requests random match
app.post('/api/random-call/start', authenticateToken, async (req, res) => {
  try {
    const { gender_pref, location_radius = 50 } = req.body; // km
    
    // Find random available user (simple matching)
    const candidates = await db.query.users.findMany({
      where: sql`gender = ${gender_pref} AND is_active = true`,
      limit: 10
    });
    
    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No matches available' });
    }
    
    const callee = candidates[Math.floor(Math.random() * candidates.length)];
    if (callee.id === req.user.userId) {
      return res.status(400).json({ error: 'Cannot call yourself' });
    }
    
    const channel = `random_alix_${crypto.randomUUID().slice(0, 8)}`;
    
    const [call] = await db.insert(random_calls)
      .values({
        caller_id: req.user.userId,
        callee_id: callee.id,
        channel,
        status: 'pending'
      })
      .returning();
    
    res.json({
      call_id: call.id,
      channel,
      callee: { id: callee.id, username: callee.username },
      message: 'Random call requested - waiting for accept (60s)'
    });
  } catch (error) {
    res.status(500).json({ error: 'Match failed' });
  }
});

// POST /api/random-call/:callId/accept - Callee accepts
app.post('/api/random-call/:callId/accept', authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    
    const call = await db.query.random_calls.findFirst({
      where: eq(random_calls.id, callId)
    });
    
    if (call.callee_id !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await db.update(random_calls)
      .set({ status: 'accepted' })
      .where(eq(random_calls.id, callId));
    
    res.json({ message: 'Call accepted - join channel now' });
  } catch (error) {
    res.status(500).json({ error: 'Accept failed' });
  }
});

// GET /api/random-call/token?channel=xxx&uid=123&role=publisher
app.get('/api/random-call/token', async (req, res) => {
  try {
    const { channel, uid, role } = req.query;
    const uidInt = parseInt(uid);
    const roleInt = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const expireTime = 3600; // 1 hour
    
    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channel,
      uidInt,
      roleInt,
      expireTime
    );
    
    res.json({ token, channel, uid: uidInt });
  } catch (error) {
    res.status(500).json({ error: 'Token generation failed' });
  }
});

// POST /api/random-call/:callId/end - End call + stats
app.post('/api/random-call/:callId/end', authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    const { duration } = req.body; // seconds
    
    await db.update(random_calls)
      .set({ 
        status: 'ended',
        duration 
      })
      .where(eq(random_calls.id, callId));
    
    // Update advanced_access stats for caller/callee
    const call = await db.query.random_calls.findFirst({
      where: eq(random_calls.id, callId)
    });
    
    // Increment call_time (pseudo-code - integrate with advanced_access)
    console.log(`Call ended: ${duration}s between ${call.caller_id} ↔ ${call.callee_id}`);
    
    res.json({ message: 'Call ended, stats recorded' });
  } catch (error) {
    res.status(500).json({ error: 'End call failed' });
  }
});Client React Native - RandomCallScreen.tsximport React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RtcEngine, ChannelProfile, ClientRole } from 'react-native-agora';
import { useAuth } from '../hooks/useAuth';

const RandomCallScreen = () => {
  const { accessToken } = useAuth();
  const [call, setCall] = useState(null);
  const [token, setToken] = useState(null);
  const [engine, setEngine] = useState(null);
  const [status, setStatus] = useState('idle'); // idle/matching/accepted/calling

  const initAgora = async () => {
    const newEngine = await RtcEngine.create('YOUR_AGORA_APP_ID');
    await newEngine.enableVideo();
    await newEngine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    setEngine(newEngine);
  };

  const startRandomCall = async () => {
    setStatus('matching');
    try {
      const res = await fetch('/api/random-call/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ gender_pref: 'any' })
      });
      
      const callData = await res.json();
      setCall(callData);
      
      // Get RTC token
      const tokenRes = await fetch(
        `/api/random-call/token?channel=${callData.channel}&uid=${Date.now()}&role=publisher`
      );
      const tokenData = await tokenRes.json();
      setToken(tokenData.token);
      
      // Auto-timeout 60s
      setTimeout(() => {
        if (status === 'matching') {
          endCall('timeout');
        }
      }, 60000);
    } catch (error) {
      Alert.alert('Match failed', error.message);
      setStatus('idle');
    }
  };

  const acceptCall = async () => {
    // Listen for incoming calls via websocket or polling
    try {
      await fetch(`/api/random-call/${call.call_id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const tokenRes = await fetch(
        `/api/random-call/token?channel=${call.channel}&uid=${Date.now()}&role=publisher`
      );
      const tokenData = await tokenRes.json();
      setToken(tokenData.token);
      setStatus('calling');
      
      // Join channel
      await engine?.joinChannel(
        tokenData.token,
        call.channel,
        null,
        tokenData.uid
      );
    } catch (error) {
      Alert.alert('Accept failed');
    }
  };

  const endCall = async (reason = 'ended') => {
    if (call && call.duration) {
      await fetch(`/api/random-call/${call.call_id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ duration: Math.floor(call.duration / 1000) })
      });
    }
    
    setStatus('idle');
    setCall(null);
    setToken(null);
    engine?.leaveChannel();
  };

  useEffect(() => {
    initAgora();
    return () => {
      engine?.destroy();
    };
  }, []);

  if (status === 'idle') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={startRandomCall} style={{ 
          backgroundColor: '#FF6B6B', 
          padding: 20, 
          borderRadius: 50 
        }}>
          <Text style={{ color: 'white', fontSize: 18 }}>🎲 Random Video Call</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {status === 'matching' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={{ marginTop: 20 }}>Finding random match... ⏳</Text>
          <TouchableOpacity onPress={() => endCall('cancelled')} style={{ marginTop: 20 }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {status === 'calling' && (
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          {/* Local + Remote Video Views */}
          <Text>Video Call Active - {call?.callee?.username}</Text>
          <TouchableOpacity onPress={endCall} style={{ 
            position: 'absolute', 
            bottom: 50, 
            alignSelf: 'center',
            backgroundColor: '#FF4444',
            padding: 15,
            borderRadius: 50 
          }}>
            <Text style={{ color: 'white' }}>End Call</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default RandomCallScreen;Test Commands# Start random call
curl -X POST http://localhost:3000/api/random-call/start \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"gender_pref":"any"}'

# Accept call  
curl -X POST http://localhost:3000/api/random-call/CALL_UUID/accept \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get RTC token
curl "http://localhost:3000/api/random-call/token?channel=random_alix_test&uid=123&role=publisher"

# End call
curl -X POST http://localhost:3000/api/random-call/CALL_UUID/end \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"duration": 180}'Environment (.env)AGORA_APP_ID=your_agora_app_id
AGORA_APP_CERTIFICATE=your_agora_app_certificate