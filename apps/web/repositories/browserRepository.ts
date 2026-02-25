import { ContentStatus, ContentType, prisma } from "@repo/db";

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

  /**
   * Get content for a user based on the provided parameters, including pagination and content type filtering.
   * @param userId User ID of the user
   * @param decodedCursor Decoded cursor for pagination, containing the createdAt and id of the last item from the previous page
   * @param limit Limit of items to be fetched
   * @param contentType Content type to filter the content (e.g., link, image, video, document)
   * @returns Returns an array of content items matching the criteria.
   */
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

  /**
   * Create a new tag for a user.
   * @param userId User ID of the user
   * @param name Name of the tag to be created
   * @returns Returns the created tag id and name if created successfully, otherwise null.
   */
  static async createTag(userId: string, name: string) {
    return await prisma.tag.create({
      data: { userId, name },
      select: { id: true, name: true },
    });
  }

  /**
   * Delete a tag for a user based on the provided tag ID.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag to be deleted
   * @returns Returns the count of deleted tags (0 or 1) based on whether the tag was found and deleted successfully.
   */
  static async deleteTag(userId: string, tagId: string) {
    const tag = await prisma.tag.deleteMany({
      where: { userId, id: tagId },
    });

    return { count: tag.count };
  }

  /**
   * List all tags for a user, ordered by name in ascending order.
   * @param userId User ID of the user
   * @returns Returns an array of tag objects with id and name fields.
   */
  static async listTag(userId: string) {
    return await prisma.tag.findMany({
      where: { userId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }

  /**
   * Find a tag for a user based on the provided tag ID.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag to be found
   * @returns Returns the tag if found, otherwise null.
   */
  static async findTag(userId: string, tagId: string) {
    return await prisma.tag.findFirst({
      where: { id: tagId, userId },
      select: { id: true },
    });
  }

  /**
   * Find a tag for a user based on the provided tag name to ensure uniqueness of tag names for a user.
   * @param userId User ID of the user
   * @param newTagName Name of the tag to be found
   * @returns Returns the tag if found, otherwise null. This is used to check for duplicate tag names for a user before creating or updating a tag.
   */
  static async findUniqueTagName(userId: string, newTagName: string) {
    return await prisma.tag.findMany({
      where: { userId, name: newTagName },
      select: { id: true },
    });
  }

  /**
   * Update the name of a tag for a user based on the provided tag ID and new tag name.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag to be updated
   * @param newTagName New name for the tag
   * @returns Returns the updated tag id and name if updated successfully, otherwise null.
   */
  static async updateTag(userId: string, tagId: string, newTagName: string) {
    return await prisma.tag.update({
      where: { userId, id: tagId },
      data: { name: newTagName },
      select: { id: true, name: true },
    });
  }

  /**
   * Attach content items to a tag for a user.
   * @param userId User ID of the user
   * @param contentIds Content IDs of the content items to be attached to the tag
   * @param tagId Tag ID of the tag to which content items are to be attached
   * @returns Returns the count of content items attached to the tag if successful, otherwise 0.
   */
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

  /**
   * Detach a content item from a tag for a user based on the provided tag ID and content ID.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag from which the content item is to be detached
   * @param contentId Content ID of the content item to be detached from the tag
   * @returns Returns the count of content items detached from the tag (0 or 1) based on whether the content item was found and detached successfully.
   */
  static async dettachContentFromTag(tagId: string, contentId: string) {
    const deletedContent = await prisma.contentTag.deleteMany({
      where: {
        contentId,
        tagId,
      },
    });

    return { count: deletedContent.count };
  }

  /**
   * List content items for a user based on the provided tag ID, with pagination and optional content type filtering.
   * @param userId User ID of the user
   * @param limit Limit of items to be fetched for pagination
   * @param decodedCursor Decoded cursor for pagination, containing the createdAt and id of the last item from the previous page
   * @param tagId Tag ID of the tag for which content items are to be listed
   * @param contentType Content type to filter the content items (e.g., link, image, video, document). This is optional and if not provided, content items of all types will be listed.
   * @returns Returns an array of content items matching the criteria, including their associated link, image, video, or document data based on the content type.
   */
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
      include: { link: true, image: true, video: true, document: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
    });
  }

  /**
   * Add or remove a content item from the user's favorites based on the provided content ID and favorite status.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be added or removed from favorites
   * @param isFavorite Boolean value indicating whether the content item should be added to or removed from favorites
   * @returns Returns the updated favorite status of the content item.
   */
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

  /**
   * Update a content item's title for a user based on the provided content ID and new title.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be updated
   * @param title New title for the content item
   * @returns Returns the updated content item with its new title.
   */
  static async updateContent(userId: string, contentId: string, title: string) {
    return await prisma.content.update({
      where: { userId, id: contentId },
      data: {
        title,
      },
    });
  }

  /**
   * Find a content item for a user based on the provided content ID.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be found
   * @returns Returns the content item if found, otherwise null.
   */
  static async findContent(userId: string, contentId: string) {
    return await prisma.content.findFirst({
      where: {
        userId,
        id: contentId,
      },
      select: { id: true, contentType: true },
    });
  }

  /**
   * Delete a content item for a user based on the provided content ID.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be deleted
   * @returns Returns the count of deleted content items (0 or 1) based on whether the content item was found and deleted successfully.
   */
  static async deleteContent(userId: string, contentId: string) {
    const content = await prisma.content.deleteMany({
      where: {
        userId,
        id: contentId,
      },
    });

    return { count: content.count };
  }

  /**
   * Request user deletion for a user based on the provided user ID.
   * @param userId User ID of the user requesting deletion
   */
  static async requestUserDeletion(userId: string) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      }),
    ]);
  }

  /**
   * Delete a user and all associated data for a user based on the provided user ID. This includes deleting all content, tags, identities, and link tokens associated with the user, as well as the user record itself.
   * @param userId User ID of the user to be deleted
   */
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

  /**
   * Get tags associated with a content item for a user based on the provided content ID. This retrieves all tags that are attached to the specified content item for the user.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item for which associated tags are to be retrieved
   * @returns Returns an array of tag objects with id and name fields that are associated with the specified content item for the user.
   */
  static async getTagsByConentId(userId: string, contentId: string) {
    return await prisma.contentTag.findMany({
      where: { contentId, content: { userId } },
      select: { tag: { select: { id: true, name: true } } },
    });
  }
}
