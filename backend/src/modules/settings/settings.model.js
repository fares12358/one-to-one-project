import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    brandName:         { type: String, default: "One to One" },
    primaryColor:      { type: String, default: "#037338" },
    accentColor:       { type: String, default: "#96C422" },
    email:             { type: String, default: "info@oneto-one.com" },
    phone:             { type: String, default: "+20 128 763 6986" },
    whatsapp:          { type: String, default: "+20 128 763 6986" },
    website:           { type: String, default: "www.oneto-one.com" },
    location:          { type: String, default: "All Egypt" },
    socialLinks: {
      facebook:  { type: String, default: "" },
      linkedin:  { type: String, default: "" },
      instagram: { type: String, default: "" },
      whatsapp:  { type: String, default: "https://wa.me/201287636986" },
    },
    logoUrl:           { type: String, default: "" },
    logoWhiteUrl:      { type: String, default: "" },
    // publicIds needed to delete the old file when a logo is replaced — stored alongside URLs
    logoPublicId:      { type: String, default: "" },
    logoWhitePublicId: { type: String, default: "" },

    // Outbound email delivery config — dashboard-editable alternative to the
    // EMAIL_* env vars. NEVER returned by the public GET /api/settings route
    // (settings.controller.js's `get` explicitly excludes this field) —
    // only reachable via the protected GET/PUT /api/settings/email pair.
    emailConfig: {
      provider:      { type: String, enum: ["smtp", "app_password"], default: "app_password" },
      host:          { type: String,  default: "" },
      port:          { type: Number,  default: 587 },
      secure:        { type: Boolean, default: false },
      user:          { type: String,  default: "" },
      passEncrypted: { type: String,  default: "" }, // AES-256-GCM — see utils/crypto.js
      from:          { type: String,  default: "" },
      to:            { type: String,  default: "" },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
