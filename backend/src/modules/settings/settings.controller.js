import Settings from "./settings.model.js";
import { encrypt, decrypt } from "../../utils/crypto.js";

const DEFAULTS = {
  brandName:         "One to One",
  primaryColor:      "#037338",
  accentColor:       "#96C422",
  email:             "info@oneto-one.com",
  phone:             "+20 128 763 6986",
  whatsapp:          "+20 128 763 6986",
  website:           "www.oneto-one.com",
  location:          "All Egypt",
  socialLinks:       { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl:           "",
  logoWhiteUrl:      "",
  logoPublicId:      "",
  logoWhitePublicId: "",
  metaPixelId:       "",
};

const ALLOWED_FIELDS = [
  "brandName", "primaryColor", "accentColor",
  "email", "phone", "whatsapp", "website", "location",
  "socialLinks",
  "logoUrl", "logoWhiteUrl",
  "logoPublicId", "logoWhitePublicId",
  "metaPixelId",
];

// ─── GET /api/settings  (public) ───────────────────────────────────────────────
// emailConfig and telegramConfig are explicitly excluded — not safe for public exposure.
// metaPixelId IS included — the frontend needs it to initialise the pixel.
export const get = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({})
      .select("-emailConfig -telegramConfig")
      .lean();
    res.json({ success: true, data: settings || DEFAULTS });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/settings  (protected) ────────────────────────────────────────────
export const update = async (req, res, next) => {
  try {
    const payload = {};
    ALLOWED_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });

    if (payload.socialLinks) {
      const { facebook, linkedin, instagram, whatsapp } = payload.socialLinks;
      payload.socialLinks = { facebook, linkedin, instagram, whatsapp };
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Email config
// ─────────────────────────────────────────────────────────────────────────────

const EMAIL_CONFIG_DEFAULTS = {
  provider: "app_password", host: "", port: 587, secure: false,
  user: "", from: "", to: "",
};
const GMAIL_DEFAULTS = { host: "smtp.gmail.com", port: 587, secure: false };

export const getEmailConfig = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({}).select("emailConfig").lean();
    const cfg = settings?.emailConfig || {};
    res.json({
      success: true,
      data: { ...EMAIL_CONFIG_DEFAULTS, ...cfg, passSet: Boolean(cfg.passEncrypted), passEncrypted: undefined },
    });
  } catch (err) {
    next(err);
  }
};

export const updateEmailConfig = async (req, res, next) => {
  try {
    const { provider, host, port, secure, user, pass, from, to } = req.body;
    const isAppPassword = provider === "app_password";
    const payload = {
      "emailConfig.provider": isAppPassword ? "app_password" : "smtp",
      "emailConfig.host":     isAppPassword ? GMAIL_DEFAULTS.host   : (host || ""),
      "emailConfig.port":     isAppPassword ? GMAIL_DEFAULTS.port   : (Number(port) || 587),
      "emailConfig.secure":   isAppPassword ? GMAIL_DEFAULTS.secure : Boolean(secure),
      "emailConfig.user":     user || "",
      "emailConfig.from":     from || "",
      "emailConfig.to":       to   || "",
    };
    if (typeof pass === "string" && pass.trim() !== "") {
      payload["emailConfig.passEncrypted"] = encrypt(pass.trim());
    }
    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    ).select("emailConfig").lean();
    res.json({
      success: true,
      data: { ...EMAIL_CONFIG_DEFAULTS, ...updated.emailConfig, passSet: Boolean(updated.emailConfig?.passEncrypted), passEncrypted: undefined },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Telegram config
// ─────────────────────────────────────────────────────────────────────────────

export const getTelegramConfig = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({}).select("telegramConfig").lean();
    const cfg = settings?.telegramConfig || {};
    res.json({
      success: true,
      data: { tokenSet: Boolean(cfg.botTokenEncrypted), chatId: cfg.chatId || "" },
    });
  } catch (err) {
    next(err);
  }
};

export const updateTelegramConfig = async (req, res, next) => {
  try {
    const { botToken, chatId } = req.body;
    const payload = {};

    if (typeof botToken === "string" && botToken.trim() !== "") {
      payload["telegramConfig.botTokenEncrypted"] = encrypt(botToken.trim());
    }
    if (chatId !== undefined) {
      payload["telegramConfig.chatId"] = String(chatId).trim();
    }
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, message: "Nothing to update" });
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    ).select("telegramConfig").lean();

    const cfg = updated?.telegramConfig || {};
    res.json({
      success: true,
      data: { tokenSet: Boolean(cfg.botTokenEncrypted), chatId: cfg.chatId || "" },
    });
  } catch (err) {
    next(err);
  }
};
