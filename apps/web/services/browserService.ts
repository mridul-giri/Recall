import { BrowserRepository } from "../repositories/browserRepository";
import { ApiError } from "../utils/customError";
import { WebReplies } from "../utils/constants";
import { generateRandomToken } from "../utils/generateRandomToken";
import crypto from "node:crypto";
import { TelegramRepository } from "../repositories/telegramRepository";
import { ContentType } from "@repo/db";
import { cloudFrontSignedUrl } from "../utils/cloudFrontSignedUrl";
import { config } from "../utils/config";
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

  static async listTags(userId: string) {
    return await BrowserRepository.listTag(userId);
  }

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

  static async deleteTag(userId: string, tagId: string) {
    const result = await BrowserRepository.deleteTag(userId, tagId);
    if (result.count == 0) throw new ApiError(WebReplies.NO_TAG_FOUND, 404);
    return true;
  }

  static async updateContent(
    userId: string,
    contentId: string,
    payload: { isFavorite?: boolean; title?: string },
  ) {
    const content = await BrowserRepository.findContent(userId, contentId);
    if (!content) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    const data: any = {};
    if (typeof payload.isFavorite === "boolean")
      data.isFavorite = payload.isFavorite;
    if (payload.title !== undefined) data.title = payload.title;

    if (Object.keys(data).length === 0)
      throw new ApiError(WebReplies.NO_UPDATE_FIELD, 400);

    const result = await BrowserRepository.updateContent(
      userId,
      contentId,
      data,
    );
    if (!result) throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);

    return true;
  }

  static async deleteContent(
    userId: string,
    contentId: string,
    extension: string,
  ) {
    const content = await BrowserRepository.findContent(userId, contentId);
    if (!content) throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);

    if (content.contentType == ContentType.link) {
      const result = await BrowserRepository.deleteContent(userId, contentId);
      if (result.count == 0)
        throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);
      return true;
    } else {
      try {
        await deleteFileFromS3(
          userId,
          content.contentType,
          contentId,
          extension,
        );
      } catch (error) {
        throw new ApiError(WebReplies.UNEXPECTED_ERROR, 500);
      }

      const result = await BrowserRepository.deleteContent(userId, contentId);
      if (result.count == 0)
        throw new ApiError(WebReplies.NO_CONTENT_FOUND, 404);
    }
    return true;
  }

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
    const lastItem = results[results.length - 1];

    let nextCursor = null;
    if (hasMore && lastItem) {
      nextCursor = Buffer.from(
        JSON.stringify({ createdAt: lastItem.createdAt, id: lastItem.id }),
      ).toString("base64");
    }

    return { data: tagList, nextCursor, hasMore };
  }

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

  static async findLinkToken(token: string) {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const linkTokenRecord =
      await TelegramRepository.findLinkTokenByHash(hashToken);
    if (!linkTokenRecord) throw new ApiError(WebReplies.TOKEN_NOT_FOUND, 400);

    return { userId: linkTokenRecord.userId, tokenId: linkTokenRecord.id };
  }

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
            isFavorite: item.isFavorite,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            title: item.title,
            url: item.link?.url,
          };
        }

        const media = item.image || item.video || item.document;

        const cloudFrontUrl = await cloudFrontSignedUrl(
          userId,
          contentType,
          item.id,
          media?.extension,
        );

        return {
          contentId: item.id,
          contentType: item.contentType,
          isFavorite: item.isFavorite,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          cloudFrontUrl,
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
}
