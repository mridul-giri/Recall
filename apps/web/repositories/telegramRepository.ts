import { ContentStatus, ContentType, IdentityType, prisma } from "@repo/db";

/**
 * Repository class for handling database operations related to Telegram users and identities.
 */
export class TelegramRepository {
  /**
   * Find a user identity by provider type and provider ID.
   * @param identityType identity type of the provider, in this case it will be telegram
   * @param providerId Telegram Id of the user
   * @returns The identity object if found, otherwise null.
   */
  static async findByProviderAndProviderId(
    identityType: IdentityType,
    providerId: string,
  ) {
    return await prisma.identity.findFirst({
      where: {
        provider: identityType,
        providerId,
      },
    });
  }

  /**
   * create a user with associated identity record for the given provider.
   * @param providerId Telegram Id of the user
   * @param provider identity type of the provider, in this case it will be telegram
   * @param name name of the user
   * @param userName username of the user
   * @returns The user object if created successfully, otherwise null.
   */
  static async createUserWithIdentity(
    providerId: string,
    provider: IdentityType,
    name: string,
    userName: string | undefined,
  ) {
    return await prisma.user.create({
      data: {
        name,
        userName,
        identities: {
          create: {
            provider,
            providerId,
          },
        },
      },
    });
  }

  /**
   * create content with link data for a user identified by the given userId.
   * @param userId Telegram Id of the user
   * @param contentType type of the content, in this case it will be link
   * @param parsedLinks array of parsed links with url and provider data
   * @returns The created content objects if created successfully, otherwise null.
   */
  static async createContentWithLinkData(
    userId: string,
    contentType: ContentType,
    parsedLinks: Array<{ url: string; provider: string }>,
  ) {
    return await prisma.$transaction(
      parsedLinks.map((item) =>
        prisma.content.create({
          data: {
            userId,
            contentType,
            status: ContentStatus.resolved,
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
  }

  /**
   * create content with image data for a user identified by the given userId.
   * @param userId Telegram Id of the user
   * @param contentType Type of the content, in this case it will be image
   * @param fileSize File size of the image
   * @param extension Extension of the image file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createContentWithImageData(
    userId: string,
    contentType: ContentType,
    fileSize: number,
    extension: string,
  ) {
    return await prisma.content.create({
      data: {
        userId,
        contentType,
        image: {
          create: {
            size: fileSize,
            extension,
          },
        },
      },
    });
  }

  /**
   * create content with video data for a user identified by the given userId.
   * @param userId Telegram Id of the user
   * @param contentType Type of the content, in this case it will be video
   * @param fileSize File size of the video
   * @param mimeType MIME type of the video
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createContentWithVideoData(
    userId: string,
    contentType: ContentType,
    fileSize: number,
    mimeType: string,
  ) {
    return await prisma.content.create({
      data: {
        userId,
        contentType,
        video: {
          create: {
            size: fileSize,
            mimeType,
          },
        },
      },
    });
  }

  /**
   * create content with document data for a user identified by the given userId.
   * @param userId Telegram ID of the user
   * @param contentType Type of the content, in this case it will be document
   * @param fileSize File size of the document
   * @param mimeType MIME type of the document
   * @param fileName Original file name of the document
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createContentWithDocumentData(
    userId: string,
    contentType: ContentType,
    fileSize: number,
    mimeType: string,
    fileName: string,
  ) {
    return await prisma.content.create({
      data: {
        userId,
        contentType,
        document: {
          create: {
            size: fileSize,
            mimeType,
            fileName,
          },
        },
      },
    });
  }

  /**
   * Delete content and its associated data by content ID.
   * @param contentId Content ID of the content to be deleted
   * @returns The deleted content object if deleted successfully, otherwise null.
   */
  static async deleteContentWithAssociatedData(contentId: string) {
    return await prisma.content.delete({
      where: {
        id: contentId,
      },
    });
  }

  /**
   * Update content status to resolved by content ID.
   * @param contentId Content ID of the content to be updated
   * @returns The updated content object if updated successfully, otherwise null.
   */
  static async updateContentStatus(contentId: string) {
    return await prisma.content.update({
      where: {
        id: contentId,
      },
      data: {
        status: ContentStatus.resolved,
      },
    });
  }
}
