# Unico Suites — SEO Keyword Strategy

**Prepared for:** Unico Suites Ltd
**Scope:** SEO Foundation deliverable — keyword research, on-page mapping, ranking targets
**Status:** Implemented across the live site as of launch.

---

## 1. Search intent we target

| Intent | Who is searching | Where we appear |
|---|---|---|
| **Landlord seeking SA management** *(primary revenue audience)* | Landlords and property investors in Bedford and surrounding counties looking for someone to manage their property as serviced accommodation instead of AST letting | Home, How It Works, Deal Analyser, About, FAQ |
| **Landlord weighing SA vs traditional letting** | Landlords who own a long-let property and are curious about higher income | Deal Analyser, How It Works comparison |
| **Booking guest looking for a stay** *(secondary audience)* | Contractors, business travellers, relocation guests, families | Booking handled off-site via Guesty — site links out |
| **Generic SEO / AEO discovery** | Search engines and AI answer engines indexing the brand | All pages, `llms.txt`, `robots.txt` (AI crawler allow-list) |

---

## 2. Primary keyword targets

These are the head terms we want to rank for in the local and national serviced-accommodation management market.

| Rank tier | Keyword | Monthly search volume *(UK, approx.)* | Difficulty | Primary landing page |
|---|---|---|---|---|
| **A** | serviced accommodation management Bedford | Low/local, high-intent | Low–Medium | Home (`/`) |
| **A** | serviced accommodation Bedford | Low/local, mixed-intent | Low | Home (`/`) |
| **A** | short-stay property management Bedford | Low/local, high-intent | Low | Home (`/`) |
| **B** | property management Bedfordshire | Local, mixed-intent | Medium | How It Works |
| **B** | Airbnb management Bedford | Local, high-intent | Low–Medium | Home, How It Works |
| **B** | landlord serviced accommodation Bedford | Local, high-intent | Low | Deal Analyser |
| **C** | guaranteed rent Bedford | Local, high-intent | Low | How It Works (Guaranteed Rent option card) |
| **C** | short-let management Bedford / Bedfordshire | Local, high-intent | Low | How It Works |

**Rationale:** the client's edge is locality + scale (backed by an estate-agency group managing 1,000+ properties across Bedfordshire, Northamptonshire, Hertfordshire, Cambridgeshire). We lead with "Bedford" — the home market — and expand outward via supporting content.

---

## 3. Long-tail keywords (Tier B/C support)

Long-tail terms have lower search volume but higher conversion intent. They are reflected in copy, headings and FAQ answers.

- *"how much can I make from serviced accommodation in Bedford"* → Deal Analyser
- *"is serviced accommodation worth it for landlords"* → FAQ + How It Works
- *"do I need planning permission for short let"* → FAQ
- *"council tax serviced accommodation"* → FAQ
- *"smart lock serviced accommodation"* → intentionally not used (client preference)
- *"serviced accommodation management fees"* → FAQ + How It Works (18% + VAT)
- *"hands-off property management Bedford"* → Home, About
- *"property management for landlords Bedfordshire"* → How It Works, About
- *"who manages my Airbnb in Bedford"* → Home, How It Works
- *"Bedford property short let vs long let"* → Deal Analyser

---

## 4. Per-page keyword mapping

This is how the site's titles, descriptions and copy implement the strategy above.

### `/` (Home)
| Element | Content |
|---|---|
| Title | *Unico Suites — Serviced Accommodation Management in Bedford* |
| Meta description | Premium serviced accommodation management in Bedford. We list, price, clean and manage your property for higher returns than traditional letting. Backed by 1,000+ properties. |
| Primary keyword | serviced accommodation management Bedford |
| Secondary | short-stay property management Bedford, Airbnb management Bedford |
| Schema | Organization, WebSite, LocalBusiness, Service, SearchAction |

### `/about.html`
| Element | Content |
|---|---|
| Title | *About Unico Suites — Serviced Accommodation Management Bedford* |
| Meta description | Meet the founders behind Unico Suites — backed by an established estate-agency and lettings group managing 1,000+ properties across Bedfordshire, Northamptonshire, Hertfordshire and Cambridgeshire. |
| Primary keyword | serviced accommodation Bedford founders |
| Secondary | local property expertise, Saad Aqeel, Naz Islam |
| Schema | Organization, LocalBusiness, BreadcrumbList |

### `/how-it-works.html`
| Element | Content |
|---|---|
| Title | *How It Works — Unico Suites Serviced Accommodation Management* |
| Meta description | From free property review to first booking in days. See the full Unico Suites process — what's included, what you'll receive, and how we compare to AST and self-managed serviced accommodation. |
| Primary keyword | serviced accommodation management process |
| Secondary | guaranteed rent Bedford, 18% management fee, short-let comparison |
| Schema | Organization, LocalBusiness, BreadcrumbList |

### `/deal-analyser.html`
| Element | Content |
|---|---|
| Title | *Deal Analyser — Serviced Accommodation ROI Calculator \| Unico Suites* |
| Meta description | Free serviced accommodation ROI calculator. See your property's projected SA income vs. traditional letting — monthly and annual breakdown, no contact details required. |
| Primary keyword | serviced accommodation ROI calculator |
| Secondary | how much can I earn serviced accommodation Bedford, SA vs AST |
| Schema | Organization, LocalBusiness, BreadcrumbList |

### `/faq.html`
| Element | Content |
|---|---|
| Title | *FAQ — Serviced Accommodation Questions for Landlords \| Unico Suites* |
| Meta description | Common questions from landlords about serviced accommodation, management fees, cleaning, platforms, pricing, council tax, planning permission, and how the Unico Suites service works. |
| Primary keyword | landlord serviced accommodation questions |
| Secondary | planning permission short let, council tax SA, management fees |
| Schema | FAQPage, Organization, LocalBusiness, BreadcrumbList |

### `/contact.html`
| Element | Content |
|---|---|
| Title | *Contact Unico Suites — Bedford Serviced Accommodation Management* |
| Meta description | Book a free property review or ask us anything about serviced accommodation management in Bedford. Phone, email or use the contact form — we reply same-day. |
| Primary keyword | contact serviced accommodation management Bedford |
| Schema | Organization, LocalBusiness, BreadcrumbList |

---

## 5. Competitor positioning

The client's named competitors and how our copy differentiates.

| Competitor | Their angle | Our counter-position |
|---|---|---|
| Pass the Keys | National scale, anonymous franchise feel | Local Bedford-led; named founders; estate-agency backing |
| The Right Property Group | Property-investor brand | Landlord-first, premium feel, Bedford home market |
| Comfy Workers | Contractor-stay focus | Full-service host: contractors **and** all guest types |
| Property Don | Premium UK brand | Same premium tier, local proof points |

Reflected in copy: *"backed by 1,000+ properties"*, *"founder two messages away"*, *"Bedford-built"*, *"premium serviced accommodation"*.

---

## 6. Technical SEO foundations (implemented)

| Item | Status |
|---|---|
| Unique `<title>` per page | ✅ |
| Unique meta description per page | ✅ |
| Canonical tag per page | ✅ |
| Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) | ✅ |
| Twitter Card meta | ✅ |
| JSON-LD: Organization, WebSite | ✅ on every page |
| JSON-LD: LocalBusiness with PostalAddress, GeoCoordinates, OpeningHoursSpecification | ✅ on every page |
| JSON-LD: Service | ✅ Home |
| JSON-LD: FAQPage | ✅ FAQ page |
| JSON-LD: BreadcrumbList | ✅ inner pages |
| XML sitemap | ✅ `sitemap.xml` |
| robots.txt with sitemap reference and AI crawler allow-list | ✅ |
| `llms.txt` (AI answer-engine guidance) | ✅ |
| Mobile-first responsive layout | ✅ |
| Semantic HTML5 + accessible headings | ✅ |
| Image alt text + WebP/JPEG responsive sets | ✅ |
| Page speed (static + Netlify edge CDN + minified CSS/JS) | ✅ |
| HTTPS (Let's Encrypt) | ✅ |
| Structured `_headers` (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | ✅ |

---

## 7. Off-site SEO — what the client must action

These are outside the website itself but inside the SEO Foundation scope.

1. **Google Business Profile (GBP)** — see `docs/google-business-profile-guide.md`.
2. **Google Search Console** — verify ownership of `unicosuites.com` and submit the sitemap. *(Steps in `docs/google-business-profile-guide.md`.)*
3. **Bing Webmaster Tools** — same domain verification + sitemap submission.
4. **Local citations** — Yell, Yelp UK, FreeIndex, Cylex with consistent NAP (Name / Address / Phone) matching the LocalBusiness schema on the site.
5. **First-page directories** — Trustpilot listing, Google review-collection workflow.

---

## 8. Ranking expectations (transparent, not over-promised)

| Timeframe | Expectation |
|---|---|
| **Week 1–4** | Google crawls and indexes every page; brand searches ("Unico Suites") rank #1. |
| **Month 1–3** | Long-tail Bedford-local queries begin to surface (Tier C). |
| **Month 3–6** | Primary Bedford-local terms (Tier A) appear in page 2–3, climb with GBP authority + reviews. |
| **Month 6–12** | Tier A terms reach page 1 with sustained content + GBP activity + review volume. |
| **Year 1+** | Tier B regional terms (Bedfordshire, Northants) compete depending on local link building. |

**Caveat:** SEO is not under our control past technical execution. Ranking depends on Google's algorithm, competitor activity and the client's ongoing content + review efforts. The work delivered gives the site the strongest possible foundation; sustained ranking is an outcome of months of consistency.

---

*Authored by Ali Amin — Unico Suites SEO Foundation deliverable.*
