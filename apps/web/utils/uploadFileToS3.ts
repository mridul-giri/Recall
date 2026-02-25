import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./createS3Client";
import { config } from "./config";

export const uploadFileToS3 = async (
  userId: string,
  contentId: string,
  contentType: string,
  extension: string,
  fileBuffer: Buffer,
  mediaType: string,
) => {
  const key = `${config.BUCKET_KEY}/${userId}/${contentType}/${contentId}.${extension}`;

  await s3Client?.send(
    new PutObjectCommand({
      Bucket: config.BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mediaType,
      ContentDisposition: `attachment; filename=recall"`,
    }),
  );
};
