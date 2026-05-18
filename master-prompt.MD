# Unico Suites — Claude Code Master Prompt

> Paste this entire prompt into Claude Code at the start of the project. Provide the logo (`Unico_Suites___new_logo.png`), clean banner (`Banner_with_no_text_or_logo.png`), and branded banner (`Unico_Suites___main_banner.jpeg`) in the project root under `/assets/brand/`.

---

## System instruction

You are a world-class front-end engineer and UI/UX designer building a premium, award-winning website for a serviced accommodation management company. Your CSS and interaction design must be at the level of the best agency sites on Awwwards and CSS Design Awards — every line, every button, every animation should feel intentional, polished, and premium. This is not a template. This is a hand-crafted, bespoke website that must outclass every competitor in the space.

Zero errors. Zero TODOs. Zero placeholder text. Every file you produce must be production-ready, deployable, and flawless.

---

## Client context

```
Company:           Unico Suites Ltd
Company Reg:       16951086
Trading As:        Unico Suites
Address:           60 Bromham Road, Bedford, MK40 2QG
Phone:             01234 237990 (8x8 virtual landline)
WhatsApp:          07784 656416
Email:             hello@unicosuites.com
Domain:            unicosuites.com (primary) + unicosuites.co.uk (redirect)
Industry:          Serviced accommodation & short-stay property management
Target audience:   Landlords, property investors, busy property owners (primary)
                   Contractors, business travellers, families, relocation guests (secondary — booking guests)
Core problem:      Landlords want higher returns than traditional letting but don't have time to self-manage SA
Outcome:           Fully hands-off property management with higher income than AST letting
Founders:          Saad Aqeel (Co-Founder) — young, dynamic, lettings background, hands-on SA experience
                   Naz Islam (Co-Founder) — decades of experience, estate agency, commercial finance, property investor
Backed by:         Established estate and lettings businesses managing 1,000+ properties across Bedfordshire, Northamptonshire, Hertfordshire
Booking platform:  Guesty (free website for direct bookings — external link, NOT API integration)
Payments:          Stripe
```

### Social links
```
Facebook:   https://www.facebook.com/UnicoSuites/
Instagram:  https://www.instagram.com/unicosuites1/
LinkedIn:   https://www.linkedin.com/company/unico-suites/about/
```

### Competitor / inspiration sites (study these — then beat them)
```
Guesty paid sites:     pousadamgmt.com, voprentals.com, wakeupstays.com, lhimotel.com,
                       sequoiamotel.com, guestequity.com, sandiegoshorttermrentals.com, revelrynola.com
UK SA managers:        passthekeys.com/en, therightpropertygroup.co.uk/serviced-accommodation
Inspiration:           thepropertydon.co.uk/property-management, comfyworkers.com/en
Deal analyser ref:     thepropertydon.co.uk/deal-analyser
```

---

## Tech stack

```
Type:              Static site — custom HTML, CSS, JavaScript. NO frameworks, NO CMS.
Hosting:           Netlify (with _headers and _redirects files)
Repo:              GitHub — shared with client from day one
Build:             None required (pure static files) or optional Vite for minification/bundling
Domain:            unicosuites.com (Netlify custom domain)
SSL:               Netlify auto-provisioned Let's Encrypt
Analytics:         Google Analytics 4 (GA4) + Google Search Console
Cookie consent:    GDPR-compliant cookie banner (vanilla JS, no third-party dependency)
Forms:             Netlify Forms (contact form) or Formspree
```

---

## Brand design system

### Colours
```css
/* Primary */
--navy:            #0D2A48;    /* Primary brand — backgrounds, text, cards */
--navy-deep:       #081C33;    /* Footer, deep sections */
--navy-light:      #153A5E;    /* Hover states, lighter navy surfaces */
--navy-mid:        #204C74;    /* Accent blue for secondary elements */

/* Gold */
--gold:            #D4AF37;    /* PRIMARY ACCENT — buttons, lines, highlights, CTAs */
--gold-light:      #E8CC6E;    /* Hover states, secondary accents */
--gold-pale:       #F5EDD4;    /* Very light gold backgrounds */

/* Neutrals */
--white:           #FFFFFF;
--silver:          #F1F2F4;    /* Light section backgrounds */
--off-white:       #F8F6F2;    /* Warm light backgrounds */
--text:            #1A1A1A;    /* Body text on light backgrounds */
--text-light:      #5A5A5A;    /* Secondary body text */
```

### Typography
```css
/* Headings — Playfair Display (Google Fonts) */
font-family: 'Playfair Display', serif;
/* Use italic for emphasis words within headings (e.g. "Premium <em>Living</em>") */

/* Body — DM Sans (Google Fonts) */
font-family: 'DM Sans', sans-serif;

/* Scale */
h1: clamp(42px, 5.5vw, 72px)  — weight 500, line-height 1.12
h2: clamp(32px, 3.5vw, 48px)  — weight 500, line-height 1.2
h3: 20–24px                    — weight 500
Body: 16px                     — weight 300–400, line-height 1.75–1.8
Eyebrow: 10–11px              — weight 600, letter-spacing 3px, uppercase, gold colour
CTA buttons: 12–13px           — weight 600–700, letter-spacing 1–1.5px, uppercase
```

### Design principles — non-negotiable
```
1. WHITESPACE IS A FEATURE — generous padding (100–120px section padding), never crowded
2. GOLD LINE ACCENTS — animated shimmer lines, gold borders on hover, gold underlines
3. SCROLL-TRIGGERED REVEALS — elements fade up on scroll using IntersectionObserver (not a library)
4. MICRO-INTERACTIONS ON EVERYTHING — button hover lifts, card hover borders, nav link underlines
5. PARALLAX DEPTH — subtle parallax on hero stats, floating gold particles in hero
6. GLASS-MORPHISM NAV — sticky nav transitions from transparent to frosted navy on scroll
7. MOBILE-FIRST — every layout works beautifully at 375px before 1440px
8. SECTION RHYTHM — alternate light/dark sections to create visual breathing room
9. NO GENERIC DESIGN — this must look bespoke and premium, not like a Bootstrap template
10. EVERY ANIMATION RESPECTS prefers-reduced-motion
```

---

## Page structure — 8 pages

### 1. Homepage (index.html)
The most important page. Must communicate value in under 5 seconds above the fold.

**Sections in order:**
1. **Hero** — Full-viewport. Banner image as background with navy overlay. Floating gold particles. Eyebrow: "Serviced Accommodation & Property Management". H1: "Premium Short-Stay Living in *Bedford*" (Bedford in italic gold). Subtitle. Two CTAs: "Book a Stay →" (gold primary) + "For Landlords" (outline secondary). Right side: animated stats (1,000+ Properties Managed, 24/7 Guest Support, 98% Occupancy Rate). Scroll indicator at bottom.
2. **Trust bar** — Navy strip: "Listed on Airbnb & Booking.com" · "Dynamic Pricing Technology" · "Backed by 1,000+ Property Portfolio" · "Bedford & Surrounding Areas"
3. **About intro** — Two-column on silver background. Left: property image with gold border accent + experience badge overlay. Right: eyebrow + H2 "Expert Property Management, *Simplified*" + description + 4 benefit bullets with gold ✦ markers.
4. **Services** — White background, centered header. 6-card grid (3×2): Guest Communication, Dynamic Pricing, Airbnb & Booking.com Management, Cleaning & Linen Coordination, Maintenance & Inspections, Monthly Reporting. Each card: icon, title, description. Gold top-border slides in on hover. Cards lift on hover.
5. **How It Works** — Navy background. 4-step horizontal timeline: Free Property Review → Property Assessment → Listing & Setup → We Manage Everything. Numbered circles, gold connecting line, glow on hover.
6. **Why Choose Us (Comparison)** — Silver background. Two cards side by side: "Self-Management" (pain points with ✕ icons) vs "Unico Suites" (benefits with ✓ gold icons). Unico card is navy with "RECOMMENDED" ribbon.
7. **Meet the Founders** — White background. Two team cards: Saad Aqeel + Naz Islam. Photo placeholder circles with initials, name, role, bio text.
8. **Deal Analyser** — Navy-deep background with banner overlay. Split layout: left = pitch copy with benefit bullets explaining the analyser, right = embedded form card (Property Type, Bedrooms, Bathrooms, Location, Current Rent, Furnished). "Analyse My Deal →" button submits form data to deal-analyser.html via URL parameters.
9. **Property Gallery** — Silver/light background. Masonry-style image grid (3 cols, first item spans 2 rows). Hover reveals property label + zoom. Below: 4 badges (Hotel-Standard, Pro Photography, 5-Star Reviews, Bedford & Beyond).
10. **Final CTA** — Navy background with banner overlay. "Ready to Maximise Your Property's *Potential?*" + two CTAs + contact details (phone, email, website).
11. **Footer** — Navy-deep. 4-column grid: brand logo + description, page links (including Deal Analyser), landlord links, contact details + WhatsApp. Bottom bar: copyright + company reg + privacy/cookie links + social icons.

### 2. Deal Analyser (deal-analyser.html)
Standalone results page. Reads URL parameters from homepage form.

**Behaviour:**
- On page load: auto-populate form from URL params, auto-run calculation after 600ms delay
- Form also available on this page for re-running with different inputs
- Results animate in: summary cards → bar chart → breakdown table → uplift badge

**Calculation model (use these defaults until client confirms actual figures):**
```
Base nightly rates (Bedford):
  Studio: £65  |  1-bed: £80  |  2-bed: £100  |  3-bed: £130  |  4-bed: £160  |  5+: £190

Location multipliers:
  Bedford: 1.0  |  Kempston: 0.9  |  Milton Keynes: 1.15  |  Luton: 0.95  |  Northampton: 1.0

Property type multipliers:
  House: 1.1  |  Flat: 1.0  |  HMO: 0.85  |  Studio: 0.9

Occupancy: 70% (professionally managed target)
Average stay: 4.5 nights
Cleaning per turnover: £45 + (bedrooms × £15)
Platform fees: 3% of gross
Consumables: £40 + (bedrooms × £10)
Maintenance allowance: £50/month
Management fee: 18% of gross (TBC with client)
```

**Results display:**
- 3 summary metric cards: Traditional Letting | With Unico Suites (highlighted) | Additional Income
- Animated bar chart comparing traditional vs SA income
- Breakdown table: Gross Revenue → Operating Costs → Management Fee → Net to Owner (monthly + annual columns)
- Uplift percentage badge
- Disclaimer: "These figures are estimates only and are not guaranteed..."

### 3. About (about.html)
- Hero with H1 "About *Unico Suites*"
- Company story — backed by decades of experience, 1,000+ properties managed
- Mission statement
- Meet the Founders section (expanded bios for Saad and Naz from brochure content)
- Why Bedford section — local market knowledge, growth potential, Universal Studios UK development mention
- CTA section

### 4. How It Works (how-it-works.html)
- Expanded 4-step process with detailed descriptions per step
- What's included in management (full service list from brochure)
- Comparison table: Traditional AST vs HMO vs Self-Managed SA vs Unico Suites Managed
- Guaranteed rent option mention
- CTA: "Book Your Free Property Review"

### 5. FAQ (faq.html)
- Accordion-style FAQ (smooth open/close, vanilla JS)
- Minimum 12 questions targeting landlord objections:
  - What areas do you cover?
  - What management fee do you charge?
  - How do you handle cleaning and linen?
  - What platforms do you list on?
  - How do you set pricing?
  - What happens if there's property damage?
  - Do I need planning permission for SA?
  - What about council tax vs business rates?
  - How quickly can you get my property live?
  - Can I use my property myself sometimes?
  - What reports do I receive?
  - What if I want to terminate the agreement?
- FAQ schema (JSON-LD FAQPage) for every question — critical for AEO

### 6. Contact (contact.html)
- Split layout: left = what happens when you get in touch (steps), right = contact form (Netlify Forms)
- Form fields: Name, Email, Phone, Property Address, Number of Bedrooms, Message, Submit
- Below form: direct contact methods (phone with click-to-call via 8x8, WhatsApp link, email)
- Office address with embedded Google Map
- Social media links

### 7. Privacy Policy (privacy.html)
- Full GDPR-compliant privacy policy for Unico Suites Ltd
- Sections: Who we are, What data we collect, How we use it, Legal basis, Data sharing, Cookies, Your rights, Contact DPO
- Company reg number in footer

### 8. Cookie Notice (cookies.html)
- Cookie policy page explaining what cookies are used (GA4, essential cookies)
- Links to privacy policy
- How to manage cookies in browser settings

---

## SEO / AEO / GEO — implement from day one

### Technical SEO
```
1. sitemap.xml — list all 8 pages with lastmod dates
2. robots.txt — allow all crawlers including AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended)
3. llms.txt — company description, services, key pages, structured for AI consumption
4. Meta tags on EVERY page:
   - Unique <title> (under 60 chars, includes "Unico Suites" + page-specific keyword)
   - Unique <meta name="description"> (under 160 chars, compelling, includes primary keyword)
   - Canonical URL
   - Open Graph: og:title, og:description, og:image (banner), og:url, og:type
   - Twitter Card: twitter:card=summary_large_image, twitter:title, twitter:description, twitter:image
5. Semantic HTML throughout: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
6. All images: descriptive alt text, loading="lazy" (except above-fold), width/height attributes
7. Preload critical assets: fonts, hero banner image
8. <link rel="preconnect"> for Google Fonts
```

### JSON-LD structured data (in <head> of every page)
```
- Organization schema (name, url, logo, address, phone, social profiles)
- WebSite schema with SearchAction
- LocalBusiness schema (address, geo coordinates, opening hours, area served)
- Service schema for property management service
- FAQPage schema on FAQ page (every question/answer pair)
- BreadcrumbList schema on all inner pages
```

### Content SEO — primary keywords
```
Homepage:           "serviced accommodation management Bedford"
About:              "property management company Bedford"
How It Works:       "how serviced accommodation management works"
Deal Analyser:      "serviced accommodation ROI calculator"
FAQ:                "serviced accommodation FAQ landlords"
Contact:            "serviced accommodation Bedford contact"
```

### AEO (AI Engine Optimisation)
```
- Write FAQ answers as complete, citable sentences (not fragments)
- Include "Unico Suites" brand name naturally in answers
- Structure content so AI assistants can extract clean answers
- llms.txt file for AI crawler guidance
```

### GEO (Generative Engine Optimisation)
```
- Mention "Bedford" and surrounding areas naturally throughout content
- Include specific local references (Bedford town centre, Bromham Road, etc.)
- Reference local demand drivers (contractors, business travellers, NHS, corporate)
- Cite the Universal Studios UK development as future demand growth factor
```

---

## Performance requirements

```
- Lighthouse score: 95+ across all 4 categories (Performance, Accessibility, Best Practices, SEO)
- First Contentful Paint: under 1.5s
- Largest Contentful Paint: under 2.5s
- Cumulative Layout Shift: under 0.1
- All CSS minified and inlined for critical path
- All JS deferred or loaded at bottom
- Images: WebP format with JPEG fallback, responsive srcset where appropriate
- Fonts: font-display: swap, preloaded, subset if possible
- Netlify _headers file: Cache-Control, security headers (X-Content-Type-Options, X-Frame-Options, CSP, HSTS)
```

---

## Accessibility (WCAG 2.1 AA)

```
- Colour contrast ratios meet AA standard (4.5:1 for text, 3:1 for large text)
- All interactive elements keyboard-accessible with visible focus rings
- ARIA labels on all icons, buttons, and interactive elements
- Skip-to-content link
- Form labels properly associated with inputs
- Error states on form validation
- prefers-reduced-motion: all animations disabled
- Screen reader announcements for dynamic content (form results, accordion state)
```

---

## File structure

```
unicosuites.com/
├── index.html
├── about.html
├── how-it-works.html
├── deal-analyser.html
├── faq.html
├── contact.html
├── privacy.html
├── cookies.html
├── css/
│   ├── globals.css          (design tokens, resets, typography, utilities)
│   ├── components.css       (nav, footer, buttons, cards, forms, badges)
│   └── pages.css            (page-specific styles)
├── js/
│   ├── main.js              (nav scroll, reveal animations, smooth scroll)
│   ├── deal-analyser.js     (calculation logic, chart rendering, URL param handling)
│   ├── faq.js               (accordion logic)
│   ├── cookie-consent.js    (GDPR cookie banner)
│   └── form-validation.js   (contact form validation)
├── assets/
│   ├── brand/
│   │   ├── logo.png         (Unico Suites logo)
│   │   ├── banner.jpg       (clean banner — no text)
│   │   └── banner-branded.jpg (banner with text + logo)
│   ├── images/              (property photos, team photos — client to provide)
│   └── icons/               (favicon, apple-touch-icon, social share image)
├── sitemap.xml
├── robots.txt
├── llms.txt
├── _headers                 (Netlify headers — caching, security)
├── _redirects               (Netlify redirects — unicosuites.co.uk → unicosuites.com)
├── CLAUDE.md                (project documentation for Claude Code sessions)
└── README.md
```

---

## CLAUDE.md contents (create this first)

```markdown
# Unico Suites — Project Documentation

## Overview
Bespoke static website for Unico Suites Ltd — a serviced accommodation management company in Bedford, UK. Custom HTML/CSS/JS, hosted on Netlify.

## Brand
- Navy: #0D2A48 | Gold: #D4AF37 | Silver: #F1F2F4
- Fonts: Playfair Display (headings) + DM Sans (body)
- Design: Premium, luxury hospitality feel. Generous whitespace, gold accents, scroll animations.

## Conventions
- BEM naming for CSS classes
- Semantic HTML5 elements
- Vanilla JS only — no jQuery, no frameworks
- All measurements in rem/em (except borders)
- Mobile-first media queries
- Comments explaining non-obvious CSS/JS decisions

## Deployment
- Push to `main` → auto-deploys to Netlify
- Custom domain: unicosuites.com
- Redirect: unicosuites.co.uk → unicosuites.com (301)

## Key files
- CSS tokens in css/globals.css
- Calculation model in js/deal-analyser.js
- Cookie consent in js/cookie-consent.js
```

---

## Delivery instructions

1. **Start with CLAUDE.md** — create the project documentation file first
2. **Build the design system** — globals.css with all tokens, components.css with reusable elements
3. **Build the homepage first** — this sets the tone for everything. Get it pixel-perfect.
4. **Build the Deal Analyser** — the form-to-results flow must be seamless
5. **Build remaining pages** — About, How It Works, FAQ, Contact, Privacy, Cookies
6. **Implement SEO layer** — meta tags, JSON-LD, sitemap, robots.txt, llms.txt
7. **Performance pass** — minify, optimise images, add caching headers
8. **Accessibility audit** — WCAG 2.1 AA compliance check on every page
9. **Cross-browser test** — Chrome, Firefox, Safari, Edge, iOS Safari, Android Chrome
10. **Final review** — Lighthouse audit, fix anything below 95

**Commit after every working change.** Small, focused commits with conventional commit messages.

---

## What "award-winning CSS" means for this project

This is not hyperbole. The CSS must include:

- **Custom properties for everything** — colours, spacing, timing, all tokenised
- **Fluid typography** using clamp() — no breakpoint jumps
- **CSS Grid + Flexbox** — modern layouts, no floats, no hacks
- **Smooth scroll-triggered reveals** — IntersectionObserver, cubic-bezier easing
- **Gold shimmer animations** — subtle gradient sweeps on decorative lines
- **Hover state choreography** — cards lift + border appears + icon transforms, all in one transition
- **Glass-morphism navigation** — backdrop-filter blur with transparency transition
- **Parallax without libraries** — requestAnimationFrame for smooth depth effects
- **Animated gold particles** — CSS-only floating particles in the hero
- **Focus ring design** — visible but elegant, matches the gold accent
- **Loading states** — skeleton screens or fade-ins, never a flash of unstyled content
- **Print stylesheet** — clean print view for the Deal Analyser results

Every transition must use appropriate easing (ease-out for entrances, ease-in for exits). Every animation must respect `prefers-reduced-motion`. Every interaction must feel intentional and premium.