Advanced Access Control - Alix App

## Privacy-First Monitoring System

1. **Owner** → Generate one-time 6-digit code
2. **Friend** uses code → Permanent access link created
3. **Link breaks ONLY if**:
   - User manually unlinks (`DELETE /api/advanced-access/:id`)
   - Owner account deleted

## Visible Metrics Table

| Metric              | Scope     | ✅ Visible | Example Value     |
|---------------------|-----------|-----------|-------------------|
| Total Call Time     | Today     | ✅ YES     | 2h 30m (9000s)    |
| Total Call Time     | Weekly    | ✅ YES     | 12h 45m (45900s)  |
| Call Count          | Total     | ✅ YES     | 47 calls          |
| Screen Time         | App usage | ✅ YES     | 8h 22m (30120s)   |
| Location            | Last seen | ✅ YES     | {lat:28.67,lng:77.45} |

**❌ Hidden**: Phone contacts, Messages, Audio recordings, Live GPS tracking

## Neon PostgreSQL Schema (Drizzle)

```sql
CREATE TABLE advanced_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  accessed_by UUID REFERENCES users(id),
  code VARCHAR(6),
  total_call_time_today INTEGER DEFAULT 0,
  total_call_time_weekly INTEGER DEFAULT 0,
  call_count INTEGER DEFAULT 0,
  screen_time INTEGER DEFAULT 0,
  last_location JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);Backend API Endpoints (Node.js + Express)// POST /api/advanced-access/link - Generate permanent link
app.post('/api/advanced-access/link', async (req, res) => {
  const { code } = req.body;
  // 1. Validate one-time code
  const access = await db.query.advanced_access.findFirst({
    where: eq(advanced_access.code, code)
  });
  if (!access || !access.active) {
    return res.status(400).json({ error: 'Invalid/expired code' });
  }
  
  // 2. Generate permanent link
  const linkId = crypto.randomUUID();
  await db.insert(advanced_access_links).values({
    id: linkId,
    access_id: access.id,
    url: `https://alix.app/access/${linkId}`
  });
  
  res.json({ 
    link: `https://alix.app/access/${linkId}`,
    message: 'Permanent access link created'
  });
});

// GET /api/advanced-access/data/:linkId - Fetch stats
app.get('/api/advanced-access/data/:linkId', async (req, res) => {
  const { linkId } = req.params;
  
  const link = await db.query.advanced_access_links.findFirst({
    where: eq(advanced_access_links.id, linkId),
    with: {
      access: true
    }
  });
  
  if (!link || !link.access.active) {
    return res.status(404).json({ error: 'Access revoked' });
  }
  
  res.json({
    total_call_time_today: link.access.total_call_time_today,
    total_call_time_weekly: link.access.total_call_time_weekly,
    call_count: link.access.call_count,
    screen_time: link.access.screen_time,
    last_location: link.access.last_location
  });
});

// DELETE /api/advanced-access/:linkId - Revoke access
app.delete('/api/advanced-access/:linkId', async (req, res) => {
  const { linkId } = req.params;
  await db.update(advanced_access_links)
    .set({ active: false })
    .where(eq(advanced_access_links.id, linkId));
  res.json({ message: 'Access revoked' });
});Client React Native Screen (AdvancedAccessScreen.tsx)import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const AdvancedAccessScreen = ({ route }) => {
  const { linkId } = route.params;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Background timer to refresh stats
    const interval = setInterval(fetchStats, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/advanced-access/data/${linkId}`);
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Fetch stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Monitoring Stats</Text>
      <Text>Call Time Today: {stats?.total_call_time_today / 3600}h</Text>
      <Text>Call Time Weekly: {stats?.total_call_time_weekly / 3600}h</Text>
      <Text>Call Count: {stats?.call_count}</Text>
      <Text>Screen Time: {stats?.screen_time / 3600}h</Text>
      <Text>Location: {stats?.last_location?.lat}, {stats?.last_location?.lng}</Text>
    </View>
  );
};Usage FlowOwner sends 6-digit code via chatFriend enters code → Gets permanent alix.app/access/xxx linkLink auto-refreshes stats every 30s in backgroundOwner sees real-time dashboard at /advanced-accessTest Commands# Generate link
curl -X POST https://your-alix-server.com/api/advanced-access/link \
  -H "Content-Type: application/json" \
  -d '{"code": "123456"}'

# View stats
curl https://your-alix-server.com/api/advanced-access/data/abc123-link-id

# Revoke access
curl -X DELETE https://your-alix-server.com/api/advanced-access/abc123-link-id