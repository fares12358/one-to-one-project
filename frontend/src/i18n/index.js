import en from "./locales/en.js";
import ar from "./locales/ar.js";

export const SUPPORTED_LOCALES = ["en", "ar"];
export const DEFAULT_LOCALE    = "en";
export const RTL_LOCALES        = ["ar"];

export const LOCALE_META = {
  en: { label: "EN", nativeLabel: "English",  flag: "🇬🇧" },
  ar: { label: "ع",  nativeLabel: "العربية", flag: "🇪🇬" },
};

// Local fallback objects — always available synchronously
const LOCAL = { en, ar };

// In-memory cache — avoids re-fetching the same language in the same session.
// Busted by invalidateTranslationCache() after a CMS save so the next visit
// picks up fresh content without reloading the page.
const _cache = new Map();

export function invalidateTranslationCache(lang) {
  if (lang) _cache.delete(lang);
  else _cache.clear();
}

/**
 * getTranslationsSync — immediate local fallback (no API call).
 * Used by LangContext for the initial synchronous render to prevent content flash.
 */
export function getTranslationsSync(lang) {
  return LOCAL[lang] ?? LOCAL[DEFAULT_LOCALE];
}

/**
 * getTranslations — async, fetches live content from the backend API.
 * Throws on any failure (no API URL configured, network error, non-2xx response)
 * so the caller (LangContext) can show a "server is down" retry state instead of
 * silently rendering stale local content as if it were live.
 * Includes doc.images as _images so components can render the uploaded images.
 *
 * CRITICAL FIX (Sprint 003): Previously only mapped doc[lang] (text).
 * Now also maps doc.images → _images so uploaded images appear on the site.
 */
export async function getTranslations(lang = DEFAULT_LOCALE) {
  // Return cached result if available
  if (_cache.has(lang)) return _cache.get(lang);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL is not configured");

  const res = await fetch(`${apiUrl}/content`, {
    next: { revalidate: 60 },  // ISR: revalidate every 60s, serve stale while updating
  });

  if (!res.ok) throw new Error(`API responded with ${res.status}`);

  const { data } = await res.json();

  // Build translation object: text content + images for each section
  const content = {};
  data.forEach((doc) => {
    content[doc.section] = {
      ...(doc[lang] || doc.en),  // text content for the requested language
      _images: doc.images || [], // uploaded images array for this section
    };
  });

  // Merge onto local shape so any section missing from the API response still
  // has the right keys present — API data takes priority where it exists.
  const result = { ...getTranslationsSync(lang), ...content };

  _cache.set(lang, result);
  return result;
}

export default getTranslations;
