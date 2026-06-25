# Unico Suites — Google Business Profile Setup Guide

**Prepared for:** Unico Suites Ltd
**Why this matters:** Google Business Profile (GBP) is the most important local-SEO asset for a Bedford-based service business. It powers the "Map Pack" — the 3 local results shown above organic — for searches like *"serviced accommodation management Bedford"*. Without GBP, the site is invisible in the most valuable local search position.

---

## 1. Create the profile

1. Go to [business.google.com](https://business.google.com).
2. Sign in with the Google account you want to own this profile *(use the same account as the GA4 setup — `unicosuites@gmail.com` or the company Google Workspace account, **not** a personal account)*.
3. Click **Manage now** → **Add your business**.
4. **Business name:** `Unico Suites`
5. **Business category (primary):** `Property management company`
   - This is the most accurate category for SA management. *Avoid* "Holiday apartment" or "Vacation home rental agency" — those are for direct accommodation providers, not managers.
6. **Additional categories** (add all three):
   - `Letting agent`
   - `Estate agent`
   - `Real estate consultant`

---

## 2. Address and service area

Unico Suites serves landlords — guests don't visit the office. This is a **service-area business**, not a storefront.

1. When asked *"Do you want to add a location customers can visit?"* — answer **No**.
2. Set the registered business address (used for verification, not displayed publicly): `60 Bromham Road, Bedford, MK40 2QG`.
3. **Service areas** — add:
   - Bedford
   - Bedfordshire
   - Northamptonshire
   - Hertfordshire
   - Cambridgeshire

---

## 3. Contact details

Keep these **identical** to the website (NAP consistency is a ranking factor):

| Field | Value |
|---|---|
| Phone | `01234 237990` |
| Website | `https://unicosuites.com` |
| Email | `hello@unicosuites.com` |

---

## 4. Verify ownership

Google will offer one or more verification methods:

- **Postcard by post** (most common for new UK businesses): a card arrives in 5–14 days with a 5-digit code. Enter at [business.google.com](https://business.google.com).
- **Phone / SMS verification** (if available): code arrives instantly.
- **Video verification** (Google may require): record a 30-second walkthrough showing the office, signage, and proof of business activity.

**Do not** trade the profile or change the address before verification — Google will reset the process.

---

## 5. Profile content (do all of this in one sitting)

### Business description (750 characters max)
Suggested copy — paste verbatim:

> Unico Suites is a premium serviced accommodation management company based in Bedford. We manage short-stay rental properties on behalf of landlords across Bedfordshire, Northamptonshire, Hertfordshire and Cambridgeshire — listing them on Airbnb, Booking.com and Vrbo, handling guest communication, dynamic pricing, cleaning, linen, maintenance and monthly owner reporting. Backed by an established estate-agency and lettings group managing over 1,000 properties, we deliver higher returns than traditional letting with no hands-on time required. Choose 18% full management or fixed Guaranteed Rent. Book a free property review at unicosuites.com.

### Opening hours
- Mon–Fri: 09:00–18:00
- Sat: 10:00–15:00
- Sun: Closed
*(Match the `OpeningHoursSpecification` schema on the site.)*

### Services (add each as a service)
- Full Property Management — 18% + VAT
- Guaranteed Rent
- Listing & channel management (Airbnb / Booking.com / Vrbo)
- Dynamic pricing
- Cleaning & linen
- Maintenance coordination
- Free property review for landlords

### Attributes (toggle on if available)
- LGBTQ+ friendly
- Online appointments
- Identifies as women-owned: *only if applicable*
- Wheelchair accessible: *not relevant — service area business*

---

## 6. Photos (most-skipped, highest-impact step)

Google ranks profiles with more photos higher. Upload **minimum 10 photos** before going live:

| Type | Count | What to include |
|---|---|---|
| **Logo** | 1 | Square logo on transparent background — already in `site/assets/brand/` |
| **Cover** | 1 | The brand banner — already in `site/assets/brand/banner-branded.*` |
| **Interior / property** | 5+ | Best photos from the property gallery on the live site |
| **Team** | 2 | The two founder portraits already on the about page |
| **At work** | 2+ | Photos of properties being prepped, key handovers, cleaning, staging |

Upload the highest resolution available. Re-upload monthly — Google rewards active profiles.

---

## 7. Reviews — the highest-leverage SEO move post-launch

A profile with **20+ recent 5-star reviews** dramatically outranks one with none.

### Strategy
1. **Don't ask for reviews on day 1** — wait until you have 3–5 genuinely happy landlord clients.
2. Create a short Google review link via the GBP dashboard (it generates a clean `g.page/r/...` URL).
3. After every successful onboarding or after the first month's payout statement, send a one-line WhatsApp / email:
   > *"If you'd be willing to leave us a quick Google review, here's the link: [g.page/r/...]. Two minutes — and it genuinely helps other landlords find us. Thanks for trusting Unico Suites."*
4. **Reply to every review** — positive or negative — within 48 hours. Google ranks profiles with response rates above 80%.

### Target
- Month 1: 5 reviews
- Month 3: 15 reviews
- Month 6: 25+ reviews

---

## 8. Posts (free weekly SEO signal)

GBP "Posts" function like a mini-blog inside the profile. Google indexes them.

**Post once a week** — even a 50-word update:
- New property onboarded ("Just added a 2-bed flat in Bedford Town Centre to our short-let portfolio")
- Tip for landlords ("Top 3 things to check before letting your Bedford property as a short stay")
- Service milestone ("Crossed 200 nights booked in May — thank you to our landlords")

Each post can include a photo + a button linking to a page on the site. Use this to drive traffic to `/deal-analyser.html`, `/how-it-works.html`, and `/contact.html`.

---

## 9. Google Search Console (separate from GBP, do at the same time)

After GBP is verified:

1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. **Add property → URL prefix → `https://unicosuites.com`**.
3. **Verify ownership** — easiest method: HTML tag. Add the meta tag Google gives you to `<head>` of every page *(send the tag to your developer and we'll wire it in — it takes 2 minutes)*.
4. Once verified: **Sitemaps → submit `https://unicosuites.com/sitemap.xml`**.
5. Within 1–2 weeks: **Coverage** report will confirm Google has indexed every page.

This is what tells Google "this site exists, please rank it." Without Search Console submission, indexation can take weeks longer.

---

## 10. Bing Webmaster Tools (15-minute bonus)

Bing powers ~5% of UK search — small but free traffic.

1. Go to [bing.com/webmasters](https://bing.com/webmasters).
2. Sign in → **Add site → `https://unicosuites.com`**.
3. **Import from Google Search Console** if available — saves manual verification.
4. Submit `https://unicosuites.com/sitemap.xml`.

---

## 11. Local citations — NAP consistency

After GBP is live, list the business in these UK directories with the **exact same Name / Address / Phone** as on the website and GBP. Inconsistencies hurt local ranking.

| Directory | Priority | URL |
|---|---|---|
| Yell.com | High | yell.com |
| Yelp UK | Medium | yelp.co.uk |
| FreeIndex | Medium | freeindex.co.uk |
| Cylex UK | Medium | cylex-uk.co.uk |
| Scoot | Low | scoot.co.uk |
| Hotfrog | Low | hotfrog.co.uk |
| Thomson Local | Low | thomsonlocal.com |

---

## 12. Checklist — sign-off before invoicing

- [ ] GBP profile created
- [ ] Verification submitted (postcard / video / phone)
- [ ] Profile fully filled (description, hours, services, attributes)
- [ ] 10+ photos uploaded
- [ ] First Post published
- [ ] Google Search Console verified + sitemap submitted
- [ ] Bing Webmaster Tools verified + sitemap submitted
- [ ] At least 3 local citations submitted (Yell, Yelp UK, FreeIndex)
- [ ] Review request workflow agreed (WhatsApp template, when to ask)

---

*Authored by Ali Amin — Unico Suites SEO Foundation deliverable.*
