/* ============================================================
   Unico Suites — Main JS
   nav scroll, mobile drawer, reveal-on-scroll, smooth anchor,
   stat counters, parallax hero
   No frameworks. Vanilla ES2020+.
   ============================================================ */

(() => {
  'use strict';

  // ── Booking destination ───────────────────────────────────────────────
  // When the Guesty direct-booking site is live, set BOOKING_URL to that URL.
  // Every "Book a stay" CTA (anything with [data-book-link]) updates automatically.
  // Leave as '' to keep the fallback (the contact form) wired in the HTML.
  const BOOKING_URL = '';
  if (BOOKING_URL) {
    document.querySelectorAll('[data-book-link]').forEach(a => {
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }

  // Gate reveal animations on JS presence — see css/globals.css `.js-ready .reveal`
  document.documentElement.classList.add('js-ready');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------
  // Nav scroll state
  // --------------------------------------------------------
  const nav = document.querySelector('.nav');
  if (nav) {
    const update = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // --------------------------------------------------------
  // Mobile drawer
  // --------------------------------------------------------
  const toggle = document.querySelector('.nav__toggle');
  const drawer = document.querySelector('.nav__drawer');
  if (toggle && drawer) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('nav-open');
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('nav-open');
      // Reset drawer scroll so the first link (About) is always visible on open.
      drawer.scrollTop = 0;
    };
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });
    drawer.addEventListener('click', e => {
      if (e.target.matches('a')) close();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') close();
    });
    // Close drawer if viewport widens to desktop
    window.matchMedia('(min-width: 840px)').addEventListener('change', e => {
      if (e.matches) close();
    });
  }

  // --------------------------------------------------------
  // Reveal-on-scroll via IntersectionObserver
  // --------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal, .reveal--stagger');
  if (reveals.length && !reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px 25% 0px', threshold: 0 });
    reveals.forEach(el => io.observe(el));
    // Safety net for crawlers / screenshot tools / mid-page navigations: ensure
    // anything not yet revealed becomes visible within a short window.
    setTimeout(() => reveals.forEach(el => el.classList.add('is-visible')), 1200);
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------
  // Animated stat counters
  // --------------------------------------------------------
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const animate = el => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = reduceMotion ? 0 : 1600;
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / duration, 1);
        const value = target * easeOutCubic(t);
        const display = Number.isInteger(target)
          ? Math.round(value).toLocaleString('en-GB')
          : value.toFixed(1);
        el.textContent = `${prefix}${display}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => io.observe(el));
  }

  // --------------------------------------------------------
  // Parallax — gentle drift on hero bg image
  // --------------------------------------------------------
  const heroBg = document.querySelector('[data-parallax]');
  if (heroBg && !reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.3) {
          heroBg.style.transform = `translate3d(0, ${y * 0.12}px, 0) scale(1.03)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // --------------------------------------------------------
  // Smooth-scroll anchor offset (CSS scroll-padding-top covers most;
  // this handles cross-page anchor links arriving with hash)
  // --------------------------------------------------------
  if (location.hash) {
    setTimeout(() => {
      const el = document.querySelector(CSS.escape(location.hash));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }

  // --------------------------------------------------------
  // Highlight current nav link (matches pathname)
  // --------------------------------------------------------
  const path = location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const normalised = href.replace(/\/$/, '');
    if (normalised && (normalised === path || (normalised !== '/' && path.endsWith(normalised)))) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // --------------------------------------------------------
  // Year stamp in footer
  // --------------------------------------------------------
  const yr = document.querySelector('[data-current-year]');
  if (yr) yr.textContent = new Date().getFullYear();
})();
