import axios from "axios";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

const TELEGRAM_API =
  `https://api.telegram.org/bot${BOT_TOKEN}`;

// Send message
export async function sendTelegramMessage(chatId, text) {
  if (!chatId) {
    return {
      success: false,
      configured: false,
      message: "Telegram Chat ID is not configured",
    };
  }

  try {
    const response = await axios.post(
      `${TELEGRAM_API}/sendMessage`,
      {
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }
    );

    return {
      success: true,
      configured: true,
      data: response.data,
    };
  } catch (error) {
    console.error(
      "Telegram send error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      configured: true,
      message:
        error.response?.data?.description ||
        "Telegram bot was unable to receive the message",
    };
  }
}


// Get bot information
export async function getMe() {
  try {
    const response = await axios.get(
      `${TELEGRAM_API}/getMe`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Telegram getMe error:",
      error.response?.data || error.message
    );

    throw error;
  }
}


// Set Telegram webhook
export async function setTelegramWebhook(webhookUrl) {
  try {
    const response = await axios.post(
      `${TELEGRAM_API}/setWebhook`,
      {
        url: webhookUrl,
        secret_token:
          process.env.TELEGRAM_WEBHOOK_SECRET,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Telegram webhook error:",
      error.response?.data || error.message
    );

    throw error;
  }
}