import { parseEnv } from "znv";
import z from "zod";
import * as dotenv from "dotenv";

dotenv.config();

function getConfig() {
  return parseEnv(process.env, {
    BOT_TOKEN: z.string(),
    DOMAIN: z.string(),
    WEBHOOK_PORT: z.number().default(5000),
    API_BASE_URL: z.string(),
    BOT_INTERNAL_TOKEN: z.string(),
  });
}

export type Config = ReturnType<typeof getConfig>;

export const config: Config = getConfig();
