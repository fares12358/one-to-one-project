import Settings from "../settings/settings.model.js";
import { decrypt } from "../../utils/crypto.js";

// ─── getTelegramConfig ──────────────────────────────────────────────────────────
// Reads the Telegram bot token and chat ID from the Settings document.
// Falls back to env vars so the app still works if the DB entry hasn't been
// created yet (zero-downtime for existing deployments using env-only config).
//
// Returns: { botToken: string|null, chatId: string|null }
// Throws:  never — failures are logged and nulls are returned so a Telegram
//          error never breaks the contact form submission path.
export async function getTelegramConfig() {
  try {
    const settings = await Settings.findOne({}).select("telegramConfig").lean();
    const cfg = settings?.telegramConfig || {};

    // Bot token — decrypt from DB if stored, fall back to env var.
    let botToken = null;
    if (cfg.botTokenEncrypted) {
      try {
        botToken = decrypt(cfg.botTokenEncrypted);
      } catch (decryptErr) {
        console.warn("[telegram] Failed to decrypt bot token — falling back to env var:", decryptErr.message);
        botToken = process.env.TELEGRAM_BOT_TOKEN || null;
      }
    } else {
      botToken = process.env.TELEGRAM_BOT_TOKEN || null;
    }

    // Chat ID — use DB value if set, fall back to env var.
    const chatId = cfg.chatId || process.env.TELEGRAM_CHAT_ID || null;

    return { botToken, chatId };
  } catch (err) {
    console.warn("[telegram] Failed to load config from DB — falling back to env vars:", err.message);
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN || null,
      chatId:   process.env.TELEGRAM_CHAT_ID   || null,
    };
  }
}
