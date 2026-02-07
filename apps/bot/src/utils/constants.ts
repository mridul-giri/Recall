const BotReplies = {
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
  USER_CREATE_OR_UPDATE_FAILED:
    "Failed to create or update your account. Please try again.",
  UNSUPPORTED_TEXT_MESSAGE: `Sorry, I can't save this as a note yet.
    Recall currently supports:
    - Links (articles, YouTube, images, etc.)
    - Images
    - Video files
    - Document files`,
  WELCOME: "Welcome to Recall 👋",
  USER_ACCOUNT_NOT_FOUND:
    "Your account doesn’t exist yet. Send /start to create one.",
  LINK_SAVE_FAILED: "Failed to save your links. Please try again.",
  NO_VALID_LINK_FOUND: "No valid links found to save",
  LINK_SAVE_SUCCESS: "Your links were saved successfully ✅",
  MAX_FILE_SIZE: "Max allowed size is 10 MB",
  SAVING: "Saving...",
  IMAGE_SAVE_FAILED: "Failed to save your image. Please try again.",
  IMAGE_SAVE_SUCCESS: "Your image were saved successfully ✅",
  VIDEO_SAVE_FAILED: "Failed to save your video. Please try again.",
  VIDEO_SAVE_SUCCESS: "Your video were saved successfully ✅",
  DOCUMENT_SAVE_FAILED: "Failed to save your document. Please try again.",
  DOCUMENT_SAVE_SUCCESS: "Your document were saved successfully ✅",
};

export default BotReplies;
