/* ============================================================
   Unico Suites — FAQ accordion + category filter
   ============================================================ */

(() => {
  'use strict';

  const items = document.querySelectorAll('.accordion__item');
  items.forEach((item, idx) => {
    const btn = item.querySelector('.accordion__btn');
    const panel = item.querySelector('.accordion__panel');
    if (!btn || !panel) return;
    const id = `faq-panel-${idx}`;
    panel.id = id;
    btn.setAttribute('aria-controls', id);
    btn.setAttribute('aria-expanded', 'false');
    panel.setAttribute('data-open', 'false');
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', btn.id || (btn.id = `faq-btn-${idx}`));

    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.setAttribute('data-open', String(!expanded));
    });
  });

  // Category filters
  const cats = document.querySelectorAll('.faq-cat');
  if (!cats.length) return;
  cats.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.cat;
      cats.forEach(c => c.setAttribute('aria-pressed', String(c === btn)));
      document.querySelectorAll('.accordion__item').forEach(item => {
        const cat = item.dataset.cat || '';
        const show = filter === 'all' || cat === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
})();
