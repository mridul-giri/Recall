import { BrowserRepository } from "../repositories/browserRepository";
import { ApiError } from "../utils/customError";
import { WebReplies } from "../utils/constants";
import { generateRandomToken } from "../utils/generateRandomToken";

/**
 * Service class for handling business logic related to browser interactions.
 */
export class BrowserService {
  /**
   * Generate a token for the user to link their Telegram account with the web app.
   * @param userId User ID of the user
   * @returns The generated token if successful, otherwise null.
   */
  static async generateToken(userId: string) {
    const user = await BrowserRepository.findUserByUserId(userId);
    if (!user) throw new ApiError(WebReplies.USER_ACCOUNT_NOT_FOUND, 404);

    const token = generateRandomToken();

    const tokenStored = await BrowserRepository.storeHashToken(
      userId,
      token.hashToken,
      token.expiresAt,
    );
    if (!tokenStored) throw new ApiError(WebReplies.TOKEN_STORED_FAIL, 500);

    return token.rawToken;
  }
}
