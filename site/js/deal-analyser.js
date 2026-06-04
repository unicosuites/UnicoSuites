/* ============================================================
   Unico Suites — Deal Analyser
   Bedford-area uplift calculator. Reads URL params, runs model,
   animates results. Model is a deterministic adjustment formula
   over Bedford-area baselines — see lookup tables below.
   ============================================================ */

(() => {
  'use strict';

  // ----- Bedford baseline tables (client-confirmed) -----
  const BASE_RENT = {           // typical Bedford long-let rent (£ / month)
    '1': 900,
    '2': 1100,
    '3': 1300,
    '4': 1500,
    '5': 1600,
  };
  const BASE_SA_INCOME = {      // typical SA gross monthly income (£ / month)
    '1': 1350,
    '2': 1750,
    '3': 2150,
    '4': 2550,
    '5': 2850,
  };
  const TYPE_ADJ = {
    'flat':  0,
    'house': 150,
  };
  const PARKING_ADJ = {
    '0': 0,
    '1': 75,
    '2': 150,
  };
  const LOCATION_ADJ = {
    'town-centre': 150,
    'station':     100,
    'other':         0,
  };
  const LOCATION_LABELS = {
    'town-centre': 'Bedford Town Centre',
    'station':     'Bedford Station Area',
    'other':       'Other Bedford Areas',
  };
  const TYPE_LABELS = { flat: 'Flat / Apartment', house: 'House' };
  const PARKING_LABELS = {
    '0': 'No parking',
    '1': '1 parking space',
    '2': '2+ parking spaces',
  };

  // ----- Helpers -----
  const gbp = (n, decimals = 0) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: decimals }).format(n);

  const signed = (n) => (n >= 0 ? `+${gbp(n)}` : `−${gbp(Math.abs(n))}`);

  const $ = (sel, root = document) => root.querySelector(sel);

  const clampBeds = (v) => (['1','2','3','4','5'].includes(String(v)) ? String(v) : '2');
  const clampBaths = (v) => {
    const n = parseInt(v, 10);
    if (!Number.isFinite(n)) return 2;
    return Math.max(1, Math.min(4, n));
  };
  const clampType = (v) => (['flat','house'].includes(v) ? v : 'flat');
  const clampParking = (v) => (['0','1','2'].includes(String(v)) ? String(v) : '0');
  const clampLocation = (v) => (['town-centre','station','other'].includes(v) ? v : 'other');

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
  function calculateDeal(raw) {
    const bedrooms = clampBeds(raw.bedrooms);
    const bathrooms = clampBaths(raw.bathrooms);
    const type = clampType(raw.type);
    const parking = clampParking(raw.parking);
    const location = clampLocation(raw.location);

    const baseRent    = BASE_RENT[bedrooms];
    const baseIncome  = BASE_SA_INCOME[bedrooms];
    const bathAdj     = (bathrooms - 1) * 100;
    const typeAdj     = TYPE_ADJ[type];
    const parkingAdj  = PARKING_ADJ[parking];
    const locationAdj = LOCATION_ADJ[location];

    // Property attributes (bathrooms, type, parking, location) move BOTH the
    // typical long-let rent and the projected SA income. A 2-bed house in the
    // town centre rents — and earns — more than a 2-bed flat on the fringes.
    const adjustments      = bathAdj + typeAdj + parkingAdj + locationAdj;
    const currentRent      = baseRent + adjustments;
    const estimatedMonthly = baseIncome + adjustments;
    const additionalMonthly = estimatedMonthly - currentRent;

    const currentAnnual    = currentRent * 12;
    const estimatedAnnual  = estimatedMonthly * 12;
    const additionalAnnual = additionalMonthly * 12;

    const percentageIncrease = currentRent > 0
      ? Math.round((additionalMonthly / currentRent) * 100)
      : 0;

    return {
      inputs: { bedrooms, bathrooms, type, parking, location },
      baseRent, baseIncome,
      bathAdj, typeAdj, parkingAdj, locationAdj,
      currentRent, estimatedMonthly, additionalMonthly,
      currentAnnual, estimatedAnnual, additionalAnnual,
      percentageIncrease,
    };
  }

  // ----- Form serialisation helpers (used by both pages) -----
  const FIELDS = ['bedrooms', 'bathrooms', 'type', 'parking', 'location'];

  function readForm(form) {
    const data = new FormData(form);
    const out = {};
    FIELDS.forEach(k => { out[k] = data.get(k) || ''; });
    return out;
  }

  function populateForm(form, params) {
    FIELDS.forEach(k => {
      const field = form.elements.namedItem(k);
      if (field && params[k]) field.value = params[k];
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

  const urlParams = Object.fromEntries(new URLSearchParams(location.search));
  if (dealForm) populateForm(dealForm, urlParams);

  if (dealForm) {
    dealForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = readForm(dealForm);
      const params = new URLSearchParams(inputs);
      history.replaceState(null, '', `?${params.toString()}`);
      runAndRender(inputs);
      scrollToResults();
    });
  }

  function scrollToResults() {
    if (!resultsRoot) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Defer to next frame so layout settles after the re-render before we
    // measure offsets. scrollIntoView raced with the animations on some
    // mobile browsers — manual scrollTo with the fixed-nav offset is robust.
    requestAnimationFrame(() => {
      const nav = document.querySelector('.nav');
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      const top = resultsRoot.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // Auto-run once on load (URL params or defaults)
  if (resultsRoot) {
    const startInputs = Object.keys(urlParams).length
      ? urlParams
      : { bedrooms: '2', bathrooms: '2', type: 'flat', parking: '0', location: 'town-centre' };
    setTimeout(() => runAndRender(startInputs), 600);
  }

  // ----- Render -----
  function runAndRender(rawInputs) {
    const r = calculateDeal(rawInputs);

    // Summary metric cards: annual headline + monthly sub
    const setMetric = (id, val) => {
      const el = $(`#${id}`);
      if (el) animateValue(el, val, gbp);
    };
    setMetric('metric-traditional', r.currentAnnual);
    setMetric('metric-sa',          r.estimatedAnnual);
    setMetric('metric-additional',  r.additionalAnnual);

    const setSub = (id, monthly) => {
      const el = $(`#${id}`);
      if (el) el.textContent = `${gbp(monthly)} / monthly`;
    };
    setSub('metric-traditional-sub', r.currentRent);
    setSub('metric-sa-sub',          r.estimatedMonthly);
    setSub('metric-additional-sub',  r.additionalMonthly);

    drawComparisonChart(r);

    // Formula breakdown — shows how both the current rent and the estimated
    // income are built up from the same base + adjustment block.
    const tbl = $('#breakdown-tbody');
    if (tbl) {
      const bathLabel = `${r.inputs.bathrooms} bathroom${r.inputs.bathrooms === 1 ? '' : 's'}`;
      tbl.innerHTML = '';
      const rows = [
        [`Baseline (${r.inputs.bedrooms} bed)`,              gbp(r.baseRent),    gbp(r.baseIncome)],
        [`Bathroom adjustment (${bathLabel})`,               signed(r.bathAdj),  signed(r.bathAdj)],
        [`Property type (${TYPE_LABELS[r.inputs.type]})`,    signed(r.typeAdj),  signed(r.typeAdj)],
        [`Parking (${PARKING_LABELS[r.inputs.parking]})`,    signed(r.parkingAdj), signed(r.parkingAdj)],
        [`Location (${LOCATION_LABELS[r.inputs.location]})`, signed(r.locationAdj), signed(r.locationAdj)],
      ];
      rows.forEach(([label, rentCol, incomeCol]) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${label}</td><td>${rentCol}</td><td>${incomeCol}</td>`;
        tbl.appendChild(tr);
      });
      const totalTr = document.createElement('tr');
      totalTr.className = 'is-total';
      totalTr.innerHTML = `<td>Monthly total</td><td>${gbp(r.currentRent)}</td><td>${gbp(r.estimatedMonthly)}</td>`;
      tbl.appendChild(totalTr);
    }

    // Uplift badge
    const upliftEl = $('#uplift-pct');
    if (upliftEl) {
      upliftEl.textContent = r.percentageIncrease >= 0
        ? `+${r.percentageIncrease}%`
        : `${r.percentageIncrease}%`;
    }
    const upliftSub = $('#uplift-sub');
    if (upliftSub) {
      upliftSub.textContent = r.percentageIncrease > 0
        ? `vs. typical Bedford long-let rent of ${gbp(r.currentRent)} / month for a ${r.inputs.bedrooms}-bed`
        : `Estimated SA income is at or below the long-let baseline — let's chat about strategy`;
    }

    // Reveal once
    resultsRoot.classList.add('is-visible');
  }

  // ----- Comparison chart: two flat lines + gold gap fill -----
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const SVG_NS = 'http://www.w3.org/2000/svg';

  function drawComparisonChart(r) {
    const svg = document.querySelector('.line-chart');
    if (!svg) return;
    const W = 720, H = 320;
    const pad = { top: 32, right: 24, bottom: 44, left: 72 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;

    // Both lines are flat — model has no seasonality. The visual story is
    // the gap between them (the additional income).
    const ymax = Math.max(r.estimatedMonthly, r.currentRent) * 1.15 || 100;
    const ymin = 0;

    const x = i => pad.left + (i / (MONTHS.length - 1)) * plotW;
    const y = v => pad.top + (1 - (v - ymin) / (ymax - ymin)) * plotH;

    const xL = x(0);
    const xR = x(MONTHS.length - 1);
    const ySa  = y(r.estimatedMonthly);
    const yAst = y(r.currentRent);

    // Lines (flat horizontals)
    svg.querySelector('.line-chart__path--ast')
       .setAttribute('d', `M ${xL} ${yAst} L ${xR} ${yAst}`);
    svg.querySelector('.line-chart__path--sa')
       .setAttribute('d', `M ${xL} ${ySa} L ${xR} ${ySa}`);

    // Gold fill between the two lines = additional income zone
    svg.querySelector('.line-chart__fill')
       .setAttribute('d', `M ${xL} ${ySa} L ${xR} ${ySa} L ${xR} ${yAst} L ${xL} ${yAst} Z`);

    // Grid + axis labels
    const grid  = svg.querySelector('.line-chart__grid');
    const yAxis = svg.querySelector('.line-chart__y-axis');
    const xAxis = svg.querySelector('.line-chart__x-axis');
    [grid, yAxis, xAxis].forEach(g => { while (g.firstChild) g.removeChild(g.firstChild); });

    const tickCount = 5;
    for (let i = 0; i <= tickCount; i++) {
      const val = ymin + (ymax - ymin) * (i / tickCount);
      const yy  = y(val);
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', pad.left);   line.setAttribute('x2', W - pad.right);
      line.setAttribute('y1', yy);         line.setAttribute('y2', yy);
      line.setAttribute('class', 'line-chart__gridline');
      grid.appendChild(line);
      const lbl = document.createElementNS(SVG_NS, 'text');
      lbl.setAttribute('x', pad.left - 10); lbl.setAttribute('y', yy + 4);
      lbl.setAttribute('text-anchor', 'end');
      lbl.setAttribute('class', 'line-chart__label');
      lbl.textContent = gbp(val);
      yAxis.appendChild(lbl);
    }

    MONTHS.forEach((m, i) => {
      const lbl = document.createElementNS(SVG_NS, 'text');
      lbl.setAttribute('x', x(i));
      lbl.setAttribute('y', H - pad.bottom + 20);
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('class', 'line-chart__label');
      lbl.textContent = m;
      xAxis.appendChild(lbl);
    });
  }

  // ----- Print: wired to the data-print-results button -----
  const printBtn = document.querySelector('[data-print-results]');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      const header = document.querySelector('.print-header');
      if (header && !header.querySelector('.print-header__date')) {
        const d = new Date();
        const stamp = document.createElement('span');
        stamp.className = 'print-header__date';
        stamp.textContent = `Generated ${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`;
        header.appendChild(stamp);
      }
      window.print();
    });
  }
})();
