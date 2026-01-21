import bcrypt from 'bcryptjs';

export class PasswordUtils {
  static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static isStrongPassword(password: string): boolean {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    return password.length >= minLength && 
           hasUpper && hasLower && 
           hasNumber && hasSpecial;
  }

  static generateSecureRandom(length: number = 32): string {
    return require('crypto').randomBytes(length).toString('hex');
  }
}

// Usage in authService.ts
// const hash = await PasswordUtils.hash(password);
// const valid = await PasswordUtils.compare(input, hash);