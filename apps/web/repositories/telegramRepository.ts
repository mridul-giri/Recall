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
   * @param userName username of the user
   * @returns The user object if created successfully, otherwise null.
   */
  static async createUserWithIdentity(
    providerId: string,
    provider: IdentityType,
    userName: string | undefined,
  ) {
    return await prisma.user.create({
      data: {
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
    width: any,
    height: any,
  ) {
    return await prisma.content.create({
      data: {
        userId,
        contentType,
        image: {
          create: {
            size: fileSize,
            extension,
            width,
            height,
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
   * @param extension Extension of the video file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createContentWithVideoData(
    userId: string,
    contentType: ContentType,
    fileSize: number,
    mimeType: string,
    extension: string,
  ) {
    return await prisma.content.create({
      data: {
        userId,
        contentType,
        video: {
          create: {
            size: fileSize,
            mimeType,
            extension,
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
   * @param extension Extension of the document file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createContentWithDocumentData(
    userId: string,
    contentType: ContentType,
    fileSize: number,
    mimeType: string,
    fileName: string,
    extension: string,
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
            extension,
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

  /**
   * Find a link token by its hash token value.
   * @param token Hash token value of the link token
   * @returns The link token object if found, otherwise null
   */
  static async findLinkTokenByHash(token: string) {
    return await prisma.linkToken.findUnique({
      where: {
        token,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /**
   * Attach Telegram identity to an existing user by creating a new identity record and updating the user's username.
   * @param userId User ID of the existing user
   * @param provider Provider type of the identity, in this case it will be telegram
   * @param providerId Telegram ID of the user
   * @param userName Username of the user to be updated
   * @returns The updated user object if successful, otherwise null.
   */
  static async attachTelegramIdentityToUser(
    userId: string,
    provider: IdentityType,
    providerId: string,
    userName: string,
  ) {
    return await prisma.$transaction([
      prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          userName,
        },
      }),
      prisma.identity.create({
        data: {
          userId,
          provider,
          providerId,
        },
      }),
    ]);
  }

  /**
   * Update a link token's status to used by its ID.
   * @param tokenId Token ID of the link token
   * @returns The updated link token object if successful, otherwise null.
   */
  static async updateLinkToken(tokenId: string) {
    return await prisma.linkToken.update({
      where: {
        id: tokenId,
      },
      data: {
        isUsed: true,
      },
    });
  }
}
