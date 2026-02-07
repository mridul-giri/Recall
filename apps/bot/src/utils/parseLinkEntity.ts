const parseLinkEntity = (text: string, offset: number, length: number) => {
  let raw = text.slice(offset, offset + length);
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    raw = "https://" + raw;
  }
  try {
    const url = new URL(raw);
    return { url: url.toString(), provider: url.hostname };
  } catch (error) {
    console.warn(`Failed to parse URL: ${raw}`);
    return null;
  }
};

export default parseLinkEntity;
