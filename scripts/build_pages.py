#!/usr/bin/env python3
"""Page assembler — splices shared nav/footer/head into per-page body templates.

Authored bodies live in scripts/page_bodies/<slug>.html. Each body is a snippet
that goes BETWEEN the <main>...</main> tags (no <head>, no <nav>, no <footer>).
Each body also has a tiny YAML-ish frontmatter for per-page meta.

Output: site/<slug>.html
"""
from __future__ import annotations
import re
from pathlib import Path

ROOT      = Path("/Users/aliamin/Productions/UnicoSuites")
SITE      = ROOT / "site"
BODIES    = ROOT / "scripts" / "page_bodies"
OUT_DIR   = SITE

# ----- frontmatter parser (no PyYAML dependency) -----
FM_RE = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)

def parse_frontmatter(text: str) -> tuple[dict, str]:
    m = FM_RE.match(text)
    if not m:
        raise SystemExit(f"Missing frontmatter in body file")
    meta_block, body = m.group(1), m.group(2)
    meta: dict = {}
    for line in meta_block.split("\n"):
        if not line.strip(): continue
        if ":" not in line: continue
        k, _, v = line.partition(":")
        v = v.strip()
        if v.startswith('"') and v.endswith('"'): v = v[1:-1]
        meta[k.strip()] = v
    return meta, body

# ----- shared snippets -----
HEAD_TMPL = """<!doctype html>
<html lang="en-GB" class="{body_class}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0D2A48">
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="canonical" href="{canonical}">

  <meta property="og:type" content="website">
  <meta property="og:url" content="{canonical}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{description}">
  <meta property="og:image" content="https://unicosuites.com/assets/brand/og-image.jpg">
  <meta property="og:locale" content="en_GB">
  <meta property="og:site_name" content="Unico Suites">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{title}">
  <meta name="twitter:description" content="{description}">
  <meta name="twitter:image" content="https://unicosuites.com/assets/brand/og-image.jpg">

  <link rel="icon" href="assets/icons/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32.png">
  <link rel="icon" type="image/png" sizes="192x192" href="assets/icons/favicon-192.png">
  <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/favicon-180.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/globals.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/pages.css">

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@graph": [
      {{
        "@type": "Organization",
        "@id": "https://unicosuites.com/#organization",
        "name": "Unico Suites",
        "legalName": "Unico Suites Ltd",
        "url": "https://unicosuites.com/",
        "logo": "https://unicosuites.com/assets/brand/logo.png",
        "telephone": "+44-1234-237990",
        "email": "hello@unicosuites.com",
        "address": {{
          "@type": "PostalAddress",
          "streetAddress": "6 Bridge Street",
          "addressLocality": "Northampton",
          "postalCode": "NN1 1NW",
          "addressCountry": "GB"
        }},
        "sameAs": [
          "https://www.facebook.com/UnicoSuites/",
          "https://www.instagram.com/unicosuites/",
          "https://www.linkedin.com/company/unico-suites/"
        ]
      }},
      {{
        "@type": "LocalBusiness",
        "@id": "https://unicosuites.com/#localbusiness",
        "name": "Unico Suites",
        "image": "https://unicosuites.com/assets/brand/og-image.jpg",
        "url": "https://unicosuites.com/",
        "telephone": "+44-1234-237990",
        "address": {{
          "@type": "PostalAddress",
          "streetAddress": "60B Bromham Road",
          "addressLocality": "Bedford",
          "postalCode": "MK40 2QG",
          "addressCountry": "GB"
        }},
        "geo": {{ "@type": "GeoCoordinates", "latitude": "52.1396", "longitude": "-0.4737" }},
        "areaServed": ["Bedford", "Kempston", "Milton Keynes", "Luton", "Northampton", "Cambridge"]
      }}{extra_jsonld}
    ]
  }}
  </script>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>
"""

NAV_HTML = """
<header class="nav" role="banner">
  <div class="nav__inner">
    <a href="index.html" class="nav__brand" aria-label="Unico Suites Serviced Accommodation — home">
      <span class="nav__brand-mark"><img src="assets/brand/logo.png" alt="" width="36" height="36"></span>
      <span class="nav__brand-text">
        <span class="nav__brand-name">Unico Suites</span>
        <span class="nav__brand-sub">Serviced Accommodation</span>
      </span>
    </a>
    <nav aria-label="Primary">
      <ul class="nav__links">
        <li><a class="nav__link" href="about.html">About</a></li>
        <li><a class="nav__link" href="how-it-works.html">How it works</a></li>
        <li><a class="nav__link" href="deal-analyser.html">Deal analyser</a></li>
        <li><a class="nav__link" href="faq.html">FAQ</a></li>
        <li><a class="nav__link" href="contact.html">Contact</a></li>
      </ul>
    </nav>
    <span class="nav__cta-shift">
      <!-- TODO: swap href to the Guesty direct-booking URL once provided; falls back to the contact form for now -->
      <a href="contact.html" class="btn btn--sm nav__cta" data-book-link>Book a stay<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></a>
    </span>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-drawer" aria-label="Open menu">
      <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M6 18 18 6"/></svg>
    </button>
  </div>
</header>

<div id="nav-drawer" class="nav__drawer is-dark" aria-hidden="true">
  <a class="nav__link" href="about.html">About</a>
  <a class="nav__link" href="how-it-works.html">How it works</a>
  <a class="nav__link" href="deal-analyser.html">Deal analyser</a>
  <a class="nav__link" href="faq.html">FAQ</a>
  <a class="nav__link" href="contact.html">Contact</a>
  <a class="btn nav__drawer-cta" href="contact.html" data-book-link>Book a stay</a>
  <div class="nav__drawer-meta">
    <span>01234 237990</span>
    <a href="mailto:hello@unicosuites.com">hello@unicosuites.com</a>
  </div>
</div>

<main id="main">
"""

FOOTER_HTML = """
</main>

<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__col">
        <a class="footer__brand" href="index.html">
          <img src="assets/brand/logo.png" alt="Unico Suites logo" width="48" height="48">
          <span style="font-family:'Playfair Display',serif;font-size:1.25rem;color:white">Unico Suites</span>
        </a>
        <p class="footer__desc">Premium serviced accommodation management in Bedford and the surrounding region. Backed by a 1,000+ property group.</p>
      </div>
      <div class="footer__col">
        <h2>Explore</h2>
        <ul class="footer__list">
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="how-it-works.html">How it works</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h2>For landlords</h2>
        <ul class="footer__list">
          <li><a href="deal-analyser.html">Deal analyser</a></li>
          <li><a href="how-it-works.html#service-list">What's included</a></li>
          <li><a href="contact.html">Book a review</a></li>
          <li><a href="faq.html">Landlord FAQs</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h2>Contact</h2>
        <address class="footer__contact">
          60B Bromham Road<br>
          Bedford, MK40 2QG<br>
          <a href="tel:+441234237990">01234 237990</a><br>
          <a href="mailto:hello@unicosuites.com">hello@unicosuites.com</a>
        </address>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© <span data-current-year>2026</span> Unico Suites Ltd · Company Reg 16951086</span>
      <ul class="footer__legal">
        <li><a href="privacy.html">Privacy</a></li>
        <li><a href="cookies.html">Cookies</a></li>
      </ul>
      <ul class="footer__social" aria-label="Social links">
        <li><a href="https://www.facebook.com/UnicoSuites/" aria-label="Facebook" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.93z"/></svg></a></li>
        <li><a href="https://www.instagram.com/unicosuites/" aria-label="Instagram" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a></li>
        <li><a href="https://www.linkedin.com/company/unico-suites/" aria-label="LinkedIn" rel="noopener" target="_blank"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8h4.6v14H.2V8zm7.4 0h4.4v1.93h.07c.61-1.16 2.1-2.38 4.32-2.38C20.97 7.55 22 10 22 13.5V22h-4.6v-7.55c0-1.8-.03-4.12-2.51-4.12-2.52 0-2.9 1.97-2.9 4v7.67H7.6V8z"/></svg></a></li>
      </ul>
    </div>
  </div>
</footer>

<div id="cookie-banner" class="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
  <p class="cookie-banner__text">
    We use essential cookies to make this site work, and analytics cookies to understand how visitors use it. See our <a href="cookies.html">cookie policy</a>.
  </p>
  <div class="cookie-banner__actions">
    <button type="button" class="btn btn--sm btn--ghost-light" data-cookie-decline>Decline</button>
    <button type="button" class="btn btn--sm" data-cookie-accept>Accept all</button>
  </div>
</div>

<script src="js/main.js" defer></script>
<script src="js/cookie-consent.js" defer></script>
{extra_scripts}
</body>
</html>
"""

# Optional per-page extra JSON-LD blocks (BreadcrumbList, FAQPage, etc.)
def breadcrumb_jsonld(slug: str, title: str) -> str:
    return f""",
      {{
        "@type": "BreadcrumbList",
        "itemListElement": [
          {{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://unicosuites.com/" }},
          {{ "@type": "ListItem", "position": 2, "name": "{title}", "item": "https://unicosuites.com/{slug}" }}
        ]
      }}"""

def build(slug: str):
    src = BODIES / f"{slug}.html"
    if not src.exists():
        print(f"  skip (no body): {slug}")
        return
    meta, body = parse_frontmatter(src.read_text())
    title       = meta.get("title", "Unico Suites")
    description = meta.get("description", "Premium serviced accommodation management in Bedford.")
    out_slug    = meta.get("slug", slug + ".html")
    canonical   = f"https://unicosuites.com/{out_slug if out_slug != 'index.html' else ''}"
    extra_scripts = meta.get("extra_scripts", "")

    extra_jsonld = ""
    if out_slug != "index.html":
        page_title = meta.get("breadcrumb", title.split("—")[0].strip())
        extra_jsonld += breadcrumb_jsonld(out_slug, page_title)
    if "extra_jsonld" in meta:
        extra_jsonld += meta["extra_jsonld"]
    # Special: FAQPage schema for FAQ page is generated inline by the body.
    if "<!-- FAQPAGE_JSONLD -->" in body:
        # The FAQ body inserts its own <script> tag; nothing to add to head.
        pass

    body_class = meta.get("body_class", "")
    head = HEAD_TMPL.format(
        title=title, description=description, canonical=canonical,
        extra_jsonld=extra_jsonld, body_class=body_class,
    )
    foot = FOOTER_HTML.format(extra_scripts=extra_scripts)

    out_path = OUT_DIR / out_slug
    out_path.write_text(head + NAV_HTML + body + foot)
    print(f"  ✔ {out_slug}  ({out_path.stat().st_size//1024} KB)")

PAGES = [
    "about",
    "how-it-works",
    "deal-analyser",
    "faq",
    "contact",
    "contact-success",
    "privacy",
    "cookies",
    "404",
]

def main():
    print("Building pages...")
    for slug in PAGES:
        build(slug)
    print("Done.")

if __name__ == "__main__":
    main()
