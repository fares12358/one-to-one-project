import express from "express";
import { sendTelegramMessage, getMe, setTelegramWebhook } from "./telegram.service.js";
import { getTelegramConfig }   from "./telegram-config.service.js";
import authMiddleware          from "../../middlewares/auth.middleware.js";

const router = express.Router();

// ─── POST /api/telegram/webhook  (public — called by Telegram servers) ──────────
// Telegram requires a 200 response or it will keep retrying.
// Added to CSRF_PUBLIC_PATHS in server.js so the origin check doesn't block it
// (Telegram sends no Origin header). Secret token header validates the caller.
router.post("/webhook", async (req, res) => {
  try {
    // Webhook secret validation — reject anything not from Telegram.
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret && req.headers["x-telegram-bot-api-secret-token"] !== secret) {
      return res.sendStatus(401);
    }

    const update  = req.body;
    const message = update.message;
    if (!message) return res.sendStatus(200);

    const chatId = message.chat.id;

    // Normalise to lowercase so /Start /ID /START etc. all work.
    const cmd = (message.text || "").trim().toLowerCase();

    console.log("[telegram] Webhook message:", { chatId, cmd });

    // Load the current bot token from DB/env to reply.
    const { botToken } = await getTelegramConfig();

    // ─── /start ──────────────────────────────────────────────────────────────
    if (cmd === "/start") {
      await sendTelegramMessage(botToken, chatId,
        `<b>🤖 Bot Connected</b>\n\nYour Telegram Chat ID is:\n\n<code>${chatId}</code>\n\nCopy this ID and paste it into the <b>Telegram Bot Settings</b> card in your Dashboard.`
      );
      return res.sendStatus(200);
    }

    // ─── /id ─────────────────────────────────────────────────────────────────
    if (cmd === "/id") {
      await sendTelegramMessage(botToken, chatId,
        `<b>Your Chat ID</b>\n\n<code>${chatId}</code>\n\nPaste this into the Dashboard → Settings → Telegram Bot Settings.`
      );
      return res.sendStatus(200);
    }

    // ─── Unknown command ──────────────────────────────────────────────────────
    await sendTelegramMessage(botToken, chatId,
      `🤖 Available commands:\n\n/start — Get your Chat ID\n/id    — Get your Chat ID`
    );
    return res.sendStatus(200);

  } catch (error) {
    console.error("[telegram] Webhook error:", error);
    return res.sendStatus(200); // always 200 to Telegram
  }
});

// ─── POST /api/telegram/register-webhook  (protected) ──────────────────────────
// Tells Telegram where to send bot updates (your server's /api/telegram/webhook).
// Must be called once after:
//   - the bot token is saved in dashboard settings
//   - the backend is deployed and reachable on a public HTTPS URL
//
// Body: { webhookUrl: "https://your-domain.com/api/telegram/webhook" }
// Or omit webhookUrl and set WEBHOOK_BASE_URL in your .env instead.
router.post("/register-webhook", authMiddleware, async (req, res) => {
  try {
    const { botToken } = await getTelegramConfig();
    if (!botToken) {
      return res.status(400).json({ success: false, message: "Bot token is not configured" });
    }

    // Accept explicit URL from body, fall back to env var.
    const base = (req.body.webhookUrl || process.env.WEBHOOK_BASE_URL || "").replace(/\/$/, "");
    if (!base) {
      return res.status(400).json({
        success: false,
        message: "Provide webhookUrl in the request body or set WEBHOOK_BASE_URL in your environment",
      });
    }

    const webhookUrl = base.startsWith("http")
      ? `${base}/api/telegram/webhook`
      : `https://${base}/api/telegram/webhook`;

    const result = await setTelegramWebhook(botToken, webhookUrl);
    res.json({ success: true, message: `Webhook registered → ${webhookUrl}`, data: result });
  } catch (err) {
    res.status(502).json({ success: false, message: err.response?.data?.description || err.message });
  }
});

// ─── GET /api/telegram/webhook-info  (protected) ───────────────────────────────
// Returns the webhook currently registered with Telegram — useful to confirm
// registration went through without opening BotFather.
router.get("/webhook-info", authMiddleware, async (req, res) => {
  try {
    const { botToken } = await getTelegramConfig();
    if (!botToken) {
      return res.status(400).json({ success: false, message: "Bot token is not configured" });
    }
    const { default: axios } = await import("axios");
    const { data } = await axios.get(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    res.json({ success: true, data: data.result });
  } catch (err) {
    res.status(502).json({ success: false, message: err.message });
  }
});

// ─── GET /api/telegram/test  (protected) ───────────────────────────────────────
// Sends a test message to the configured chat so the admin can verify the setup
// without submitting a real form. Returns { success, message }.
router.get("/test", authMiddleware, async (req, res) => {
  try {
    const { botToken, chatId } = await getTelegramConfig();

    if (!botToken) {
      return res.status(400).json({ success: false, message: "Bot token is not configured" });
    }
    if (!chatId) {
      return res.status(400).json({ success: false, message: "Chat ID is not configured" });
    }

    const result = await sendTelegramMessage(
      botToken, chatId,
      `✅ <b>Test Notification</b>\n\nYour One to One Telegram bot is configured correctly.\nContact form submissions will appear here.`
    );

    if (!result.success) {
      return res.status(502).json({ success: false, message: result.message });
    }

    res.json({ success: true, message: "Test message sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
