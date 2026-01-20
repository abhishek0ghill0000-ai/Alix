import { db } from '../config/dbConfig';
import { callSessions } from '../schema';
import { eq, desc } from 'drizzle-orm';
import { Call } from '../../types/models';

export class CallSessionModel {
  static async createOrUpdate(callData: Partial<Call>) {
    const existing = await db.query.callSessions.findFirst({
      where: and(
        eq(callSessions.localUid, callData.localUid!),
        eq(callSessions.remoteUid, callData.remoteUid!)
      ),
    });

    if (existing) {
      // Update duration/status
      const [updated] = await db.update(callSessions)
        .set(callData)
        .where(eq(callSessions.id, existing.id))
        .returning();
      return updated;
    }

    // New session
    const [newSession] = await db.insert(callSessions)
      .values(callData)
      .returning();
    return newSession;
  }

  static async getTodayStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await db.query.callSessions.aggregate({
      where: and(
        eq(callSessions.userId, userId),
        gte(callSessions.timestamp, today)
      ),
      sum: { duration: true },
      count: true,
    });
  }

  static async getWeeklyStats(userId: string) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return await db.query.callSessions.aggregate({
      where: and(
        eq(callSessions.userId, userId),
        gte(callSessions.timestamp, weekAgo)
      ),
      sum: { duration: true },
      count: true,
    });
  }
}