import prisma from "@repo/db";
import { ContentType } from "../../../../packages/db/src/generated/prisma/enums.js";
import { promise } from "zod/v4";

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
}
