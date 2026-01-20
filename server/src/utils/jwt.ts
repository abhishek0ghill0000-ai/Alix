import jwt from 'jsonwebtoken';
import env from '../config/envConfig';

export class JWTUtils {
  static generateAccessToken(payload: { userId: string; uniqueId?: string }) {
    return jwt.sign(payload, env.JWT_SECRET!, {
      expiresIn: env.JWT_EXPIRE, // 7d from env
    });
  }

  static generateRefreshToken(payload: { userId: string }) {
    return jwt.sign(payload, env.JWT_SECRET!, {
      expiresIn: '30d',
    });
  }

  static verifyToken(token: string): { userId: string; uniqueId?: string } {
    return jwt.verify(token, env.JWT_SECRET!) as { userId: string; uniqueId?: string };
  }

  static decodeToken(token: string) {
    return jwt.decode(token);
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded.exp) return false;
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }
}

// Usage in authMiddleware.ts
// const decoded = JWTUtils.verifyToken(token);
// req.userId = decoded.userId;