import { ContentStatus, ContentType, prisma } from "@repo/db";
import { includes } from "zod/v4";

/**
 * Repository class for handling database operations related to browser users.
 */
export class BrowserRepository {
  /**
   * Store a hashed token in the database for a user with an expiration time.
   * @param userId User ID of the user
   * @param hashToken Hashed token value to be stored
   * @param expiresAt Expiration time of the token
   * @returns Returns the created link token id if stored successfully, otherwise null.
   */
  static async storeHashToken(
    userId: string,
    hashToken: string,
    expiresAt: Date,
  ) {
    return await prisma.linkToken.create({
      data: { userId, token: hashToken, expiresAt },
      select: { id: true },
    });
  }

  /**
   * Find a used token for a user.
   * @param userId User ID of the user
   * @returns Returns the used token id if found, otherwise null.
   */
  static async findUsedToken(userId: string) {
    return await prisma.linkToken.findFirst({
      where: { userId, isUsed: true },
      select: { id: true },
    });
  }

  static async getContentByContentType(
    userId: string,
    decodedCursor: any,
    limit: number,
    contentType: ContentType,
  ) {
    return await prisma.content.findMany({
      where: {
        userId,
        contentType,
        status: ContentStatus.resolved,
        isDeleted: false,
        ...(decodedCursor && {
          OR: [
            { createdAt: { lt: new Date(decodedCursor.createdAt) } },
            {
              createdAt: new Date(decodedCursor.createdAt),
              id: { lt: decodedCursor.id },
            },
          ],
        }),
      },
      include: { link: true, image: true, video: true, document: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });
  }

  static async createTag(userId: string, name: string) {
    return await prisma.tag.create({
      data: { userId, name },
      select: { id: true, name: true },
    });
  }

  static async deleteTag(userId: string, tagId: string) {
    const tag = await prisma.tag.deleteMany({
      where: { userId, id: tagId },
    });

    return { count: tag.count };
  }

  static async listTag(userId: string) {
    return await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }

  static async findTag(userId: string, tagId: string) {
    return await prisma.tag.findFirst({
      where: { id: tagId, userId },
      select: { id: true },
    });
  }

  static async findUniqueTagName(userId: string, newTagName: string) {
    return await prisma.tag.findMany({
      where: { userId, name: newTagName },
      select: { id: true },
    });
  }

  static async updateTag(userId: string, tagId: string, newTagName: string) {
    return await prisma.tag.update({
      where: { userId, id: tagId },
      data: { name: newTagName },
      select: { id: true, name: true },
    });
  }

  static async attachContentToTag(
    userId: string,
    contentIds: string[],
    tagId: string,
  ) {
    const tag = await prisma.tag.findFirst({
      where: { userId, id: tagId },
      select: { id: true },
    });
    if (!tag) return { count: 0 };

    const validateContent = await prisma.content.findMany({
      where: { userId, id: { in: contentIds }, isDeleted: false },
      select: { id: true },
    });
    if (validateContent.length == 0) return { count: 0 };

    const content = validateContent.map((item) => ({
      contentId: item.id,
      tagId,
    }));

    const result = await prisma.contentTag.createMany({
      data: content,
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  static async dettachContentFromTag(
    tagId: string,
    contentId: string,
  ) {
    const deletedContent = await prisma.contentTag.deleteMany({
      where: {
        contentId,
        tagId,
      },
    });

    return { count: deletedContent.count };
  }

  static async listContentByTag(
    userId: string,
    limit: number,
    decodedCursor: any,
    tagId: string,
    contentType: ContentType,
  ) {
    return await prisma.content.findMany({
      where: {
        userId,
        isDeleted: false,
        status: ContentStatus.resolved,
        tags: {
          some: {
            tagId,
          },
        },
        ...(contentType && {
          contentType,
        }),
        ...(decodedCursor && {
          OR: [
            { createdAt: { lt: new Date(decodedCursor.createdAt) } },
            {
              createdAt: new Date(decodedCursor.createdAt),
              id: { lt: decodedCursor.id },
            },
          ],
        }),
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });
  }

  static async addContentToFavorite(
    userId: string,
    contentId: string,
    isFavorite: boolean,
  ) {
    return await prisma.content.update({
      where: { userId, id: contentId },
      data: { isFavorite },
      select: { isFavorite: true },
    });
  }

  static async updateContent(userId: string, contentId: string, data: any) {
    return await prisma.content.update({
      where: { userId, id: contentId },
      data,
    });
  }

  static async findContent(userId: string, contentId: string) {
    return await prisma.content.findFirst({
      where: {
        userId,
        id: contentId,
      },
      select: { id: true, contentType: true },
    });
  }

  static async deleteContent(userId: string, contentId: string) {
    const content = await prisma.content.deleteMany({
      where: {
        userId,
        id: contentId,
      },
    });

    return { count: content.count };
  }

  static async requestUserDeletion(userId: string) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      }),
    ]);
  }

  static async deleteUser(userId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.content.deleteMany({ where: { userId } });
      await tx.identity.deleteMany({ where: { userId } });
      await tx.linkToken.deleteMany({ where: { userId } });
      await tx.tag.deleteMany({ where: { userId } });

      await tx.user.delete({
        where: { id: userId },
      });
    });
  }
}
