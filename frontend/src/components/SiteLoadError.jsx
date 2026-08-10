"use client";

const COPY = {
  en: {
    title: "Server is down",
    body:  "We couldn't reach the server. Please try again in a moment.",
    retry: "Retry",
  },
  ar: {
    title: "الخادم غير متاح",
    body:  "تعذّر الاتصال بالخادم. يرجى المحاولة مرة أخرى بعد قليل.",
    retry: "إعادة المحاولة",
  },
};

// Full-page gate shown when the initial live-content fetch fails — the public
// site no longer falls back to silently rendering stale local copy.
export default function SiteLoadError({ lang = "en", onRetry }) {
  const c = COPY[lang] || COPY.en;
  const isRTL = lang === "ar";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col items-center justify-center bg-[#f5f2eb] p-8 text-center gap-4"
    >
      <div className="text-[var(--brand-primary)] text-5xl">⚠</div>
      <h2 className="text-xl font-semibold text-[#1a2e0e]">{c.title}</h2>
      <p className="text-sm text-[#3d5228] max-w-sm">{c.body}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-[var(--brand-primary)] text-white rounded-xl text-sm font-medium hover:bg-[#025c2e] transition-colors"
      >
        {c.retry}
      </button>
    </div>
  );
}
