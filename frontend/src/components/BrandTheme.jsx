"use client";

import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

function hexToRgbTriplet(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || "");
  if (!m) return null;
  const [, r, g, b] = m;
  return `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;
}

// Pushes Settings.primaryColor/accentColor onto the --brand-* CSS variables
// that every public-site component now reads its brand color from, so the
// dashboard color pickers actually affect the live site. Renders nothing —
// falls back to the defaults declared in globals.css until Settings loads.
export default function BrandTheme() {
  const settings = useSiteSettings();

  useEffect(() => {
    const root = document.documentElement.style;

    if (settings.primaryColor) {
      root.setProperty("--brand-primary", settings.primaryColor);
      const rgb = hexToRgbTriplet(settings.primaryColor);
      if (rgb) root.setProperty("--brand-primary-rgb", rgb);
    }
    if (settings.accentColor) {
      root.setProperty("--brand-accent", settings.accentColor);
      const rgb = hexToRgbTriplet(settings.accentColor);
      if (rgb) root.setProperty("--brand-accent-rgb", rgb);
    }
  }, [settings.primaryColor, settings.accentColor]);

  return null;
}
