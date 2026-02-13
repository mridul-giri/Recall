import { prisma } from "@repo/db";

/**
 * Repository class for handling database operations related to browser users.
 */
export class BrowserRepository {
  /**
   * Find a user by their user ID.
   * @param userId User ID of the user
   * @returns Returns the user object if found, otherwise null.
   */
  static async findUserByUserId(userId: string) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Store a hashed token in the database for a user with an expiration time.
   * @param userId User ID of the user
   * @param hashToken Hashed token value to be stored
   * @param expiresAt Expiration time of the token
   * @returns Returns the created link token object if stored successfully, otherwise null.
   */
  static async storeHashToken(
    userId: string,
    hashToken: string,
    expiresAt: Date,
  ) {
    return await prisma.linkToken.create({
      data: {
        userId,
        token: hashToken,
        expiresAt,
      },
    });
  }
}
