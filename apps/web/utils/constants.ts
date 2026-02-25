export const Replies = {
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
  USER_ACCOUNT_NOT_FOUND:
    "Your account doesn’t exist yet. Send /start to create one.",
  USER_CREATE_FAILED: "Failed to create your account. Please try again.",
  USER_ALREADY_EXIST: "Account already exist",
  USER_CREATE_SUCCESS: "User account created successfully",
  LINK_SAVE_FAILED: "Failed to save your links. Please try again.",
  NO_VALID_LINK_FOUND: "No valid links found to save",
  LINK_SAVE_SUCCESS: "links saved successfully",
  IMAGE_SAVE_FAILED: "Failed to save your image. Please try again.",
  IMAGE_SAVE_SUCCESS: "Image saved successfully",
  VIDEO_SAVE_FAILED: "Failed to save your video. Please try again.",
  VIDEO_SAVE_SUCCESS: "Video saved successfully",
  DOCUMENT_SAVE_FAILED: "Failed to save your document. Please try again.",
  DOCUMENT_SAVE_SUCCESS: "document saved successfully",
  TOKEN_NOT_FOUND:
    "Invalid or Expired token. Please generate a new one from the web app",
  TELEGRAM_ALREADY_LINKED:
    "Telegram account already linked to another user. Please use a different Telegram account",
  ACCOUNT_ALREADY_CONNECTED: "This account is already connected to web app",
};

export const WebReplies = {
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
  USER_ACCOUNT_NOT_FOUND: "User not found",
  ACCOUNT_ALREADY_CONNECTED: "This account is already connected to Telegram",
  TOKEN_NOT_FOUND:
    "Invalid or Expired token. Please generate a new one from the Telegram",
  NO_CONTENT_FOUND: "No Content Found",
  TAG_NAME_EXIST: "Tag Name already exist",
  NO_TAG_FOUND: "No Tag Found",
  NO_UPDATE_FIELD: "No fields provided for update",
  USER_DELETE_FAILED: "User deletion failed. Retry later.",
  TAG_NAME_REQUIRED: "tagName is required and must be a string",
  EXTENSION_REQUIRED: "Extension is required",
};

export const ContentType = {
  link: "link",
  image: "image",
  video: "video",
  document: "document",
};
