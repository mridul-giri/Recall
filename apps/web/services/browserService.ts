import { BrowserRepository } from "../repositories/browserRepository";
import { ApiError } from "../utils/customError";
import { WebReplies } from "../utils/constants";
import { generateRandomToken } from "../utils/generateRandomToken";
import crypto from "node:crypto";
import { TelegramRepository } from "../repositories/telegramRepository";

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
    const user = await BrowserRepository.findUserByUserId(userId);
    if (!user) throw new ApiError(WebReplies.USER_ACCOUNT_NOT_FOUND, 404);

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

  static async findLinkToken(token: string) {
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");

    const linkTokenRecord =
      await TelegramRepository.findLinkTokenByHash(hashToken);
    if (!linkTokenRecord) throw new ApiError(WebReplies.TOKEN_NOT_FOUND, 400);

    return { userId: linkTokenRecord.userId, tokenId: linkTokenRecord.id };
  }
}
