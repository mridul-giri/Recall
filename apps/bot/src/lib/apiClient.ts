import axios from "axios";
import { config } from "../utils/config.js";

export const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "x-internal-token": config.BOT_INTERNAL_TOKEN,
  },
});
