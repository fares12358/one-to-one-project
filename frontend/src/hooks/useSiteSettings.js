"use client";

import { useState, useEffect } from "react";
import api from "@/services/api";

// Module-level cache so Header + Footer share one request instead of two.
let _cache = null;
let _pending = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(_cache);

  useEffect(() => {
    if (_cache) return;
    if (!_pending) {
      _pending = api.get("/settings")
        .then(({ data }) => (_cache = data.data || {}))
        .catch(() => (_cache = {}));
    }
    _pending.then(setSettings);
  }, []);

  return settings || {};
}

// Resolves one contact item (email | phone | whatsapp | website | location) for
// display. Value and link come from the dashboard Settings when that field is
// filled in, otherwise from the section content item (`item.value`/`item.link`).
export function resolveContactInfo(item, settings = {}) {
  const clean = (v) => (typeof v === "string" ? v.trim() : "");
  const fallbackValue = clean(item.value);
  const fallbackLink = clean(item.link) || null;
  const digits = (v) => v.replace(/[^\d+]/g, "");

  switch (item.key) {
    case "email": {
      const value = clean(settings.email) || fallbackValue;
      return { value, link: clean(settings.email) ? `mailto:${value}` : fallbackLink };
    }
    case "phone": {
      const value = clean(settings.phone) || fallbackValue;
      const link = clean(settings.phone) ? `tel:${digits(value)}` : fallbackLink;
      return { value, link };
    }
    case "whatsapp": {
      const value = clean(settings.whatsapp) || fallbackValue;
      const num = digits(clean(settings.whatsapp)).replace(/^\+/, "");
      return { value, link: num ? `https://wa.me/${num}` : fallbackLink };
    }
    case "website": {
      const value = clean(settings.website) || fallbackValue;
      const link = clean(settings.website)
        ? (/^https?:\/\//i.test(value) ? value : `https://${value}`)
        : fallbackLink;
      return { value, link };
    }
    case "location":
      return { value: clean(settings.location) || fallbackValue, link: null };
    default:
      return { value: fallbackValue, link: fallbackLink };
  }
}
