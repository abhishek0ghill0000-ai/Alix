import { db } from '../config/dbConfig';
import { friendRequests } from '../schema';
import { eq } from 'drizzle-orm';

export class FriendRequestModel {
  static async create(requestData: {
    fromUniqueId: string;
    toUniqueId: string;
    status?: 'pending' | 'accepted' | 'rejected';
  }) {
    const [request] = await db.insert(friendRequests)
      .values(requestData)
      .returning();
    return request;
  }

  static async findPendingForUser(toUniqueId: string) {
    return await db.query.friendRequests.findMany({
      where: eq(friendRequests.toUniqueId, toUniqueId),
      where: eq(friendRequests.status, 'pending'),
    });
  }

  static async acceptRequest(requestId: string) {
    const [accepted] = await db.update(friendRequests)
      .set({ status: 'accepted' })
      .where(eq(friendRequests.id, requestId))
      .returning();
    return accepted;
  }

  static async rejectRequest(requestId: string) {
    const [rejected] = await db.update(friendRequests)
      .set({ status: 'rejected' })
      .where(eq(friendRequests.id, requestId))
      .returning();
    return rejected;
  }
}