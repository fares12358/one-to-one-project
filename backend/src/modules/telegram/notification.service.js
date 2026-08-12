import { sendTelegramMessage } from "./telegram.service.js";
import { getTelegramConfig }   from "./telegram-config.service.js";

// ─── notifyContactSubmission ────────────────────────────────────────────────────
// Sends a formatted Telegram message when a contact form is submitted.
// Always resolves — never throws — so it is safe to call without await or
// with a fire-and-forget .catch() in the contact controller.
export async function notifyContactSubmission({ name, email, phone, subject, message }) {
  // Load bot token + chat ID from DB (with env-var fallback).
  const { botToken, chatId } = await getTelegramConfig();

  if (!botToken || !chatId) {
    console.log("[telegram] Notification skipped: bot token or Chat ID not configured");
    return {
      sent:       false,
      configured: false,
      message:    "Telegram is not configured. Submission was received successfully.",
    };
  }

  // ─── Build message ──────────────────────────────────────────────────────────
  const text = `
📩 <b>New Form Submission</b>

━━━━━━━━━━━━━━━━━━

👤 <b>Name</b>
${escapeHtml(name)}

📧 <b>Email</b>
${escapeHtml(email)}

📱 <b>Phone</b>
${escapeHtml(phone || "—")}

📌 <b>Subject</b>
${escapeHtml(subject || "—")}

💬 <b>Message</b>
${escapeHtml(message)}

━━━━━━━━━━━━━━━━━━

🕐 <b>Submitted:</b>
${new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" })}
  `.trim();

  // ─── Send ───────────────────────────────────────────────────────────────────
  const result = await sendTelegramMessage(botToken, chatId, text);

  if (!result.success) {
    return {
      sent:       false,
      configured: true,
      message:    "Telegram bot was unable to send the message.",
    };
  }

  return { sent: true, configured: true, message: "Telegram notification sent." };
}

// ─── Telegram HTML safety ───────────────────────────────────────────────────────
function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
