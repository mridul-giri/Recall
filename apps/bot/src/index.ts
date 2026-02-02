import bot from "./bot/bot.js";
import { webhookCallback } from "grammy";
import express from "express";
import { config } from "./config/config.js";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const secretWebhookPath = uuidv4();

app.use(`/${secretWebhookPath}`, webhookCallback(bot, "express"));

app.listen(config.WEBHOOK_PORT, async () => {
  try {
    await bot.api.setWebhook(`${config.DOMAIN}/${secretWebhookPath}`);
    console.log("Bot Webhook is running");
  } catch (error) {
    console.error(error);
  }
});
