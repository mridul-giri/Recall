import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./createS3Client.js";
import { config } from "../config/config.js";
import { ContentType } from "@repo/db";

export const uploadFileToS3 = async (
  contentId: string,
  contentType: string,
  extension: string,
  fileBuffer: Buffer,
  mediaType: string,
) => {
  const key = `${config.BUCKET_KEY}/${contentType}/${contentId}.${extension}`;

  await s3Client?.send(
    new PutObjectCommand({
      Bucket: config.BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mediaType,
    }),
  );
};
