/* ============================================================
   Unico Suites — Deal Analyser
   ROI calculator. Reads URL params, runs model, animates results.
   Defaults below are PLACEHOLDERS pending client confirmation.
   ============================================================ */

(() => {
  'use strict';

  // ----- Calculation defaults (adjust once client confirms) -----
  const RATES = {            // base nightly rate (£) by bedroom count
    'studio': 65,
    '1':      80,
    '2':     100,
    '3':     130,
    '4':     160,
    '5+':    190,
  };
  const LOCATION_MULTIPLIERS = {
    'bedford':       1.00,
    'kempston':      0.90,
    'milton-keynes': 1.15,
    'luton':         0.95,
    'northampton':   1.00,
    'other':         0.95,
  };
  const TYPE_MULTIPLIERS = {
    'house':  1.10,
    'flat':   1.00,
    'hmo':    0.85,
    'studio': 0.90,
  };
  const OCCUPANCY      = 0.70;                          // 70 % avg
  const NIGHTS_PER_MONTH = 30.4;
  const AVG_STAY        = 4.5;                          // nights per booking
  const PLATFORM_FEE_PCT = 0.03;                        // Airbnb/Booking cut
  const MGMT_FEE_PCT     = 0.18;                        // TBC
  const MAINTENANCE_PM   = 50;                          // £/month maintenance allowance
  const CLEAN_BASE       = 45;                          // per turnover
  const CLEAN_PER_BED    = 15;
  const CONSUM_BASE      = 40;                          // per month consumables
  const CONSUM_PER_BED   = 10;

  // ----- Helpers -----
  const gbp = (n, decimals = 0) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: decimals }).format(n);

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Animate a numeric element to a target value
  const animateValue = (el, target, formatter = gbp, duration = 1400) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || duration <= 0) { el.textContent = formatter(target); return; }
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = formatter(target * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ----- Calculation model -----
  function calculateDeal({ bedrooms, type, location, currentRent }) {
    const bedroomKey = bedrooms === 'studio' ? 'studio' : (bedrooms in RATES ? bedrooms : '1');
    const nightly = (RATES[bedroomKey] || 80) *
                    (LOCATION_MULTIPLIERS[location] || 1) *
                    (TYPE_MULTIPLIERS[type] || 1);

    const occupiedNights = NIGHTS_PER_MONTH * OCCUPANCY;
    const grossMonthly   = nightly * occupiedNights;

    const turnoversPerMonth = occupiedNights / AVG_STAY;
    const bedCount = bedroomKey === 'studio' ? 0 : (bedroomKey === '5+' ? 5 : parseInt(bedroomKey, 10) || 1);
    const cleaningPerTurn = CLEAN_BASE + bedCount * CLEAN_PER_BED;
    const cleaningMonthly = cleaningPerTurn * turnoversPerMonth;

    const consumablesMonthly = CONSUM_BASE + bedCount * CONSUM_PER_BED;
    const platformFees       = grossMonthly * PLATFORM_FEE_PCT;
    const utilitiesMonthly   = 180 + bedCount * 35; // rough — bills included in SA
    const opex = cleaningMonthly + consumablesMonthly + platformFees + utilitiesMonthly + MAINTENANCE_PM;
    const grossAfterOpex = grossMonthly - opex;
    const mgmtFee        = Math.max(0, grossAfterOpex) * MGMT_FEE_PCT;
    const netToOwner     = grossAfterOpex - mgmtFee;

    const traditionalMonthly = parseFloat(currentRent) || estimateAST(bedCount, location);
    const additionalMonthly  = Math.max(0, netToOwner - traditionalMonthly);
    const upliftPct          = traditionalMonthly > 0
      ? Math.round(((netToOwner - traditionalMonthly) / traditionalMonthly) * 100)
      : 0;

    return {
      nightly: Math.round(nightly),
      grossMonthly, opex, mgmtFee, netToOwner,
      cleaningMonthly, consumablesMonthly, platformFees, utilitiesMonthly,
      traditionalMonthly, additionalMonthly, upliftPct,
      annual: {
        gross:    grossMonthly * 12,
        opex:     opex * 12,
        mgmtFee:  mgmtFee * 12,
        netToOwner: netToOwner * 12,
        traditional: traditionalMonthly * 12,
        additional:  additionalMonthly * 12,
      },
    };
  }

  function estimateAST(bedrooms, location) {
    // Rough Bedford-area AST monthly rent baseline
    const base = [700, 850, 1050, 1250, 1450, 1650][Math.min(5, bedrooms)];
    return base * (LOCATION_MULTIPLIERS[location] || 1);
  }

  // ----- Form serialisation helpers (used by both pages) -----
  function readForm(form) {
    const data = new FormData(form);
    return {
      bedrooms: data.get('bedrooms') || '2',
      type:     data.get('type')     || 'flat',
      location: data.get('location') || 'bedford',
      currentRent: data.get('currentRent') || '',
      bathrooms:   data.get('bathrooms') || '',
      furnished:   data.get('furnished')  || '',
    };
  }

  function populateForm(form, params) {
    Object.entries(params).forEach(([k, v]) => {
      const field = form.elements.namedItem(k);
      if (field && v) field.value = v;
    });
  }

  // ----- Submit handler (homepage form → deal-analyser page) -----
  const homeForm = document.querySelector('form[data-deal-form="home"]');
  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const params = new URLSearchParams(readForm(homeForm));
      window.location.href = `deal-analyser.html?${params.toString()}`;
    });
  }

  // ----- Results page wiring -----
  const resultsRoot = document.getElementById('deal-results');
  const dealForm    = document.querySelector('form[data-deal-form="page"]');
  if (!resultsRoot && !dealForm) return;

  // Pre-fill the on-page form from URL params, then trigger calc after a small delay
  const urlParams = Object.fromEntries(new URLSearchParams(location.search));
  if (dealForm) populateForm(dealForm, urlParams);

  if (dealForm) {
    dealForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = readForm(dealForm);
      // Update URL without reload so the user can share results
      const params = new URLSearchParams(inputs);
      history.replaceState(null, '', `?${params.toString()}`);
      runAndRender(inputs);
    });
  }

  // Auto-run once on load if URL has params (or fall back to defaults)
  if (resultsRoot) {
    const startInputs = Object.keys(urlParams).length ? urlParams : { bedrooms: '2', type: 'flat', location: 'bedford' };
    // Defer slightly so the reveal animations look intentional
    setTimeout(() => runAndRender(startInputs), 600);
  }

  // ----- Render -----
  function runAndRender(rawInputs) {
    const inputs = {
      bedrooms: rawInputs.bedrooms || '2',
      type:     rawInputs.type     || 'flat',
      location: rawInputs.location || 'bedford',
      currentRent: rawInputs.currentRent || '',
    };
    const r = calculateDeal(inputs);

    // Summary metrics
    const setMetric = (id, val) => {
      const el = $(`#${id}`);
      if (el) animateValue(el, val, gbp);
    };
    setMetric('metric-traditional', r.traditionalMonthly);
    setMetric('metric-sa',          r.netToOwner);
    setMetric('metric-additional',  r.additionalMonthly);

    // Sub-labels (annual)
    const setSub = (id, val) => { const el = $(`#${id}`); if (el) el.textContent = `${gbp(val)} / year`; };
    setSub('metric-traditional-sub', r.annual.traditional);
    setSub('metric-sa-sub',          r.annual.netToOwner);
    setSub('metric-additional-sub',  r.annual.additional);

    // Bar chart heights
    const max = Math.max(r.traditionalMonthly, r.netToOwner);
    const heightAst = Math.max(8, (r.traditionalMonthly / max) * 100);
    const heightSa  = Math.max(8, (r.netToOwner       / max) * 100);
    const astEl = $('#bar-ast'),  saEl = $('#bar-sa');
    if (astEl) { astEl.style.height = `${heightAst}%`; }
    if (saEl)  { saEl.style.height  = `${heightSa}%`;  }
    const astAmt = $('#bar-ast-amount'), saAmt = $('#bar-sa-amount');
    if (astAmt) astAmt.textContent = gbp(r.traditionalMonthly);
    if (saAmt)  saAmt.textContent  = gbp(r.netToOwner);

    // Breakdown table
    const tbl = $('#breakdown-tbody');
    if (tbl) {
      tbl.innerHTML = '';
      const rows = [
        ['Gross nightly rental income',    r.grossMonthly,             r.annual.gross],
        ['Cleaning & linen',              -r.cleaningMonthly,          -r.cleaningMonthly * 12],
        ['Consumables (toiletries, etc.)', -r.consumablesMonthly,      -r.consumablesMonthly * 12],
        ['Utilities, broadband, council', -r.utilitiesMonthly,         -r.utilitiesMonthly * 12],
        ['Platform fees (Airbnb / Booking)', -r.platformFees,          -r.platformFees * 12],
        ['Maintenance allowance',          -50,                        -600],
        ['Unico Suites management fee',    -r.mgmtFee,                 -r.mgmtFee * 12],
      ];
      rows.forEach(([label, monthly, annual]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${label}</td><td>${monthly < 0 ? '−' : ''}${gbp(Math.abs(monthly))}</td><td>${annual < 0 ? '−' : ''}${gbp(Math.abs(annual))}</td>`;
        tbl.appendChild(tr);
      });
      const totalTr = document.createElement('tr');
      totalTr.className = 'is-total';
      totalTr.innerHTML = `<td>Net to owner</td><td>${gbp(r.netToOwner)}</td><td>${gbp(r.annual.netToOwner)}</td>`;
      tbl.appendChild(totalTr);
    }

    // Uplift badge
    const upliftEl = $('#uplift-pct');
    if (upliftEl) {
      upliftEl.textContent = r.upliftPct >= 0 ? `+${r.upliftPct}%` : `${r.upliftPct}%`;
    }
    const upliftSub = $('#uplift-sub');
    if (upliftSub) {
      upliftSub.textContent = r.upliftPct > 0
        ? `vs. estimated traditional AST letting of ${gbp(r.traditionalMonthly)}/month`
        : `Your current rent already exceeds the SA estimate — let's chat about strategy`;
    }

    // Reveal once
    resultsRoot.classList.add('is-visible');
  }
})();
