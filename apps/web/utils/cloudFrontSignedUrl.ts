import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { config } from "./config";

export async function cloudFrontSignedUrl(
  userId: string,
  contentType: string,
  contentId: string,
  extension: string | undefined,
) {
  if (!extension) return null;

  const path = `${config.BUCKET_KEY}/${userId}/${contentType}/${contentId}.${extension}`;
  const distributionDomain = config.DISTRIBUTION_DOMAIN;

  return getSignedUrl({
    url: `${distributionDomain}/${path}`,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 5),
    privateKey: config.CLOUD_FRONT_PRIVATE_KEY,
    keyPairId: config.CLOUD_FRONT_KEYPAIR_ID,
  });
}
