"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_ID = "G-GX3LNF0PVC";

// Idempotent gtag bootstrap. Called from both the effect below and the inline
// <Script>, so whichever runs first sets things up and the 'js'/'config'
// commands always land in dataLayer before any queued event. gtag.js replays
// the queue once it loads, and only recognises `arguments` objects (not arrays).
function initGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  if (window.__gaInitialised) return;
  window.__gaInitialised = true;
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

function GoogleAnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This can run on hydration before the afterInteractive scripts execute,
    // so bootstrap here instead of bailing out when window.gtag is missing.
    initGtag();

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("event", "page_view", {
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
          if (!window.__gaInitialised) {
            window.__gaInitialised = true;
            window.gtag('js', new Date());
            window.gtag('config', '${GA_ID}', { send_page_view: false });
          }
        `}
      </Script>

      <Suspense fallback={null}>
        <GoogleAnalyticsPageViews />
      </Suspense>
    </>
  );
}
