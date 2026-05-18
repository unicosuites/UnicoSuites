# Unico Suites — Project Documentation

## Overview
Bespoke static website for **Unico Suites Ltd** — a serviced accommodation management company in Bedford, UK. Custom HTML / CSS / vanilla JS, hosted on Netlify. Designed to outclass every UK SA-management competitor in the space (Pass the Keys, The Right Property Group, Comfy Workers, etc.) on premium feel.

## Brand
| Token | Value | Purpose |
|---|---|---|
| `--navy` | `#0D2A48` | Primary brand, dark surfaces |
| `--navy-deep` | `#081C33` | Footer, deepest sections |
| `--navy-light` | `#153A5E` | Hover, secondary navy |
| `--navy-mid` | `#204C74` | Decorative blue accents |
| `--gold` | `#D4AF37` | Primary accent — buttons, hairlines, highlights |
| `--gold-light` | `#E8CC6E` | Gold hover state |
| `--gold-pale` | `#F5EDD4` | Tinted backgrounds |
| `--silver` | `#F1F2F4` | Light section background |
| `--off-white` | `#F8F6F2` | Warm light background |

**Fonts:** Playfair Display (headings, italic for emphasis word) + DM Sans (body, 300/400/500/600/700).

## Design principles (non-negotiable)
1. Whitespace is a feature — 100–120 px section padding.
2. Gold lines, gold underlines, gold shimmer.
3. Scroll-triggered reveals via IntersectionObserver (no library).
4. Micro-interactions on every interactive surface.
5. Glass-morphism nav: transparent → frosted navy on scroll.
6. Mobile-first; every layout works at 375 px.
7. `prefers-reduced-motion` disables every animation.

## Conventions
- **BEM-ish** class naming (`.block__element--modifier`) where it helps; utility-first when not.
- Semantic HTML5 throughout.
- Vanilla JS only. No jQuery, no frameworks, no build step.
- CSS custom properties for every token (colour, space, timing, radius).
- Fluid type via `clamp()`.
- Mobile-first media queries (`min-width` only).
- All measurements in `rem`/`em` except `1px` borders.
- Comment **why**, never what.

## File map
```
site/
├── index.html               · home
├── about.html               · about + founders
├── how-it-works.html        · process + comparison table
├── deal-analyser.html       · ROI calculator results
├── faq.html                 · 12+ FAQs with FAQPage JSON-LD
├── contact.html             · Netlify Forms contact
├── privacy.html             · GDPR policy
├── cookies.html             · cookie policy
├── 404.html                 · branded 404
├── css/
│   ├── globals.css          · tokens, reset, type, utilities
│   ├── components.css       · nav, footer, btn, card, form, badge, accordion
│   └── pages.css            · per-page layouts
├── js/
│   ├── main.js              · nav scroll, reveal, smooth scroll, parallax
│   ├── deal-analyser.js     · calculation model + chart
│   ├── faq.js               · accordion
│   ├── cookie-consent.js    · GDPR banner
│   └── form-validation.js   · contact form
├── assets/
│   ├── brand/               · logo, banners, og image
│   ├── images/              · property photos (responsive WebP + JPEG)
│   ├── team/                · founder portraits (cut-out + circular)
│   └── icons/               · favicon set
├── sitemap.xml
├── robots.txt
├── llms.txt
├── _headers                 · Netlify caching + security headers
├── _redirects               · netlify redirects (incl. co.uk → .com 301)
└── README.md
```

## Deal Analyser calculation model
Defaults in `js/deal-analyser.js` (function `calculateDeal`). Update `RATES`, `LOCATION_MULTIPLIERS`, `TYPE_MULTIPLIERS`, `OCCUPANCY`, `MGMT_FEE` once client confirms real numbers. Calculator reads URL params (set by homepage form) and auto-runs after 600 ms.

## SEO / AEO / GEO
- Every page has unique `<title>`, `<meta description>`, canonical, OG + Twitter cards.
- JSON-LD: `Organization`, `WebSite`, `LocalBusiness` on every page. `FAQPage` on FAQ. `BreadcrumbList` on inner pages.
- `llms.txt` for AI crawler guidance.
- `robots.txt` allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended.
- Keywords by page documented in master-prompt.MD.

## Deployment
- Push to GitHub `main` → auto-deploys to Netlify.
- Primary domain: **unicosuites.com**.
- Secondary: **unicosuites.co.uk** → 301 → unicosuites.com (handled in `_redirects`).
- SSL: Netlify-provisioned Let's Encrypt.
- Forms: Netlify Forms (contact form uses `data-netlify="true"`).

## Local preview
No build step. From `site/`:
```bash
python3 -m http.server 8080
# → open http://localhost:8080
```

## Image pipeline
`scripts/process_images.py` rebuilds `site/assets/` from `public/` (rembg + Pillow). Re-run after replacing source files.
