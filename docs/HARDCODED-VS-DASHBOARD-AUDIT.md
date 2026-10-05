# Hardcoded Info vs Dashboard — Wiring Audit

**Date:** 2026-10-05
**Scope:** `frontend/src` (public site, layout/SEO files) and `backend/src/config/email.js`.
**Question:** Which values are editable in the dashboard but the live site/emails ignore them (still hardcoded)?
**Method:** Static read-only review (grep + file reads). No code changed to produce this report. Nothing was built or run, so every finding is from reading code, not from observed behavior in a browser.

---

## 1. What the dashboard edits

| Dashboard area | Storage | Fields |
|---|---|---|
| Settings → Brand Identity | `Settings` doc | `brandName`, `primaryColor`, `accentColor` |
| Settings → Contact info | `Settings` doc | `email`, `phone`, `whatsapp`, `website`, `location` |
| Settings → Social links | `Settings.socialLinks` | `facebook`, `linkedin`, `instagram`, `whatsapp` |
| Settings → Logo images | `Settings` doc | `logoUrl`, `logoWhiteUrl` |
| Settings → Meta Pixel | `Settings.metaPixelId` | pixel ID |
| Settings → Email / Telegram / Admin account | `Settings.emailConfig`, `telegramConfig`, `Admin` | protected, backend-only |
| Section editors (16) | `Content` docs (EN + AR + images) | all page copy |

---

## 2. Settings fields: wired or not

| Settings field | Used by public site / emails? | Status |
|---|---|---|
| `primaryColor`, `accentColor` | `BrandTheme.jsx` → `--brand-*` CSS vars | WIRED |
| `logoUrl`, `logoWhiteUrl` | `Header.jsx`, `Footer.jsx` | WIRED |
| `metaPixelId` | `MetaPixel.jsx` | WIRED |
| `emailConfig`, `telegramConfig` | `config/email.js`, telegram notifier | WIRED |
| `socialLinks.*` | `Footer.jsx` | WIRED (fixed this session) |
| `email`, `phone` | `Footer.jsx` link targets only | PARTIAL — visible text still from Footer section content |
| `brandName` | nothing | **NOT WIRED** |
| `whatsapp` (number) | nothing | **NOT WIRED** |
| `website` | nothing | **NOT WIRED** |
| `location` | nothing | **NOT WIRED** |

---

## 3. Findings

Severity: **HIGH** = editing the dashboard field silently does nothing visible/important; **MEDIUM** = partially wired or duplicated source of truth; **LOW** = cosmetic or low-impact.

### 3.1 [HIGH] Contact section info cards ignore Settings
- **File:** `components/ContactSection.jsx` (~lines 260–277)
- Cards render `c.info[].value` and `c.info[].link` from the **Contact section** content (`contact.info` in `en.js`/`ar.js`/seed), e.g. `mailto:info@oneto-one.com`, `https://wa.me/201287636986`, `https://www.oneto-one.com`.
- `Settings.email`, `phone`, `whatsapp`, `website` are never read here. Changing them in Settings → Contact info has no effect on this section.
- **Why it matters:** two dashboard places hold the same data (Contact editor and Settings) and only the Contact editor counts. Easy to update one and leave the site wrong.

### 3.2 [HIGH] `Settings.location` is unused
- Footer location line comes from Footer section content (`contact_items[key=location]`, "All Egypt"). Nothing reads `Settings.location`.

### 3.3 [HIGH] `Settings.website` and `Settings.whatsapp` (number) are unused
- Website card link/value and WhatsApp card link are hardcoded in Contact section content (see 3.1). The Footer social WhatsApp icon uses `socialLinks.whatsapp`, not `Settings.whatsapp`, so the WhatsApp number field is dead on the public site.

### 3.4 [HIGH] `Settings.brandName` is unused everywhere
Hardcoded "One to One" appears in:
- `components/Header.jsx:93` and `components/Footer.jsx:82` — logo `alt="One to One Logo"`
- `app/layout.jsx` — `metadata` (title default, title template, `applicationName`, `authors`, `creator`, `publisher`, `openGraph.siteName`, `appleWebApp.title`, OG/Twitter titles and descriptions, keywords)
- `backend/src/config/email.js` lines ~74, 99, 104, 106, 127, 132, 134 — email header text, subjects and body ("Reset your One to One admin password", etc.)
- `app/manifest.json` — `name`/`short_name` are `"oneto-one"`

### 3.5 [MEDIUM] Footer link text vs link target can disagree
- `Footer.jsx` link targets now come from `Settings.email`/`phone`; the **visible** text still comes from the Footer section's `contact_items[].value`. Update one without the other and the footer shows one address and links to another.
- Same family as 3.1: Footer section content and Settings both hold the email/phone.

### 3.6 [MEDIUM] Site URL / domain hardcoded in SEO files
- `app/layout.jsx` `metadataBase`, `openGraph.url`, `authors[].url`; `app/robots.js` sitemap URL; `app/sitemap.js` `baseUrl` — all `https://oneto-one.com`.
- `Settings.website` is `www.oneto-one.com` (different host form) and is not used. A domain change needs code edits in four spots.

### 3.7 [MEDIUM] Page metadata is not CMS-driven or language-aware
- Title, description, keywords, OG/Twitter copy are English-only strings in `layout.jsx`. There is no dashboard field for SEO text. `<html lang="en" dir="ltr">` is fixed in the server component. (Known since the 2026-07 audit; still open.)

### 3.8 [LOW] Analytics ID hardcoded
- `components/GoogleAnalytics.jsx`: `GA_ID = "G-6X3LNF0PVC"`. Meta Pixel is dashboard-configurable; Google Analytics is not. Changing the GA property needs a code change and redeploy.

### 3.9 [LOW] Email templates: brand name and colors hardcoded
- `backend/src/config/email.js` hardcodes `#037338` / `#96C422` and "One to One" text. Brand colors cannot use CSS vars in email, but both color and brand name could be read from `Settings` at send time. (Colors already documented in CLAUDE.md Known Gaps.)

### 3.10 [LOW] Fallback logo paths are static files
- `/images/logo.png`, `/images/logo-white.png` used when `Settings.logoUrl`/`logoWhiteUrl` are empty. Acceptable as a fallback; listed so a rebrand knows to replace those files too.

### 3.11 [LOW] A few UI strings bypass `useTranslation()`
Public-facing English-only strings (violates the "all public text via `useTranslation()`" rule):
- `components/ContactSection.jsx:64` — "Please enter a valid email address."
- `components/SiteLoadError.jsx:7` — `retry: "Retry"` (this component has its own small bilingual dictionary, so it may be intentional)
- `app/error.jsx` — "Something went wrong" and the fallback error text
- English fallbacks that shadow missing content keys: `MarketSection.jsx:134` ("View More"), `ServicesSection.jsx:121`, `app/market/page.jsx:46`, `app/values/page.jsx:52` ("Back to home") — these only show if the locale/CMS key is absent, so they are low risk.

### 3.12 [INFO] Dead components with stale hardcoded content (not rendered)
- `components/GeneticSupplyChainSection.jsx` — hardcoded Unsplash URLs and old copy.
- `components/WarrantySection.jsx` — hardcoded "Warranty" / "Blockchain verified and transparent".
- Neither is mounted in `page.jsx`; safe to delete.

---

## 4. Already correctly wired (no action)

Brand colors, header/footer logos, Meta Pixel, footer social links, footer email/phone link targets, outbound email and Telegram config, all 16 section texts and images (via `Content` docs + `_images`), logo-marquee partner/client logos.

---

## 5. Recommended fixes (not yet applied)

Ordered by value for effort. Each is a small, isolated change.

1. **Single source of truth for contact info.** Make `ContactSection` info cards and the Footer contact items read `Settings.email/phone/whatsapp/website/location`, using the section content only as a fallback (same pattern used for the Footer link targets). Covers 3.1, 3.2, 3.3, 3.5. Alternative: remove the duplicate Settings fields and keep only the section editors, but then the Settings page promises something it can't deliver.
2. **Use `brandName`** for logo `alt` text in `Header`/`Footer` (3.4, quick win).
3. **Email templates** read `brandName` (and optionally colors) from `Settings` at send time (3.4, 3.9).
4. **Derive the site URL** in one place (env var, e.g. `NEXT_PUBLIC_SITE_URL`) and use it in `layout.jsx`, `robots.js`, `sitemap.js` (3.6). Needs approval for a new env var, not a package.
5. **Dashboard fields for SEO** (title/description/OG per language) and a GA ID field next to Meta Pixel (3.7, 3.8). Larger change; lower priority.
6. **Delete dead components** `WarrantySection.jsx`, `GeneticSupplyChainSection.jsx`, and the stale `.tmp` files (3.12).
7. Move the remaining English UI strings into locale files (3.11).

---

## 6. Caveats

- Findings are from static reading. For 3.1–3.3, confirm in the browser by changing the Settings email/phone, saving, reloading, and checking the Contact section and Footer.
- `manifest.json` references `web-app-manifest-*.png` which exist in `public/`; the manifest `theme_color` is `#ffffff`, not the brand color (not a wiring issue).
- Section-editor fields were not individually diffed against every component prop in this pass. A deeper check (each dashboard field → rendered output) would be a follow-up if wanted.
