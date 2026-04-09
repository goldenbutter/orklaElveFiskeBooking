// === OWNER DASHBOARD ===
// All chart rendering is hand-rolled SVG. No external libraries.
// Reads data exclusively through DataStore.getBookings() so the source can
// later be swapped to a real backend (e.g. Supabase) without touching this file.

const BEAT_LABELS = {
  'ovre-elv':     { no: 'Øvre Elv',     en: 'Upper River' },
  'midtre-stryk': { no: 'Midtre Stryk', en: 'Middle Rapids' },
  'nedre-poll':   { no: 'Nedre Poll',   en: 'Lower Pool' }
};

const BEAT_COLORS = {
  'ovre-elv':     '#c9a84c',  // gold
  'midtre-stryk': '#7ec693',  // teal-green
  'nedre-poll':   '#5fa3c4'   // muted blue
};

const MONTH_LABELS = {
  no: ['Mai', 'Jun', 'Jul', 'Aug', 'Sep'],
  en: ['May', 'Jun', 'Jul', 'Aug', 'Sep']
};

let dashboardBookings = [];
let dashboardSort = { key: 'arrival', dir: 'desc' };
let dashboardSearch = '';
// Active chart filter — clicked from a bar / donut segment / status segment.
// type: 'month' | 'beat' | 'status' | null
let dashboardFilter = { type: null, value: null, label: null };

function fmtNOK(n) {
  return Math.round(n).toLocaleString('nb-NO') + ' kr';
}

function fmtNumber(n) {
  return n.toLocaleString('nb-NO');
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  const lang = (typeof currentLang !== 'undefined' ? currentLang : 'no');
  return d.toLocaleDateString(lang === 'no' ? 'nb-NO' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// === KPI computation ===
function computeKPIs(bookings) {
  const total = bookings.length;
  const revenue = bookings.reduce((s, b) => s + b.total, 0);
  const advanceList = bookings.filter(b => b.status === 'advance');
  const unpaidList  = bookings.filter(b => b.status === 'unpaid');
  const paidList    = bookings.filter(b => b.status === 'paid');

  return {
    sales: total,
    bookings: total,
    revenue,
    advanceCount: advanceList.length,
    advanceSum: advanceList.reduce((s, b) => s + b.deposit, 0),
    unpaidCount: unpaidList.length,
    unpaidSum: unpaidList.reduce((s, b) => s + b.total, 0),
    paidCount: paidList.length
  };
}

function renderKPIs(kpis) {
  const t = translations[currentLang];
  document.getElementById('kpi-sales').textContent       = fmtNumber(kpis.sales);
  document.getElementById('kpi-bookings').textContent    = fmtNumber(kpis.bookings);
  document.getElementById('kpi-revenue').textContent     = fmtNOK(kpis.revenue);
  document.getElementById('kpi-advance').textContent     = fmtNumber(kpis.advanceCount);
  document.getElementById('kpi-unpaid').textContent      = fmtNumber(kpis.unpaidCount);

  document.getElementById('kpi-bookings-sub').textContent =
    `${kpis.paidCount} ${t['dashboard.kpi.paidShort'] || 'betalt'}`;
  document.getElementById('kpi-advance-sub').textContent  = fmtNOK(kpis.advanceSum);
  document.getElementById('kpi-unpaid-sub').textContent   = fmtNOK(kpis.unpaidSum);
}

// === Monthly revenue bar chart ===
function renderRevenueBars(bookings) {
  const svg = document.getElementById('chart-revenue');
  if (!svg) return;
  svg.innerHTML = '';

  // Aggregate by month (May=4 .. Sep=8)
  const monthRevenue = [0, 0, 0, 0, 0]; // May..Sep
  bookings.forEach(b => {
    const m = new Date(b.arrival + 'T12:00:00').getMonth();
    if (m >= 4 && m <= 8) monthRevenue[m - 4] += b.total;
  });

  const W = 600, H = 280;
  const padL = 60, padR = 20, padT = 20, padB = 50;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = Math.max(...monthRevenue, 1);
  // Round max up to a nice number
  const niceMax = Math.ceil(max / 10000) * 10000;

  const labels = MONTH_LABELS[currentLang] || MONTH_LABELS.no;
  const barW = innerW / monthRevenue.length * 0.55;
  const slot = innerW / monthRevenue.length;

  // Gridlines (4 lines)
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH / 4) * i;
    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', padL);
    line.setAttribute('x2', W - padR);
    line.setAttribute('y1', y);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'bar-chart-grid');
    svg.appendChild(line);

    const val = niceMax - (niceMax / 4) * i;
    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('x', padL - 8);
    txt.setAttribute('y', y + 4);
    txt.setAttribute('text-anchor', 'end');
    txt.setAttribute('class', 'bar-chart-axis');
    txt.textContent = val >= 1000 ? Math.round(val / 1000) + 'k' : val;
    svg.appendChild(txt);
  }

  // Bars
  const t = translations[currentLang];
  monthRevenue.forEach((val, i) => {
    const x = padL + slot * i + (slot - barW) / 2;
    const h = niceMax > 0 ? (val / niceMax) * innerH : 0;
    const y = padT + innerH - h;

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', barW);
    rect.setAttribute('height', h);
    rect.setAttribute('rx', 2);
    rect.setAttribute('class', 'bar-chart-bar');
    rect.dataset.monthIndex = String(i + 4);

    const title = document.createElementNS(ns, 'title');
    title.textContent = `${labels[i]}: ${fmtNOK(val)}`;
    rect.appendChild(title);

    rect.addEventListener('click', () => {
      const chartTitle = t['dashboard.chart.monthly'] || 'Måned';
      setDashboardFilter('month', i + 4, `${chartTitle}: ${labels[i]}`);
    });

    svg.appendChild(rect);

    // Value label above bar
    if (val > 0) {
      const valText = document.createElementNS(ns, 'text');
      valText.setAttribute('x', x + barW / 2);
      valText.setAttribute('y', y - 6);
      valText.setAttribute('text-anchor', 'middle');
      valText.setAttribute('class', 'bar-chart-value');
      valText.textContent = Math.round(val / 1000) + 'k';
      svg.appendChild(valText);
    }

    // Month label
    const lbl = document.createElementNS(ns, 'text');
    lbl.setAttribute('x', x + barW / 2);
    lbl.setAttribute('y', H - padB + 20);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('class', 'bar-chart-label');
    lbl.textContent = labels[i];
    svg.appendChild(lbl);
  });
}

// === Donut chart: bookings per beat ===
function renderBeatDonut(bookings) {
  const svg = document.getElementById('chart-donut');
  const legendEl = document.getElementById('donut-legend');
  if (!svg || !legendEl) return;
  svg.innerHTML = '';
  legendEl.innerHTML = '';

  const counts = { 'ovre-elv': 0, 'midtre-stryk': 0, 'nedre-poll': 0 };
  bookings.forEach(b => { if (counts[b.beat] !== undefined) counts[b.beat]++; });

  const total = Object.values(counts).reduce((s, n) => s + n, 0);
  const cx = 100, cy = 100, r = 70, ir = 48;
  const ns = 'http://www.w3.org/2000/svg';

  if (total === 0) {
    const c = document.createElementNS(ns, 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy); c.setAttribute('r', r);
    c.setAttribute('fill', 'var(--color-border)');
    svg.appendChild(c);
    return;
  }

  let startAngle = -Math.PI / 2;
  Object.entries(counts).forEach(([beat, count]) => {
    if (count === 0) return;
    const sweep = (count / total) * Math.PI * 2;
    const endAngle = startAngle + sweep;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const xi1 = cx + ir * Math.cos(endAngle);
    const yi1 = cy + ir * Math.sin(endAngle);
    const xi2 = cx + ir * Math.cos(startAngle);
    const yi2 = cy + ir * Math.sin(startAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${xi1} ${yi1}`,
      `A ${ir} ${ir} 0 ${largeArc} 0 ${xi2} ${yi2}`,
      'Z'
    ].join(' ');

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', BEAT_COLORS[beat]);
    path.setAttribute('class', 'donut-segment');
    path.dataset.beat = beat;

    const title = document.createElementNS(ns, 'title');
    title.textContent = `${BEAT_LABELS[beat][currentLang]}: ${count}`;
    path.appendChild(title);

    path.addEventListener('click', () => {
      setDashboardFilter('beat', beat, BEAT_LABELS[beat][currentLang]);
    });

    svg.appendChild(path);
    startAngle = endAngle;
  });

  // Center text
  const centerVal = document.createElementNS(ns, 'text');
  centerVal.setAttribute('x', cx);
  centerVal.setAttribute('y', cy + 4);
  centerVal.setAttribute('class', 'donut-center-value');
  centerVal.textContent = total;
  svg.appendChild(centerVal);

  const centerLbl = document.createElementNS(ns, 'text');
  centerLbl.setAttribute('x', cx);
  centerLbl.setAttribute('y', cy + 22);
  centerLbl.setAttribute('class', 'donut-center-label');
  centerLbl.textContent = (translations[currentLang]['dashboard.donut.total'] || 'Totalt');
  svg.appendChild(centerLbl);

  // Legend
  Object.entries(counts).forEach(([beat, count]) => {
    const item = document.createElement('div');
    item.className = 'donut-legend-item';
    item.innerHTML = `
      <span class="donut-legend-swatch" style="background:${BEAT_COLORS[beat]}"></span>
      <span class="donut-legend-label">${BEAT_LABELS[beat][currentLang]}</span>
      <span class="donut-legend-count">${count}</span>
    `;
    legendEl.appendChild(item);
  });
}

// === Status stacked bar ===
function renderStatusBar(bookings) {
  const track = document.getElementById('status-bar-track');
  const legendEl = document.getElementById('status-bar-legend');
  if (!track || !legendEl) return;
  track.innerHTML = '';
  legendEl.innerHTML = '';

  const t = translations[currentLang];
  const total = bookings.length || 1;
  const segments = [
    { key: 'paid',    count: bookings.filter(b => b.status === 'paid').length,    label: t['dashboard.status.paid']    || 'Betalt' },
    { key: 'advance', count: bookings.filter(b => b.status === 'advance').length, label: t['dashboard.status.advance'] || 'Forskudd' },
    { key: 'unpaid',  count: bookings.filter(b => b.status === 'unpaid').length,  label: t['dashboard.status.unpaid']  || 'Ubetalt' }
  ];

  segments.forEach(seg => {
    if (seg.count === 0) return;
    const pct = (seg.count / total) * 100;
    const div = document.createElement('div');
    div.className = `status-bar-segment ${seg.key}`;
    div.style.width = pct + '%';
    div.textContent = pct >= 8 ? Math.round(pct) + '%' : '';
    div.title = `${seg.label}: ${seg.count} (${Math.round(pct)}%)`;
    div.dataset.status = seg.key;
    div.addEventListener('click', () => {
      setDashboardFilter('status', seg.key, seg.label);
    });
    track.appendChild(div);
  });

  segments.forEach(seg => {
    const item = document.createElement('div');
    item.className = 'status-bar-legend-item';
    const swatchColor = seg.key === 'paid' ? '#5fa978'
                      : seg.key === 'advance' ? 'var(--color-gold)'
                      : '#c2533a';
    item.innerHTML = `
      <span class="status-bar-legend-swatch" style="background:${swatchColor}"></span>
      <span>${seg.label} — ${seg.count}</span>
    `;
    legendEl.appendChild(item);
  });
}

// === Recent bookings table ===
function renderTable() {
  const tbody = document.getElementById('bookings-tbody');
  const empty = document.getElementById('bookings-empty');
  if (!tbody) return;

  const t = translations[currentLang];
  const q = dashboardSearch.trim().toLowerCase();

  let rows = dashboardBookings.slice();

  // Chart-driven filter (clicked bar / donut segment / status segment)
  if (dashboardFilter.type === 'month') {
    rows = rows.filter(b => new Date(b.arrival + 'T12:00:00').getMonth() === dashboardFilter.value);
  } else if (dashboardFilter.type === 'beat') {
    rows = rows.filter(b => b.beat === dashboardFilter.value);
  } else if (dashboardFilter.type === 'status') {
    rows = rows.filter(b => b.status === dashboardFilter.value);
  }

  if (q) {
    rows = rows.filter(b =>
      b.customerName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.customerEmail.toLowerCase().includes(q)
    );
  }

  // Sort
  const { key, dir } = dashboardSort;
  rows.sort((a, b) => {
    let av = a[key], bv = b[key];
    if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return dir === 'asc' ? -1 : 1;
    if (av > bv) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  tbody.innerHTML = '';
  if (rows.length === 0) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const statusLabel = {
    paid:    t['dashboard.status.paid']    || 'Betalt',
    advance: t['dashboard.status.advance'] || 'Forskudd',
    unpaid:  t['dashboard.status.unpaid']  || 'Ubetalt'
  };

  rows.forEach(b => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHTML(b.customerName)}<div style="font-size:0.72rem;color:var(--color-text-muted);">${escapeHTML(b.id)}</div></td>
      <td>${escapeHTML(BEAT_LABELS[b.beat] ? BEAT_LABELS[b.beat][currentLang] : b.beat)}</td>
      <td>${fmtDate(b.arrival)}</td>
      <td>${fmtDate(b.departure)}</td>
      <td>${b.rods}</td>
      <td class="col-amount">${fmtNOK(b.total)}</td>
      <td><span class="status-pill ${b.status}">${statusLabel[b.status]}</span></td>
    `;
    tbody.appendChild(tr);
  });

  // Update sort arrows
  document.querySelectorAll('.bookings-table th[data-sort]').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    const arrow = th.querySelector('.sort-arrow');
    if (th.dataset.sort === key) {
      th.classList.add(dir === 'asc' ? 'sort-asc' : 'sort-desc');
      if (arrow) arrow.textContent = dir === 'asc' ? '▲' : '▼';
    } else {
      if (arrow) arrow.textContent = '↕';
    }
  });
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// === Filter helpers (chart click → table filter) ===
function setDashboardFilter(type, value, label) {
  // Clicking the active filter again clears it (toggle off)
  if (dashboardFilter.type === type && dashboardFilter.value === value) {
    dashboardFilter = { type: null, value: null, label: null };
  } else {
    dashboardFilter = { type, value, label };
  }
  applyChartHighlights();
  renderFilterChip();
  renderTable();
  // Smoothly bring the table into view so the result of the click is visible
  const tableCard = document.querySelector('.bookings-table-card');
  if (tableCard) tableCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearDashboardFilter() {
  dashboardFilter = { type: null, value: null, label: null };
  applyChartHighlights();
  renderFilterChip();
  renderTable();
}

function applyChartHighlights() {
  // Bar chart
  document.querySelectorAll('.bar-chart-bar').forEach(el => {
    el.classList.remove('selected', 'dimmed');
    if (dashboardFilter.type === 'month') {
      if (parseInt(el.dataset.monthIndex, 10) === dashboardFilter.value) el.classList.add('selected');
      else el.classList.add('dimmed');
    }
  });
  // Donut
  document.querySelectorAll('.donut-segment').forEach(el => {
    el.classList.remove('selected', 'dimmed');
    if (dashboardFilter.type === 'beat') {
      if (el.dataset.beat === dashboardFilter.value) el.classList.add('selected');
      else el.classList.add('dimmed');
    }
  });
  // Status bar
  document.querySelectorAll('.status-bar-segment').forEach(el => {
    el.classList.remove('selected', 'dimmed');
    if (dashboardFilter.type === 'status') {
      if (el.dataset.status === dashboardFilter.value) el.classList.add('selected');
      else el.classList.add('dimmed');
    }
  });
}

function renderFilterChip() {
  const header = document.querySelector('.bookings-table-header');
  if (!header) return;
  let chip = header.querySelector('.dashboard-filter-chip');

  if (!dashboardFilter.type) {
    if (chip) chip.remove();
    return;
  }

  if (!chip) {
    chip = document.createElement('div');
    chip.className = 'dashboard-filter-chip';
    const search = header.querySelector('.bookings-search');
    if (search) header.insertBefore(chip, search);
    else header.appendChild(chip);
  }
  chip.innerHTML = `
    <span class="dashboard-filter-chip-label">${escapeHTML(dashboardFilter.label || '')}</span>
    <button type="button" class="dashboard-filter-chip-clear" aria-label="Fjern filter">×</button>
  `;
  chip.querySelector('.dashboard-filter-chip-clear').addEventListener('click', clearDashboardFilter);
}

// === Re-render everything (used on lang change) ===
function renderDashboardAll() {
  if (!dashboardBookings.length) return;
  const kpis = computeKPIs(dashboardBookings);
  renderKPIs(kpis);
  renderRevenueBars(dashboardBookings);
  renderBeatDonut(dashboardBookings);
  renderStatusBar(dashboardBookings);
  renderTable();
  // Re-apply selection state after charts are rebuilt from scratch
  applyChartHighlights();
  renderFilterChip();
}

// === INIT ===
async function initDashboard() {
  if (!document.querySelector('.dashboard-page')) return;

  // Owner name greeting
  const session = Auth.getUser();
  if (session) {
    const nameEl = document.getElementById('dashboard-owner-name');
    if (nameEl) nameEl.textContent = session.name || session.username;
  }

  // Load data through the abstraction layer
  dashboardBookings = await DataStore.getBookings();

  // Initial sort: most recent arrival first
  dashboardSort = { key: 'arrival', dir: 'desc' };

  renderDashboardAll();

  // Search input
  const search = document.getElementById('bookings-search');
  if (search) {
    search.addEventListener('input', (e) => {
      dashboardSearch = e.target.value;
      renderTable();
    });
  }

  // Sortable headers
  document.querySelectorAll('.bookings-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (dashboardSort.key === key) {
        dashboardSort.dir = dashboardSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        dashboardSort.key = key;
        dashboardSort.dir = 'asc';
      }
      renderTable();
    });
  });

  // Re-render on language change
  window.addEventListener('langchange', () => {
    renderDashboardAll();
  });
}
