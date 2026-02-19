import { parseEnv } from "znv";
import z from "zod";
import * as dotenv from "dotenv";

dotenv.config();

function getConfig() {
  return parseEnv(process.env, {
    DATABASE_URL: z.string(),
    ACCESS_KEY: z.string(),
    SECRET_ACCESS_KEY: z.string(),
    BUCKET_REGION: z.string(),
    BUCKET_KEY: z.string(),
    BUCKET_NAME: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXTAUTH_SECRET: z.string(),
    CLIENT_URL: z.string(),
    DISTRIBUTION_DOMAIN: z.string(),
    DISTRIBUTION_ID: z.string(),
    CLOUD_FRONT_KEYPAIR_ID: z.string(),
    CLOUD_FRONT_PRIVATE_KEY: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
  });
}

export type Config = ReturnType<typeof getConfig>;

export const config: Config = getConfig();
