import prisma from "@repo/db";
import { ContentType } from "../../../../packages/db/src/generated/prisma/enums.js";

export class BotRepository {
  /**
   * Create or update a user in the database.
   * @param tgId Telegram Id of the user.
   * @param name Name of the user.
   * @param userName Username of the user.
   * @returns True if user is created/updated successfully, otherwise false.
   */
  static async createOrUpdateUser(
    tgId: string,
    name: string,
    userName: string | undefined,
  ): Promise<boolean> {
    const user = await prisma.user.upsert({
      where: {
        telegramId: tgId,
      },
      create: {
        telegramId: tgId,
        name,
        userName,
      },
      update: {
        name,
        userName,
      },
    });
    return user ? true : false;
  }

  /**
   * Find a user by their telegram Id.
   * @param tgId - Telegram Id of the user
   * @returns - The user object if found, otherwise null.
   */
  static async findUserByTelegramId(tgId: string) {
    const user = await prisma.user.findUnique({
      where: {
        telegramId: tgId,
      },
    });
    return user;
  }

  /**
   * Create content records with associated link data for a user.
   * @param userId - ID of the user.
   * @param records - Array of link URLs to be saved.
   * @returns - True if records are created successfully, otherwise false.
   */
  static async createContentWithLinkData(
    userId: string,
    records: Array<{ url: string; provider: string }>,
  ): Promise<boolean> {
    const data = await prisma.$transaction(
      records.map((item) =>
        prisma.content.create({
          data: {
            userId,
            contentType: ContentType.Link,
            link: {
              create: {
                url: item.url,
                provider: item.provider,
              },
            },
          },
        }),
      ),
    );
    return data ? true : false;
  }
}
