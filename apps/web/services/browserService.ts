import { BrowserRepository } from "../repositories/browserRepository";
import { ApiError } from "../utils/customError";
import { WebReplies } from "../utils/constants";
import { generateRandomToken } from "../utils/generateRandomToken";
import crypto from "node:crypto";
import { TelegramRepository } from "../repositories/telegramRepository";
import { ContentType } from "@repo/db";
import { cloudFrontSignedUrl } from "../utils/cloudFrontSignedUrl";
import { deleteFileFromS3 } from "../utils/deleteFileFromS3";
import { deleteFolderFromS3 } from "../utils/deleteFolderFromS3";

/**
 * Service class for handling business logic related to browser interactions.
 */
export class BrowserService {
  /**
   * Generate a token for the user to link their Telegram account with the web app.
   * @param userId User ID of the user
   * @returns The generated token if successful, otherwise null.
   */
  static async createTelegramLinkToken(userId: string) {
    const usedToken = await BrowserRepository.findUsedToken(userId);

    if (usedToken)
      throw new ApiError(WebReplies.ACCOUNT_ALREADY_CONNECTED, 400);

    const token = generateRandomToken();

    const storedToken = await BrowserRepository.storeHashToken(
      userId,
      token.hashToken,
      token.expiresAt,
    );
    if (!storedToken) throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    return token.rawToken;
  }

  /**
   * Create a new tag for the user with the provided tag name.
   * @param userId User ID of the user
   * @param tagName Name of the tag to be created
   * @returns The created tag object if successful, otherwise an error is thrown.
   */
  static async createTag(userId: string, tagName: string) {
    const normalizedTagName = tagName.trim().toLowerCase();

    const findUniqueTagName = await BrowserRepository.findUniqueTagName(
      userId,
      normalizedTagName,
    );

    if (findUniqueTagName.length > 0)
      throw new ApiError(WebReplies.TAG_NAME_EXIST, 400);

    const tag = await BrowserRepository.createTag(userId, normalizedTagName);

    if (!tag) throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    return tag;
  }

  /**
   * List all tags for the user based on the provided user ID.
   * @param userId User ID of the user
   * @returns Returns an array of tag objects associated with the user.
   */
  static async listTags(userId: string) {
    return await BrowserRepository.listTag(userId);
  }

  /**
   * Update the name of an existing tag for the user based on the provided tag ID and new tag name.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag to be updated
   * @param tagName The new name for the tag
   * @returns The updated tag object if successful, otherwise an error is thrown.
   */
  static async updateTag(userId: string, tagId: string, tagName: string) {
    const normalizedTagName = tagName.trim().toLowerCase();

    const tag = await BrowserRepository.findTag(userId, tagId);
    if (!tag) throw new ApiError(WebReplies.NO_TAG_FOUND, 404);

    const findUniqueTagName = await BrowserRepository.findUniqueTagName(
      userId,
      normalizedTagName,
    );

    if (findUniqueTagName.length > 0)
      throw new ApiError(WebReplies.TAG_NAME_EXIST, 400);

    const result = await BrowserRepository.updateTag(
      userId,
      tagId,
      normalizedTagName,
    );

    if (!result) throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    return result;
  }

  /**
   * Delete an existing tag for the user based on the provided tag ID.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag to be deleted
   * @returns Returns true if the tag was successfully deleted, otherwise an error is thrown.
   */
  static async deleteTag(userId: string, tagId: string) {
    const result = await BrowserRepository.deleteTag(userId, tagId);
    if (result.count == 0) throw new ApiError(WebReplies.NO_TAG_FOUND, 404);
    return true;
  }

  /**
   * Update Content title for a user's content item based on the provided content ID and new title.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be updated
   * @param title New title for the content item
   * @returns Returns true if the content title was successfully updated, otherwise an error is thrown.
   */
  static async updateContent(userId: string, contentId: string, title: string) {
    const content = await BrowserRepository.findContent(userId, contentId);
    if (!content) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    const result = await BrowserRepository.updateContent(
      userId,
      contentId,
      title,
    );
    if (!result) throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    return true;
  }

  /**
   * Delete a content item for a user based on the provided content ID and extension. This includes deleting the content record from the database as well as the associated file from S3 storage if applicable.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item to be deleted
   * @param extension File extension of the content item to be deleted (required for non-link content types)
   * @returns Returns true if the content item was successfully deleted, otherwise an error is thrown.
   */
  static async deleteContent(
    userId: string,
    contentId: string,
    extension: string | null,
  ) {
    const content = await BrowserRepository.findContent(userId, contentId);
    if (!content) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    if (content.contentType == ContentType.link) {
      const result = await BrowserRepository.deleteContent(userId, contentId);
      if (result.count == 0)
        throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);
      return true;
    }

    if (!extension || typeof extension !== "string") {
      throw new ApiError(WebReplies.EXTENSION_REQUIRED, 400);
    }

    try {
      await deleteFileFromS3(userId, content.contentType, contentId, extension);
    } catch (error) {
      throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);
    }

    const result = await BrowserRepository.deleteContent(userId, contentId);
    if (result.count == 0) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);
    return true;
  }

  /**
   * Attach content items to a tag for a user based on the provided user ID, content IDs, and tag ID.
   * @param userId User ID of the user
   * @param contentIds Array of content IDs to be attached to the tag
   * @param tagId Tag ID of the tag to which the content items will be attached
   * @returns Returns true if the content items were successfully attached to the tag, otherwise an error is thrown.
   */
  static async attachContents(
    userId: string,
    contentIds: string[],
    tagId: string,
  ) {
    if (!contentIds || !Array.isArray(contentIds) || contentIds.length == 0)
      throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    const result = await BrowserRepository.attachContentToTag(
      userId,
      contentIds,
      tagId,
    );

    if (result.count == 0) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    return true;
  }

  /**
   * List content items associated with a specific tag for a user based on the provided user ID, tag ID, pagination cursor, limit, and content type.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag for which associated content items are to be listed
   * @param decodedCursor Pagination cursor for fetching the next set of results (optional)
   * @param limit Maximum number of content items to be returned in the response
   * @param contentType Filter for content type to be returned in the response (optional)
   * @returns Returns an object containing an array of content items associated with the specified tag, a pagination cursor for fetching the next set of results, and a boolean indicating whether there are more results available.
   */
  static async listContentByTag(
    userId: string,
    tagId: string,
    decodedCursor: any,
    limit: number,
    contentType: ContentType,
  ) {
    const tagList = await BrowserRepository.listContentByTag(
      userId,
      limit,
      decodedCursor,
      tagId,
      contentType,
    );

    const hasMore = tagList.length > limit;
    const results = hasMore ? tagList.slice(0, -1) : tagList;

    const data = await Promise.all(
      results.map(async (item: any) => {
        if (item.contentType == ContentType.link) {
          return {
            contentId: item.id,
            contentType: item.contentType,
            createdAt: new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            updatedAt: new Date(item.updatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            title: item.title,
            url: item.link?.url,
          };
        }

        const media = item.image || item.video || item.document;

        const cloudfrontUrl = await cloudFrontSignedUrl(
          userId,
          item.contentType,
          item.id,
          media?.extension,
        );

        return {
          contentId: item.id,
          contentType: item.contentType,
          createdAt: new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          updatedAt: new Date(item.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          cloudfrontUrl,
          extension: media?.extension,
          title: item.title,
        };
      }),
    );

    const lastItem = results[results.length - 1];
    let nextCursor = null;
    if (hasMore && lastItem) {
      nextCursor = Buffer.from(
        JSON.stringify({ createdAt: lastItem.createdAt, id: lastItem.id }),
      ).toString("base64");
    }

    return { data, nextCursor, hasMore };
  }

  /**
   * Detach a content item from a tag for a user based on the provided user ID, tag ID, and content ID.
   * @param userId User ID of the user
   * @param tagId Tag ID of the tag from which the content item will be detached
   * @param contentId Content ID of the content item to be detached from the tag
   * @returns Returns true if the content item was successfully detached from the tag, otherwise an error is thrown.
   */
  static async dettachContent(
    userId: string,
    tagId: string,
    contentId: string,
  ) {
    const tag = await BrowserRepository.findTag(userId, tagId);
    if (!tag) throw new ApiError(WebReplies.NO_TAG_FOUND, 404);

    const content = await BrowserRepository.findContent(userId, contentId);
    if (!content) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    const result = await BrowserRepository.dettachContentFromTag(
      tagId,
      contentId,
    );
    if (result.count == 0) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    return true;
  }

  /**
   * Delete a user and all associated data for a user based on the provided user ID. This includes deleting all content, tags, identities, and link tokens associated with the user, as well as the user record itself.
   * @param userId User ID of the user to be deleted
   * @returns Returns true if the user and all associated data were successfully deleted, otherwise an error is thrown.
   */
  static async deleteUser(userId: string) {
    await BrowserRepository.requestUserDeletion(userId);

    try {
      await deleteFolderFromS3(userId);
      await BrowserRepository.deleteUser(userId);
    } catch (error) {
      throw new ApiError(WebReplies.USER_DELETE_FAILED, 500);
    }

    return true;
  }

  /**
   * Find a link token for a user based on the provided raw token value. This is used for linking a Telegram account with the web app.
   * @param token Raw token value to be searched for
   * @returns Returns an object containing the user ID and token ID if a valid link token is found, otherwise an error is thrown.
   */
  static async findLinkToken(token: string) {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const linkTokenRecord =
      await TelegramRepository.findLinkTokenByHash(hashToken);
    if (!linkTokenRecord) throw new ApiError(WebReplies.TOKEN_NOT_FOUND, 400);

    return { userId: linkTokenRecord.userId, tokenId: linkTokenRecord.id };
  }

  /**
   * Get content items for a user based on the provided user ID, pagination cursor, limit, and content type. This retrieves content items for the user with optional pagination and filtering by content type.
   * @param userId User ID of the user for whom content items are to be retrieved
   * @param decodedCursor Pagination cursor for fetching the next set of results (optional)
   * @param limit Maximum number of content items to be returned in the response
   * @param contentType Filter for content type to be returned in the response (optional)
   * @returns Returns an object containing an array of content items for the user, a pagination cursor for fetching the next set of results, and a boolean indicating whether there are more results available.
   */
  static async getContent(
    userId: string,
    decodedCursor: any,
    limit: number,
    contentType: ContentType,
  ) {
    const content = await BrowserRepository.getContentByContentType(
      userId,
      decodedCursor,
      limit,
      contentType,
    );

    const hasMore = content.length > limit;
    const results = hasMore ? content.slice(0, -1) : content;

    const data = await Promise.all(
      results.map(async (item) => {
        if (item.contentType == ContentType.link) {
          return {
            contentId: item.id,
            contentType: item.contentType,
            createdAt: new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            updatedAt: new Date(item.updatedAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            title: item.title,
            url: item.link?.url,
          };
        }

        const media = item.image || item.video || item.document;

        const cloudfrontUrl = await cloudFrontSignedUrl(
          userId,
          contentType,
          item.id,
          media?.extension,
        );

        return {
          contentId: item.id,
          contentType: item.contentType,
          createdAt: new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          updatedAt: new Date(item.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          cloudfrontUrl,
          extension: media?.extension,
          title: item.title,
        };
      }),
    );

    const lastItem = results[results.length - 1];

    let nextCursor = null;
    if (hasMore && lastItem) {
      nextCursor = Buffer.from(
        JSON.stringify({
          createdAt: lastItem.createdAt,
          id: lastItem.id,
        }),
      ).toString("base64");
    }

    return { data, nextCursor, hasMore };
  }

  /**
   * Get tags associated with a content item for a user based on the provided content ID.
   * @param userId User ID of the user
   * @param contentId Content ID of the content item for which associated tags are to be retrieved
   * @returns Returns an array of tag objects with id and name fields that are associated with the specified content item for the user.
   */
  static async getContentTags(userId: string, contentId: string) {
    const result = await BrowserRepository.getTagsByConentId(userId, contentId);
    return result.map((item) => item.tag);
  }
}
