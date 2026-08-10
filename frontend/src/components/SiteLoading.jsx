"use client";

import { Loader2 } from "lucide-react";

const COPY = {
  en: "Loading…",
  ar: "جارٍ التحميل…",
};

// Full-page gate shown while the public site waits for live content from the
// API — replaces the old "show local copy, swap in API content later" flow.
export default function SiteLoading({ lang = "en" }) {
  const isRTL = lang === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center bg-[#f5f2eb] gap-4"
    >
      <Loader2 size={32} className="animate-spin text-[var(--brand-primary)]" />
      <p className="text-sm text-[#3d5228]">{COPY[lang] || COPY.en}</p>
    </div>
  );
}
