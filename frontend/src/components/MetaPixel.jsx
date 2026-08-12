"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// ─── trackEvent ────────────────────────────────────────────────────────────────
// Safe wrapper around window.fbq. Call this anywhere after the pixel has been
// initialised — it no-ops gracefully if the pixel isn't loaded yet.
//
// Usage:
//   import { trackEvent } from "@/components/MetaPixel";
//   trackEvent("Lead", { content_name: "Contact Form" });
//   trackEvent("PageView");
export function trackEvent(eventName, params = {}) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", eventName, params);
}

// ─── MetaPixel ─────────────────────────────────────────────────────────────────
// Drop this once inside your layout or root page. It:
//   1. Reads metaPixelId from the Settings document (via useSiteSettings cache).
//   2. Injects the Facebook Pixel base code into <head> exactly once.
//   3. Fires a PageView event on mount.
//
// If metaPixelId is empty (not configured in dashboard) the component is a no-op.
export default function MetaPixel() {
  const { metaPixelId } = useSiteSettings();

  useEffect(() => {
    if (!metaPixelId) return;
    // Guard — don't double-initialise if the pixel is already on the page
    // (e.g. React StrictMode double-invocation in dev).
    if (window._fbqInitialised) {
      window.fbq("track", "PageView");
      return;
    }

    // ── Inject the base pixel script ──────────────────────────────────────────
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod
        ? n.callMethod.apply(n,arguments)
        : n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version="2.0";
      n.queue=[];
      t=b.createElement(e);t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    window.fbq("init", metaPixelId);
    window.fbq("track", "PageView");
    window._fbqInitialised = true;

    // ── <noscript> fallback image for browsers with JS disabled ───────────────
    if (!document.getElementById("fb-pixel-noscript")) {
      const noscript = document.createElement("noscript");
      noscript.id = "fb-pixel-noscript";
      const img = document.createElement("img");
      img.height = 1;
      img.width  = 1;
      img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.body.insertBefore(noscript, document.body.firstChild);
    }
  }, [metaPixelId]);

  return null;
}
