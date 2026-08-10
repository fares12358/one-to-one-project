import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SALT      = "one-to-one-email-config"; // fixed — this derives an app key, not a password hash

// Key derived from the existing required JWT_SECRET rather than a new env var.
const getKey = () => crypto.scryptSync(process.env.JWT_SECRET, SALT, 32);

// Returns "iv:authTag:ciphertext" (all hex)
export const encrypt = (text) => {
  const iv     = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(String(text), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext.toString("hex")}`;
};

export const decrypt = (payload) => {
  const [ivHex, authTagHex, dataHex] = String(payload || "").split(":");
  if (!ivHex || !authTagHex || !dataHex) throw new Error("Malformed encrypted payload");

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(dataHex, "hex")),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
};
