import { createCipheriv, createDecipheriv , randomBytes } from "node:crypto";

export function encryptGoogleToken(token: string) {
  const key = Buffer.from(
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY!,
    "base64",
  );

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes.");
  }

  const iv = randomBytes(12);

  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const encryptedToken = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  return {
    encryptedToken: encryptedToken.toString("base64"),
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
  };
}


export function decryptGoogleToken(data: {
  encryptedToken: string;
  iv: string;
  authTag: string;
}) {
  const key = Buffer.from(
    process.env.GOOGLE_TOKEN_ENCRYPTION_KEY!,
    "base64",
  );

  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes.");
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(data.iv, "base64"),
  );

  decipher.setAuthTag(
    Buffer.from(data.authTag, "base64"),
  );

  const decrypted = Buffer.concat([
    decipher.update(
      Buffer.from(data.encryptedToken, "base64"),
    ),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

