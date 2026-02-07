const compareSizeLimit = async (fileSize: number) => {
  const MAX_FILE_MB = 10;
  const MAX_FILE_BYTES = MAX_FILE_MB * 1000000;

  if (fileSize > MAX_FILE_BYTES) {
    return false;
  }
  return true;
};

export default compareSizeLimit;
