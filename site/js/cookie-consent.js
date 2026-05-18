/* ============================================================
   Unico Suites — Cookie Consent
   GDPR-compliant. Stores choice in localStorage. Loads GA4 only
   after explicit consent. No third-party dependencies.
   ============================================================ */

(() => {
  'use strict';

  const STORAGE_KEY = 'us-cookie-consent-v1';
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: replace with real GA4 ID once provisioned

  const banner = document.getElementById('cookie-banner');
  if (!banner) return;

  const accept = banner.querySelector('[data-cookie-accept]');
  const decline = banner.querySelector('[data-cookie-decline]');

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'accepted') {
    loadGA();
    return; // Don't show banner
  }
  if (stored === 'declined') {
    return; // Respect prior decision; don't re-prompt this session
  }

  // First visit — show banner after brief delay so it isn't part of LCP
  requestAnimationFrame(() => {
    setTimeout(() => banner.setAttribute('data-visible', 'true'), 800);
  });

  accept?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    banner.removeAttribute('data-visible');
    loadGA();
  });

  decline?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    banner.removeAttribute('data-visible');
  });

  function loadGA() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.includes('XXXX')) return; // not yet provisioned
    if (window.gtag) return; // already loaded
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  }
})();
