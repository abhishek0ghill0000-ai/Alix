// Alix Server - Neon PostgreSQL Config
// Serverless driver for Render deployment

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../schema'; // schema.ts import

const NEON_URL = process.env.NEON_URL || 'postgres://neon_owner:npKJvY...@ep-dream-170292.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export const dbConnection = neon(NEON_URL);
export const db = drizzle(dbConnection, { schema });

// Connection test
export const testConnection = async (): Promise<boolean> => {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Neon DB connected');
    return true;
  } catch (error) {
    console.error('❌ DB connection failed:', error);
    return false;
  }
};

// Common queries
export const getUserByUniqueId = async (uniqueId: string) => {
  return await db.query.users.findFirst({ where: eq(schema.users.uniqueId, uniqueId) });
};

export const createUser = async (userData: typeof schema.users.$inferInsert) => {
  return await db.insert(schema.users).values(userData).returning();
};

// Init tables (run on startup)
export const initTables = async () => {
  // Users
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(50) UNIQUE NOT NULL,
      uniqueId VARCHAR(15) UNIQUE NOT NULL,
      email VARCHAR(100),
      password_hash TEXT NOT NULL,
      profile_photo TEXT,
      bio TEXT,
      location JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Posts
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id TEXT REFERENCES users(id),
      unique_id VARCHAR(15) REFERENCES users(uniqueId),
      content TEXT NOT NULL,
      image_urls JSONB DEFAULT '[]',
      likes INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      comments_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Chats/Messages (simplified)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id TEXT NOT NULL,
      sender_id TEXT REFERENCES users(id),
      sender_unique_id VARCHAR(15),
      text TEXT,
      image_url TEXT,
      timestamp TIMESTAMP DEFAULT NOW(),
      read BOOLEAN DEFAULT false
    )
  `);

  // Advanced Access
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS advanced_access (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id TEXT REFERENCES users(id),
      accessed_by TEXT REFERENCES users(id),
      total_call_time_today INTEGER DEFAULT 0,
      total_call_time_weekly INTEGER DEFAULT 0,
      call_count INTEGER DEFAULT 0,
      screen_time INTEGER DEFAULT 0,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log('✅ Tables initialized');
};