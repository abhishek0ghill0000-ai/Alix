import { db } from '../config/dbConfig';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { User } from '../../types/models'; // client/types/models.d.ts sync

export class UserModel {
  static async findById(id: string) {
    return await db.query.users.findFirst({ where: eq(users.id, id) });
  }

  static async findByUniqueId(uniqueId: string) {
    return await db.query.users.findFirst({ where: eq(users.uniqueId, uniqueId) });
  }

  static async findByUsername(username: string) {
    return await db.query.users.findFirst({ where: eq(users.username, username) });
  }

  static async create(userData: Partial<User>) {
    const [newUser] = await db.insert(users)
      .values({ ...userData, uniqueId: userData.uniqueId || `${userData.username}${Math.floor(Math.random() * 90000) + 10000}` })
      .returning();
    return newUser;
  }

  static async updateProfile(userId: string, updates: Partial<User>) {
    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  static async getFriends(userId: string) {
    // Friends list from advancedAccess or separate friends table
    const friends = await db.query.advancedAccess.findMany({
      where: eq(advancedAccess.ownerId, userId),
      columns: { accessedBy: true },
    });
    return friends.map(f => f.accessedBy);
  }
}