import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';
import env from '../config/envConfig';

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });
  }

  static async signup(username: string, email: string, password: string) {
    const existing = await UserModel.findByUsername(username);
    if (existing) throw new Error('Username taken');

    const existingEmail = await UserModel.findByUsername(email);
    if (existingEmail) throw new Error('Email already registered');

    const hash = await this.hashPassword(password);
    const user = await UserModel.create({ username, email, passwordHash: hash });
    
    const token = this.generateToken(user.id);
    return { user, token };
  }

  static async login(username: string, password: string) {
    const user = await UserModel.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');

    const valid = await this.comparePassword(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const token = this.generateToken(user.id);
    return { user, token };
  }
}