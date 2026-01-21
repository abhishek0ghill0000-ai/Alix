// Alix Server - Environment Config
// Render deployment vars

import dotenv from 'dotenv';
import z from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  
  // Neon DB
  NEON_URL: z.string().url().min(1),
  
  // Agora
  AGORA_APP_ID: z.string().min(20),
  AGORA_APP_CERT: z.string().min(50),
  
  // JWT (for auth)
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('7d'),
  
  // Render URL
  RENDER_URL: z.string().url().default('https://alix-renderer.com'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  MAX_REQUESTS: z.coerce.number().default(100),
});

const env = envSchema.parse({
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  NEON_URL: process.env.NEON_URL || 'postgres://neon_owner:npKJvY3WzPQWplX1@ep-dream-170292.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  AGORA_APP_ID: process.env.AGORA_APP_ID || 'e117c5d58b6ea78b2131',
  AGORA_APP_CERT: process.env.AGORA_APP_CERT || '8557829704a6f8d50260',
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  RENDER_URL: process.env.RENDER_URL || 'https://alix-renderer.com',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
  MAX_REQUESTS: process.env.MAX_REQUESTS,
});

export default env;

// Usage in server.ts
// import env from './config/envconfig';
// console.log(`Server running on ${env.RENDER_URL}:${env.PORT}`);