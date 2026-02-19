const BotReplies = {
  UNEXPECTED_ERROR: "Something went wrong. Please try again.",
  UNSUPPORTED_TEXT_MESSAGE: `Sorry, I can't save this as a note yet.
    Recall currently supports:
    - Links (articles, YouTube, images, etc.)
    - Images
    - Video files
    - Document files`,
  WELCOME: "Welcome to Recall 👋",
  LINK_SAVE_SUCCESS: "Your links were saved successfully ✅",
  LINK_LIMIT_ERROR: "You can not store more than 5 link at a time",
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
