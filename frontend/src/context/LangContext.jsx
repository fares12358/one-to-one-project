"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  getTranslations,
  getTranslationsSync,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  RTL_LOCALES,
  LOCALE_META,
} from "@/i18n/index";
import SiteLoading   from "@/components/SiteLoading";
import SiteLoadError from "@/components/SiteLoadError";

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const pathname = usePathname();
  // Dashboard editors get their data from useSection() and never call the
  // content API here — keep that path instant, local-only, ungated.
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  const [lang, setLangState] = useState(DEFAULT_LOCALE);
  const [t,      setT]      = useState(isDashboard ? getTranslationsSync(DEFAULT_LOCALE) : null);
  const [status, setStatus] = useState(isDashboard ? "ready" : "loading"); // "loading" | "ready" | "error"
  const [retryToken, setRetryToken] = useState(0);
  // Only the very first load blocks the page behind the spinner/error screen —
  // a later language switch keeps showing current content while the new one loads.
  const hasLoadedOnce = useRef(isDashboard);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vs_lang");
      if (stored && SUPPORTED_LOCALES.includes(stored)) setLangState(stored);
    } catch { /* localStorage blocked */ }
  }, []);

  useEffect(() => {
    const dir = RTL_LOCALES.includes(lang) ? "rtl" : "ltr";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir",  dir);
  }, [lang]);

  useEffect(() => {
    if (isDashboard) {
      setT(getTranslationsSync(lang));
      setStatus("ready");
      return;
    }

    let cancelled = false;
    if (!hasLoadedOnce.current) setStatus("loading");

    getTranslations(lang)
      .then((result) => {
        if (cancelled) return;
        setT(result);
        setStatus("ready");
        hasLoadedOnce.current = true;
      })
      .catch(() => {
        if (cancelled) return;
        // A failed first load has nothing to show — surface the retry screen.
        // A failed switch after that just leaves the previous content on screen.
        if (!hasLoadedOnce.current) setStatus("error");
      });

    return () => { cancelled = true; };
  }, [lang, isDashboard, retryToken]);

  const setLang = useCallback((newLang) => {
    if (!SUPPORTED_LOCALES.includes(newLang)) return;
    try { localStorage.setItem("vs_lang", newLang); } catch { /* ignore */ }
    setLangState(newLang);
  }, []);

  const retry = useCallback(() => setRetryToken((k) => k + 1), []);

  const isRTL = RTL_LOCALES.includes(lang);
  const dir   = isRTL ? "rtl" : "ltr";

  if (!isDashboard && status === "loading") return <SiteLoading lang={lang} />;
  if (!isDashboard && status === "error")   return <SiteLoadError lang={lang} onRetry={retry} />;

  return (
    <LangContext.Provider value={{ lang, dir, isRTL, t, setLang, LOCALE_META }}>
      {children}
    </LangContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useTranslation must be inside <LangProvider>");
  return ctx;
}

export default LangContext;
