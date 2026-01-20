import { CallSessionModel } from '../models/callSessionModel';
import { ScreenTimeModel } from '../models/screenTimeModel';
import { UserModel } from '../models/userModel';

export class CallStatsService {
  static async getAdvancedAccessStats(userId: string) {
    // Call stats
    const todayCalls = await CallSessionModel.getTodayStats(userId);
    const weeklyCalls = await CallSessionModel.getWeeklyStats(userId);

    // Screen time
    const screenStats = await ScreenTimeModel.getStats(userId);

    return {
      totalCallTimeToday: todayCalls.totalDuration || 0,
      totalCallTimeWeekly: weeklyCalls.totalDuration || 0,
      callCountToday: todayCalls.count || 0,
      callCountWeekly: weeklyCalls.count || 0,
      screenTimeToday: screenStats.today,
      screenTimeWeekly: screenStats.weekly,
    };
  }

  static async recordCallSession(callData: {
    userId: string;
    localUid: number;
    remoteUid: number;
    channel: string;
    duration: number;
    type: 'random' | 'friend';
  }) {
    await CallSessionModel.createOrUpdate(callData);
    
    // Track screen time
    await ScreenTimeModel.recordSession(callData.userId, callData.duration);
  }

  static async getCallHistory(userId: string, limit = 50) {
    return await CallSessionModel.getCallHistory(userId, limit);
  }
}