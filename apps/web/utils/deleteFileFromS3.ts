import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./createS3Client";
import { config } from "./config";

export const deleteFileFromS3 = async (
  userId: string,
  contentType: string,
  contentId: string,
  extension: string,
) => {
  const key = `${config.BUCKET_KEY}/${userId}/${contentType}/${contentId}.${extension}`;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.BUCKET_NAME,
      Key: key,
    }),
  );
};
