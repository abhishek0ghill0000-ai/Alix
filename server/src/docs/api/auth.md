Authentication System - Alix App

## JWT + Password Auth Flow
User signup/login → JWT token (7d expiry)All protected routes → Bearer token validationRefresh token → Auto silent renewal (14d)Rate limit: 5 attempts/min per IP
## Users Schema (Neon + Drizzle)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);Backend API Endpoints (Node.js + Express + Drizzle)import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

// Utils
const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: '14d' });
  return { accessToken, refreshToken };
};

// POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existing = await db.query.users.findFirst({
      where: (users, { or }) => or(
        eq(users.username, username),
        eq(users.email, email)
      )
    });
    
    if (existing) {
      return res.status(409).json({ error: 'User exists' });
    }
    
    const passwordHash = await hashPassword(password);
    
    const [newUser] = await db.insert(users)
      .values({ username, email, password_hash: passwordHash })
      .returning();
    
    const { accessToken, refreshToken } = generateTokens(newUser.id);
    
    // Store refresh token
    const refreshHash = await hashPassword(refreshToken);
    await db.insert(refresh_tokens).values({
      user_id: newUser.id,
      token_hash: refreshHash,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });
    
    res.json({
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.query.users.findFirst({
      where: eq(users.username, username)
    });
    
    if (!user || !await verifyPassword(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    // Rotate refresh token
    await db.delete(refresh_tokens).where(eq(refresh_tokens.user_id, user.id));
    const refreshHash = await hashPassword(refreshToken);
    await db.insert(refresh_tokens).values({
      user_id: user.id,
      token_hash: refreshHash,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });
    
    await db.update(users)
      .set({ last_login: new Date() })
      .where(eq(users.id, user.id));
    
    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
app.post('/api/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    const tokenRecord = await db.query.refresh_tokens.findFirst({
      where: eq(refresh_tokens.user_id, decoded.userId)
    });
    
    if (!tokenRecord || !await verifyPassword(refreshToken, tokenRecord.token_hash)) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId)
    });
    
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    
    // Rotate refresh token
    await db.delete(refresh_tokens).where(eq(refresh_tokens.user_id, user.id));
    const newRefreshHash = await hashPassword(newRefreshToken);
    await db.insert(refresh_tokens).values({
      user_id: user.id,
      token_hash: newRefreshHash,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    });
    
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ error: 'Refresh failed' });
  }
});

// Middleware - Protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Usage
app.get('/api/profile', authenticateToken, async (req, res) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user.userId)
  });
  res.json({ username: user.username, email: user.email });
});Client React Native Auth Hook (useAuth.js)import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedAccess = await AsyncStorage.getItem('accessToken');
      const storedRefresh = await AsyncStorage.getItem('refreshToken');
      
      if (storedAccess && storedRefresh) {
        const decoded = jwtDecode(storedAccess);
        if (decoded.exp * 1000 > Date.now()) {
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
          setUser({ id: decoded.userId });
        } else {
          await refreshAuth();
        }
      }
    } catch (error) {
      console.error('Load auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const storedRefresh = await AsyncStorage.getItem('refreshToken');
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: storedRefresh })
      });
      
      if (res.ok) {
        const { accessToken, refreshToken } = await res.json();
        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken]
        ]);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
      } else {
        logout();
      }
    } catch (error) {
      logout();
    }
  };

  const login = async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (res.ok) {
      const { user, accessToken, refreshToken } = await res.json();
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken]
      ]);
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return { success: true };
    }
    return { success: false, error: 'Login failed' };
  };

  const signup = async (username, email, password) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    if (res.ok) {
      const { user, accessToken, refreshToken } = await res.json();
      await AsyncStorage.multiSet([
        ['accessToken', accessToken],
        ['refreshToken', refreshToken]
      ]);
      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      return { success: true };
    }
    return { success: false, error: 'Signup failed' };
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const value = {
    user,
    accessToken,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};Test Commands# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your_refresh_token_here"}'

# Protected route
curl http://localhost:3000/api/profile \
  -H "Authorization: Bearer your_access_token_here"Environment Variables (.env)DATABASE_URL=postgresql://user:pass@your-neon-db.neon.tech/dbname
JWT_SECRET=your-super-secret-jwt-key-min32-chars-change-this
REFRESH_SECRET=your-refresh-secret-key-min32-chars-change-this