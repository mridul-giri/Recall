import { ContentType, IdentityType } from "@repo/db";
import { TelegramRepository } from "../repositories/telegramRepository";
import { ApiError } from "../utils/customError";
import parseLinkEntity from "../utils/parseLinkEntity";
import { Replies } from "../utils/constants";
import { uploadFileToS3 } from "../utils/uploadFileToS3";

/**
 * Service class for handling business logic related to Telegram users and identities.
 */
export class TelegramService {
  /**
   * find or create a user with associated identity record for the given provider.
   * @param providerId Telegram Id of the user
   * @param name name of the user
   * @param userName username of the user
   * @returns The user object if found or created successfully, otherwise null.
   */
  static async findOrCreateUserWithIdentity(
    providerId: string,
    name: string,
    userName: string,
  ) {
    const existingIdentity =
      await TelegramRepository.findByProviderAndProviderId(
        IdentityType.telegram,
        providerId,
      );
    if (existingIdentity) throw new ApiError(Replies.USER_ALREADY_EXIST, 400);

    const provider = IdentityType.telegram;

    return TelegramRepository.createUserWithIdentity(
      providerId,
      provider,
      name,
      userName,
    );
  }

  /** Create content with link data for a user identified by the given provider ID.
   * @param providerId Telegram Id of the user
   * @param entities
   * @param text
   * @returns The created content objects if created successfully, otherwise null.
   */
  static async createLinkForUser(
    providerId: string,
    entities: any,
    text: string,
  ) {
    const user = await TelegramRepository.findByProviderAndProviderId(
      IdentityType.telegram,
      providerId,
    );
    if (!user) throw new ApiError(Replies.USER_ACCOUNT_NOT_FOUND, 404);

    let parsedLinks: Array<{ url: string; provider: string }> = [];

    for (const e of entities) {
      const offset = e.offset;
      const length = e.length;
      const data = parseLinkEntity(text, offset, length);
      if (data) {
        parsedLinks = [
          ...parsedLinks,
          { url: data.url, provider: data.provider },
        ];
      }
    }

    if (parsedLinks.length === 0) {
      throw new ApiError(Replies.NO_VALID_LINK_FOUND, 400);
    }

    return await TelegramRepository.createContentWithLinkData(
      user.userId,
      ContentType.link,
      parsedLinks,
    );
  }

  /** Create content with image data for a user identified by the given provider IDs.
   * @param providerId Telegram ID of the user
   * @param fileSize File Size of the image
   * @param extension Extension of the image file
   * @param fileBuffer Buffer of the image file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createImageForUser(
    providerId: string,
    fileSize: number,
    extension: string,
    fileBuffer: Buffer,
  ) {
    const user = await TelegramRepository.findByProviderAndProviderId(
      IdentityType.telegram,
      providerId,
    );
    if (!user) throw new ApiError(Replies.USER_ACCOUNT_NOT_FOUND, 404);

    const contentData = await TelegramRepository.createContentWithImageData(
      user.userId,
      ContentType.image,
      fileSize,
      extension,
    );

    if (!contentData) throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);

    try {
      const mediaType = `${ContentType.image}/${extension}`;
      await uploadFileToS3(
        contentData.id,
        ContentType.image,
        extension,
        fileBuffer,
        mediaType,
      );
      return TelegramRepository.updateContentStatus(contentData.id);
    } catch (error) {
      console.error("Image upload failed to s3", error);
      await TelegramRepository.deleteContentWithAssociatedData(contentData.id);
      throw new ApiError(Replies.IMAGE_SAVE_FAILED, 500);
    }
  }

  /** Create content with video data for a user identified by the given provider IDs.
   * @param providerId Telegram ID of the user
   * @param fileSize File Size of the video
   * @param extension Extension of the video file
   * @param mimeType MIME type of the video file
   * @param fileBuffer Buffer of the video file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createVideoForUser(
    providerId: string,
    fileSize: number,
    extension: string,
    mimeType: string,
    fileBuffer: Buffer,
  ) {
    const user = await TelegramRepository.findByProviderAndProviderId(
      IdentityType.telegram,
      providerId,
    );
    if (!user) throw new ApiError(Replies.USER_ACCOUNT_NOT_FOUND, 404);

    const contentData = await TelegramRepository.createContentWithVideoData(
      user.userId,
      ContentType.video,
      fileSize,
      mimeType,
    );

    if (!contentData) throw new ApiError(Replies.VIDEO_SAVE_FAILED, 500);

    try {
      const mediaType = mimeType;
      await uploadFileToS3(
        contentData.id,
        ContentType.video,
        extension,
        fileBuffer,
        mediaType,
      );
      return TelegramRepository.updateContentStatus(contentData.id);
    } catch (error) {
      console.error("Video upload failed to s3", error);
      await TelegramRepository.deleteContentWithAssociatedData(contentData.id);
      throw new ApiError(Replies.VIDEO_SAVE_FAILED, 500);
    }
  }

  /** Create content with document data for a user identified by the given provider IDs.
   * @param providerId Telegram ID of the user
   * @param fileSize File Size of the document
   * @param extension Extension of the document file
   * @param mimeType MIME type of the document file
   * @param fileBuffer Buffer of the document file
   * @param fileName Name of the document file
   * @returns The created content object if created successfully, otherwise null.
   */
  static async createDocumentForUser(
    providerId: string,
    fileSize: number,
    extension: string,
    mimeType: string,
    fileBuffer: Buffer,
    fileName: string,
  ) {
    const user = await TelegramRepository.findByProviderAndProviderId(
      IdentityType.telegram,
      providerId,
    );
    if (!user) throw new ApiError(Replies.USER_ACCOUNT_NOT_FOUND, 404);

    const contentData = await TelegramRepository.createContentWithDocumentData(
      user.userId,
      ContentType.document,
      fileSize,
      mimeType,
      fileName,
    );

    if (!contentData) throw new ApiError(Replies.DOCUMENT_SAVE_FAILED, 500);

    try {
      const mediaType = mimeType;
      await uploadFileToS3(
        contentData.id,
        ContentType.document,
        extension,
        fileBuffer,
        mediaType,
      );
      return TelegramRepository.updateContentStatus(contentData.id);
    } catch (error) {
      console.error("Document upload failed to s3", error);
      await TelegramRepository.deleteContentWithAssociatedData(contentData.id);
      throw new ApiError(Replies.DOCUMENT_SAVE_FAILED, 500);
    }
  }
}
