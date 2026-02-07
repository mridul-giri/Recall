import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../config/config.js";

const createS3Client = () => {
  return new S3Client({
    region: config.BUCKET_REGION,
    credentials: {
      accessKeyId: config.ACCESS_KEY,
      secretAccessKey: config.SECRET_ACCESS_KEY,
    },
  });
};

export const s3Client = createS3Client();
