import crypto from "crypto";
export const algorithm = "aes-256-cbc";
export const secretKey = crypto.randomBytes(32); // Generate a random secret key (Save this in .env)
export const iv = crypto.randomBytes(16);