import express from "express";

import {
  sendTelegramMessage,
} from "../telegram/telegram.service.js";

import {
  setTelegramChatId,
} from "../telegram/telegram-config.service.js";

const router = express.Router();


// Telegram Webhook
router.post("/webhook", async (req, res) => {
  try {
    const update = req.body;

    const message = update.message;

    if (!message) {
      return res.sendStatus(200);
    }

    const chatId = message.chat.id;

    const text = message.text || "";

    console.log("Telegram message:", {
      chatId,
      text,
    });


    // =========================
    // /start
    // =========================

    if (text === "/start") {
      await sendTelegramMessage(
        chatId,
        `
<b>🤖 Bot Connection</b>

Your Telegram Chat ID is:

<code>${chatId}</code>

Copy this ID and add it to your Dashboard to enable notifications.

<b>Bot Status:</b> Waiting for configuration.
        `
      );

      return res.sendStatus(200);
    }


    // =========================
    // /id
    // =========================

    if (text === "/id") {
      await sendTelegramMessage(
        chatId,
        `
<b>Your Telegram Chat ID</b>

<code>${chatId}</code>

Copy this ID and add it to your Dashboard.
        `
      );

      return res.sendStatus(200);
    }


    // =========================
    // /subscribe
    // =========================

    if (text === "/subscribe") {
      setTelegramChatId(chatId);

      await sendTelegramMessage(
        chatId,
        `
✅ <b>Telegram Connected</b>

Your Chat ID has been registered:

<code>${chatId}</code>

You can now receive form submission notifications.
        `
      );

      return res.sendStatus(200);
    }


    // =========================
    // Unknown command
    // =========================

    await sendTelegramMessage(
      chatId,
      `
🤖 Available commands:

/start - Get your Chat ID
/id - Get your Chat ID
/subscribe - Connect this chat
      `
    );

    return res.sendStatus(200);

  } catch (error) {
    console.error(
      "Telegram webhook error:",
      error
    );

    // Always return 200 to Telegram
    return res.sendStatus(200);
  }
});

export default router;