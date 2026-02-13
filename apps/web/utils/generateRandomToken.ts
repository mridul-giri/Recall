import crypto from "node:crypto";

export const generateRandomToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { rawToken, hashToken, expiresAt };
};
