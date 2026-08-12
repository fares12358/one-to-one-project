import axios from "axios";

// ─── Helper ────────────────────────────────────────────────────────────────────
// Builds the Telegram API base URL for a given bot token.
// Token is passed per-call (not read from process.env at module load) so that
// it can be sourced from the DB-backed config at runtime.
function apiUrl(botToken) {
  return `https://api.telegram.org/bot${botToken}`;
}

// ─── sendTelegramMessage ────────────────────────────────────────────────────────
// Sends an HTML-formatted message to a Telegram chat.
// Returns a result object — never throws — so callers can treat this as a
// fire-and-forget side-effect without wrapping in try/catch.
export async function sendTelegramMessage(botToken, chatId, text) {
  if (!botToken) {
    return { success: false, configured: false, message: "Telegram bot token is not configured" };
  }
  if (!chatId) {
    return { success: false, configured: false, message: "Telegram Chat ID is not configured" };
  }

  try {
    const response = await axios.post(`${apiUrl(botToken)}/sendMessage`, {
      chat_id:    chatId,
      text,
      parse_mode: "HTML",
    });
    return { success: true, configured: true, data: response.data };
  } catch (error) {
    console.error("[telegram] Send error:", error.response?.data || error.message);
    return {
      success:    false,
      configured: true,
      message:    error.response?.data?.description || "Telegram bot was unable to send the message",
    };
  }
}

// ─── getMe ──────────────────────────────────────────────────────────────────────
// Verifies that the bot token is valid and returns the bot's info.
// Used by the dashboard "Test Connection" flow.
export async function getMe(botToken) {
  if (!botToken) throw new Error("Bot token is required");
  try {
    const response = await axios.get(`${apiUrl(botToken)}/getMe`);
    return response.data;
  } catch (error) {
    console.error("[telegram] getMe error:", error.response?.data || error.message);
    throw error;
  }
}

// ─── setTelegramWebhook ─────────────────────────────────────────────────────────
export async function setTelegramWebhook(botToken, webhookUrl) {
  if (!botToken) throw new Error("Bot token is required");
  try {
    const response = await axios.post(`${apiUrl(botToken)}/setWebhook`, {
      url:          webhookUrl,
      secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    });
    return response.data;
  } catch (error) {
    console.error("[telegram] setWebhook error:", error.response?.data || error.message);
    throw error;
  }
}
