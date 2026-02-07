import { prisma } from "@repo/db";
import { ContentType } from "@repo/db";

export class BotService {
  /**
   * Create or update a user in the database.
   * @param telegramId Telegram Id of the user.
   * @param name Name of the user.
   * @param userName Username of the user.
   * @returns The user object if created/updated successfully, otherwise null.
   */
  static async createOrUpdateUser(
    telegramId: string,
    name: string,
    userName: string | undefined,
  ) {
    return await prisma.user.upsert({
      where: {
        telegramId,
      },
      create: {
        telegramId,
        name,
        userName,
      },
      update: {
        name,
        userName,
      },
    });
  }

  /**
   * Find a user by their telegram Id.
   * @param telegramId Telegram Id of the user
   * @returns The user object if found, otherwise null.
   */
  static async findUserByTelegramId(telegramId: string) {
    return await prisma.user.findUnique({
      where: {
        telegramId,
      },
    });
  }

  /**
   * Create content records with associated link data for a user.
   * @param userId ID of the user.
   * @param records Array of link URLs to be saved.
   * @returns True if records are created successfully, otherwise false.
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
            contentType: ContentType.link,
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

  /**
   * Create content record with associated image data for a user.
   * @param userId ID of the user.
   * @param size Size of the image file.
   * @param extension Extension of the image file.
   * @returns Content ID of the created record.
   */
  static async createContentWithImageData(
    userId: string,
    size: number,
    extension: string,
  ): Promise<string> {
    const data = await prisma.content.create({
      data: {
        userId,
        contentType: ContentType.image,
        image: {
          create: {
            size,
            extension,
          },
        },
      },
    });
    return data.id;
  }

  /**
   * Create content record with associated video data for a user.
   * @param userId ID of the user.
   * @param size Size of the video file.
   * @param mimeType MimeType of the video file.
   * @returns Content ID of the created record.
   */
  static async createContentWithVideoData(
    userId: string,
    size: number,
    mimeType: string,
  ): Promise<string> {
    const data = await prisma.content.create({
      data: {
        userId,
        contentType: ContentType.video,
        video: {
          create: {
            size,
            mimeType,
          },
        },
      },
    });
    return data.id;
  }

  /**
   * Create content record with associated document data for a user.
   * @param userId ID of the user.
   * @param size Size of the document file.
   * @param mimeType MimeType of the document file.
   * @param fileName FileName of the document file
   * @returns Content ID of the created record.
   */
  static async createContentWithDocumentData(
    userId: string,
    size: number,
    mimeType: string,
    fileName: string,
  ): Promise<string> {
    const data = await prisma.content.create({
      data: {
        userId,
        contentType: ContentType.video,
        document: {
          create: {
            size,
            mimeType,
            fileName,
          },
        },
      },
    });
    return data.id;
  }

  /**
   * Delete a content record along with its associated data.
   * @param contentId ID of the content to be deleted.
   * @returns True if content is deleted successfully, otherwise false.
   */
  static async deleteContentWithAssociatedData(
    contentId: string,
  ): Promise<void> {
    try {
      await prisma.content.delete({
        where: {
          id: contentId,
        },
      });
    } catch (rollbackError) {
      console.error("[RollbackFailed]", rollbackError);
    }
  }
}
