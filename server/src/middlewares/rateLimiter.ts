import rateLimit from 'express-rate-limit';
import env from '../config/envConfig';

const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs, // 15 minutes
    max,      // Limit each IP
    message: {
      success: false,
      error: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: `Rate limit exceeded. Retry in ${Math.round(windowMs / 60000)} minutes.`,
        remaining: 0,
      });
    },
  });

// Different limits for routes
export const authLimiter = createRateLimiter(15 * 60 * 1000, 10); // 10 login/signup per 15min
export const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 API calls
export const agoraTokenLimiter = createRateLimiter(60 * 1000, 5); // 5 tokens/min (spam protection)
export const postLimiter = createRateLimiter(60 * 1000, 3); // 3 posts/min

// Global limiter (fallback)
export const globalLimiter = createRateLimiter(
  Number(env.RATE_LIMIT_WINDOW_MS),
  Number(env.MAX_REQUESTS)
);