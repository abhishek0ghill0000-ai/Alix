import { db } from '../config/dbConfig';
import { screenTime } from '../schema';
import { eq, asc } from 'drizzle-orm';

export class ScreenTimeModel {
  static async recordSession(userId: string, duration: number) {
    await db.insert(screenTime).values({
      userId,
      sessionDuration: duration,
      timestamp: new Date(),
    });
  }

  static async getTodayTotal(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await db
      .select({ total: sql<number>`sum(${screenTime.sessionDuration})` })
      .from(screenTime)
      .where(and(
        eq(screenTime.userId, userId),
        gte(screenTime.timestamp, today)
      ))
      .then(rows => rows[0]?.total || 0);

    return result;
  }

  static async getWeeklyTotal(userId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const result = await db
      .select({ total: sql<number>`sum(${screenTime.sessionDuration})` })
      .from(screenTime)
      .where(and(
        eq(screenTime.userId, userId),
        gte(screenTime.timestamp, weekAgo)
      ))
      .then(rows => rows[0]?.total || 0);

    return result;
  }

  static async getStats(userId: string) {
    return {
      today: await this.getTodayTotal(userId),
      weekly: await this.getWeeklyTotal(userId),
    };
  }
}