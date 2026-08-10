"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, Mail } from "lucide-react";
import api from "@/services/api";

const DEFAULTS = {
  provider: "app_password", host: "", port: 587, secure: false,
  user: "", pass: "", from: "", to: "", passSet: false,
};

const INPUT = "w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm " +
  "focus:outline-none focus:border-[#037338] focus:bg-white focus:shadow-[0_0_0_4px_rgba(3,115,56,0.08)] transition-all";

// Independent of the page's main Settings save flow — different endpoint
// (/api/settings/email, never exposed publicly) and more sensitive fields,
// so it gets its own fetch/save instead of joining the shared SaveBar.
export default function EmailSettingsCard() {
  const [cfg,     setCfg]     = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get("/settings/email")
      .then(({ data }) => setCfg({ ...DEFAULTS, ...data.data, pass: "" }))
      .catch(() => toast.error("Failed to load email settings"))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setCfg((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { ...cfg };
      if (!payload.pass) delete payload.pass; // blank = keep the currently-saved password
      const { data } = await api.put("/settings/email", payload);
      setCfg({ ...DEFAULTS, ...data.data, pass: "" });
      toast.success("Email settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save email settings");
    } finally {
      setIsSaving(false);
    }
  };

  const isCustomSmtp = cfg.provider === "smtp";

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-center py-12">
        <Loader2 size={20} className="animate-spin text-[#037338]" />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-[#037338]" />
          <h2 className="text-base font-semibold text-gray-800">Email Delivery</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Used for contact-form notifications and admin password-reset emails.
        </p>
      </div>

      <div className="inline-flex rounded-xl border-2 border-gray-200 p-1 bg-gray-50">
        <button
          type="button"
          onClick={() => set("provider", "app_password")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !isCustomSmtp ? "bg-[#037338] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Gmail (App Password)
        </button>
        <button
          type="button"
          onClick={() => set("provider", "smtp")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isCustomSmtp ? "bg-[#037338] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Custom SMTP Server
        </button>
      </div>

      {isCustomSmtp && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
            <input type="text" value={cfg.host} onChange={(e) => set("host", e.target.value)} placeholder="smtp.example.com" className={INPUT} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
            <input type="number" value={cfg.port} onChange={(e) => set("port", e.target.value)} placeholder="587" className={INPUT} />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="email-secure"
              checked={cfg.secure}
              onChange={(e) => set("secure", e.target.checked)}
              className="w-4 h-4 accent-[#037338]"
            />
            <label htmlFor="email-secure" className="text-sm text-gray-700">Use SSL (port 465)</label>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isCustomSmtp ? "SMTP Username" : "Gmail Address"}
          </label>
          <input type="email" value={cfg.user} onChange={(e) => set("user", e.target.value)} placeholder="you@example.com" className={INPUT} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isCustomSmtp ? "Password" : "App Password"}
          </label>
          <input
            type="password"
            value={cfg.pass}
            onChange={(e) => set("pass", e.target.value)}
            placeholder={cfg.passSet ? "•••••••• (saved — leave blank to keep)" : "Enter a password"}
            className={INPUT}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From (optional)</label>
          <input type="text" value={cfg.from} onChange={(e) => set("from", e.target.value)} placeholder="One to One <you@example.com>" className={INPUT} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact form inbox (To)</label>
          <input type="email" value={cfg.to} onChange={(e) => set("to", e.target.value)} placeholder="info@oneto-one.com" className={INPUT} />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#037338] text-white hover:bg-[#025c2e] transition-colors disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Email Settings"}
        </button>
      </div>
    </section>
  );
}
