import {
    sendTelegramMessage,
} from "./telegram.service.js";

import {
    getTelegramChatId,
} from "./telegram-config.service.js";


export async function notifyContactSubmission({
    name,
    email,
    phone,
    subject,
    message,
}) {

    const chatId = getTelegramChatId();


    // =========================
    // No Chat ID
    // =========================

    if (!chatId) {
        console.log(
            "Telegram notification skipped: Chat ID not configured"
        );

        return {
            sent: false,
            configured: false,
            message:
                "Telegram bot is not configured. Submission was received successfully.",
        };
    }


    // =========================
    // Build Telegram Message
    // =========================

    const telegramMessage = `
  📩 <b>New Form Submission</b>
  
  ━━━━━━━━━━━━━━━━━━
  
  👤 <b>Name</b>
  ${escapeHtml(name)}
  
  📧 <b>Email</b>
  ${escapeHtml(email)}
  
  📱 <b>Phone</b>
  ${escapeHtml(phone)}
  
  📌 <b>Subject</b>
  ${escapeHtml(subject)}
  
  💬 <b>Message</b>
  ${escapeHtml(message)}
  
  ━━━━━━━━━━━━━━━━━━
  
  🕐 <b>Submitted:</b>
  ${new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
    })}
    `;


    // =========================
    // Send
    // =========================

    const result = await sendTelegramMessage(
        chatId,
        telegramMessage
    );


    if (!result.success) {
        return {
            sent: false,
            configured: true,
            message:
                "Telegram bot was unable to receive the message. We will notify you through another channel.",
        };
    }


    return {
        sent: true,
        configured: true,
        message:
            "Telegram notification sent successfully.",
    };
}


// Telegram HTML safety
function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}