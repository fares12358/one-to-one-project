"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Send, Link } from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import api from "@/services/api";

const DEFAULTS = { tokenSet: false, chatId: "", botToken: "" };

const INPUT =
  "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

export default function TelegramSettingsCard() {
  const [cfg,            setCfg]            = useState(DEFAULTS);
  const [webhookUrl,     setWebhookUrl]     = useState("");
  const [webhookInfo,    setWebhookInfo]    = useState(null); // { url, pending_update_count, last_error_message? }
  const [loading,        setLoading]        = useState(true);
  const [isSaving,       setIsSaving]       = useState(false);
  const [isTesting,      setIsTesting]      = useState(false);
  const [isRegistering,  setIsRegistering]  = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/settings/telegram"),
      api.get("/telegram/webhook-info").catch(() => null),
    ]).then(([settingsRes, webhookRes]) => {
      setCfg({ ...DEFAULTS, ...settingsRes.data.data, botToken: "" });
      if (webhookRes?.data?.data) setWebhookInfo(webhookRes.data.data);
    })
    .catch(() => toast.error("Failed to load Telegram settings"))
    .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { chatId: cfg.chatId };
      if (cfg.botToken.trim()) payload.botToken = cfg.botToken.trim();

      const { data } = await api.put("/settings/telegram", payload);
      setCfg({ ...DEFAULTS, ...data.data, botToken: "" });
      toast.success("Telegram settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save Telegram settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegisterWebhook = async () => {
    setIsRegistering(true);
    try {
      const payload = webhookUrl.trim() ? { webhookUrl: webhookUrl.trim() } : {};
      const { data } = await api.post("/telegram/register-webhook", payload);
      toast.success(data.message || "Webhook registered!");
      // Refresh webhook info
      const infoRes = await api.get("/telegram/webhook-info").catch(() => null);
      if (infoRes?.data?.data) setWebhookInfo(infoRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Webhook registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const { data } = await api.get("/telegram/test");
      toast.success(data.message || "Test message sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Test failed — check your bot token and Chat ID");
    } finally {
      setIsTesting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-[#037338]" />
      </section>
    );
  }

  const webhookRegistered = Boolean(webhookInfo?.url);

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <FaTelegram size={18} className="text-[#037338]" />
          <h2 className="text-base font-semibold text-gray-800">Telegram Bot Settings</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Contact form submissions will be sent as Telegram messages to the configured chat.
        </p>
      </div>

      {/* Setup hint */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500 space-y-1 leading-relaxed">
        <p className="font-medium text-gray-600">How to set up</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Create a bot via <span className="font-mono">@BotFather</span> on Telegram and copy the token.</li>
          <li>Paste the token below and save.</li>
          <li>Enter your server URL and click <b>Register Webhook</b>.</li>
          <li>Open a chat with your bot and send <span className="font-mono">/start</span> — it will reply with your Chat ID.</li>
          <li>Paste the Chat ID below, save again, then use <b>Send Test Message</b>.</li>
        </ol>
      </div>

      {/* Bot token + Chat ID */}
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bot Token</label>
          <input
            type="password"
            value={cfg.botToken}
            onChange={(e) => set("botToken", e.target.value)}
            placeholder={cfg.tokenSet ? "•••••••• (saved — leave blank to keep)" : "123456789:ABCDefgh..."}
            className={INPUT}
            autoComplete="new-password"
          />
          {cfg.tokenSet && !cfg.botToken && (
            <p className="text-xs text-[#037338] mt-1 ml-1">✓ A token is already saved</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chat ID</label>
          <input
            type="text"
            value={cfg.chatId}
            onChange={(e) => set("chatId", e.target.value)}
            placeholder="e.g. -1001234567890"
            className={INPUT + " font-mono"}
          />
          <p className="text-xs text-gray-400 mt-1 ml-1">
            Send <span className="font-mono">/start</span> to your bot after registering the webhook to get this.
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Telegram Settings"}
        </button>
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Webhook registration */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Server URL <span className="text-gray-400 font-normal">(for webhook registration)</span>
          </label>
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            placeholder="https://your-backend-domain.com"
            className={INPUT}
          />
          <p className="text-xs text-gray-400 mt-1 ml-1">
            Leave blank to use <span className="font-mono">WEBHOOK_BASE_URL</span> from your server environment.
          </p>
        </div>

        {/* Current webhook status */}
        {webhookInfo && (
          <div className={`rounded-lg px-4 py-3 text-xs font-mono break-all ${
            webhookRegistered
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-gray-50 border border-gray-200 text-gray-500"
          }`}>
            {webhookRegistered ? (
              <>
                <span className="font-sans font-medium text-green-800">✓ Webhook registered</span>
                <br />
                {webhookInfo.url}
                {webhookInfo.last_error_message && (
                  <p className="text-red-500 mt-1 font-sans">
                    Last error: {webhookInfo.last_error_message}
                  </p>
                )}
              </>
            ) : (
              <span className="font-sans">No webhook registered yet</span>
            )}
          </div>
        )}

        <button
          onClick={handleRegisterWebhook}
          disabled={isRegistering || !cfg.tokenSet}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border-2 border-[#037338] text-[#037338] hover:bg-[#037338] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isRegistering ? <Loader2 size={14} className="animate-spin" /> : <Link size={14} />}
          {isRegistering ? "Registering..." : webhookRegistered ? "Re-register Webhook" : "Register Webhook"}
        </button>
        {!cfg.tokenSet && (
          <p className="text-xs text-gray-400 ml-1">Save a bot token first to enable webhook registration.</p>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Test */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Sends a real message to the configured Chat ID.
        </p>
        <button
          onClick={handleTest}
          disabled={isTesting || (!cfg.tokenSet && !cfg.botToken.trim()) || !cfg.chatId.trim()}
          className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border-2 border-[#037338] text-[#037338] hover:bg-[#037338] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isTesting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {isTesting ? "Sending..." : "Send Test Message"}
        </button>
      </div>

    </section>
  );
}
