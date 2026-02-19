import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { config } from "./config";
import { s3Client } from "./createS3Client";

export const deleteFolderFromS3 = async (userId: string) => {
  const prefix = `${config.BUCKET_KEY}/${userId}/`;

  let continuationToken: string | undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: config.BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const contents = response.Contents;

    if (contents && contents.length > 0) {
      const object = contents.map((item) => ({
        Key: item.Key,
      }));

      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket: config.BUCKET_NAME,
          Delete: {
            Objects: object,
          },
        }),
      );
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);
};
