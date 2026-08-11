let dashboardChatId = null;


// Get configured Chat ID
export function getTelegramChatId() {
    return (
        dashboardChatId ||
        process.env.TELEGRAM_CHAT_ID ||
        null
    );
}


// Set Chat ID from Dashboard
export function setTelegramChatId(chatId) {
    dashboardChatId = String(chatId);

    return dashboardChatId;
}


// Remove Chat ID
export function clearTelegramChatId() {
    dashboardChatId = null;
}


// Get Telegram configuration
export function getTelegramConfig() {
    const chatId = getTelegramChatId();

    return {
        configured: Boolean(chatId),
        chatId: chatId || null,
        source: dashboardChatId
            ? "dashboard"
            : process.env.TELEGRAM_CHAT_ID
                ? "env"
                : null,
    };
}