// === OFF-SEASON DETECTION ===
function getSeasonStatus() {
  const today = new Date();
  const m = today.getMonth(); // 0-indexed
  const d = today.getDate();
  const before = m < 4 || (m === 4 && d < 15);
  const after = (m === 8 && d > 15) || m > 8;
  return { offSeason: before || after, before };
}

function getNextSeasonYear() {
  const today = new Date();
  const { before } = getSeasonStatus();
  return before ? today.getFullYear() : today.getFullYear() + 1;
}

function updateOffseasonNotice() {
  const notice = document.getElementById('offseason-notice');
  if (!notice) return;
  const { offSeason } = getSeasonStatus();
  if (!offSeason) {
    notice.classList.remove('visible');
    return;
  }
  const year = getNextSeasonYear();
  const t = translations[currentLang];
  notice.textContent = t['booking.offseason.notice'].replace('{year}', year);
  notice.classList.add('visible');
}

function validateDateInput(input, errorId) {
  const errorEl = document.getElementById(errorId);
  if (!errorEl || !input) return;
  if (!input.value) {
    errorEl.classList.remove('visible');
    return;
  }
  const val = new Date(input.value + 'T12:00:00');
  const yr = val.getFullYear();
  const seasonStart = new Date(`${yr}-05-15T12:00:00`);
  const seasonEnd = new Date(`${yr}-09-15T12:00:00`);
  if (val < seasonStart || val > seasonEnd) {
    errorEl.textContent = translations[currentLang]['booking.date.error'];
    errorEl.classList.add('visible');
  } else {
    errorEl.classList.remove('visible');
  }
}

// === BOOKING SYSTEM ===
const BEATS = {
  'ovre-elv': { maxRods: 3 },
  'midtre-stryk': { maxRods: 2 },
  'nedre-poll': { maxRods: 4 }
};

const SEASON_START = { month: 4, day: 15 }; // May 15 (0-indexed month)
const SEASON_END = { month: 8, day: 15 };   // Sep 15

function getSeasonRate(date) {
  const m = date.getMonth(); // 0-indexed
  const d = date.getDate();

  if (m === 4) return { rate: 750, period: 'early' };                       // May
  if (m === 5 || (m === 6 && d <= 15)) return { rate: 950, period: 'peak' }; // Jun – Jul 15
  if ((m === 6 && d >= 16) || m === 7) return { rate: 850, period: 'mid' };  // Jul 16 – Aug
  if (m === 8) return { rate: 650, period: 'late' };                         // Sep
  return { rate: 850, period: 'mid' };
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString(currentLang === 'no' ? 'nb-NO' : 'en-GB', {
    day: 'numeric', month: 'long'
  });
}

function formatNOK(amount) {
  return amount.toLocaleString('nb-NO') + ' kr';
}

function calculateNights(arrivalStr, departureStr) {
  const arr = new Date(arrivalStr + 'T12:00:00');
  const dep = new Date(departureStr + 'T12:00:00');
  const nights = [];
  const current = new Date(arr);

  while (current < dep) {
    nights.push(getSeasonRate(new Date(current)));
    current.setDate(current.getDate() + 1);
  }
  return nights;
}

function updateBookingDisplay() {
  const resultsEl = document.getElementById('booking-results');
  const placeholderEl = document.getElementById('booking-placeholder');
  if (!resultsEl) return;

  const beatVal = document.getElementById('booking-beat')?.value;
  const arrivalVal = document.getElementById('booking-arrival')?.value;
  const departureVal = document.getElementById('booking-departure')?.value;
  const rods = parseInt(document.getElementById('rods-value')?.textContent) || 1;

  const t = translations[currentLang];

  if (!beatVal || !arrivalVal || !departureVal) {
    resultsEl.classList.remove('active');
    if (placeholderEl) placeholderEl.style.display = 'flex';
    return;
  }

  const nights = calculateNights(arrivalVal, departureVal);
  if (!nights.length) {
    resultsEl.classList.remove('active');
    if (placeholderEl) placeholderEl.style.display = 'flex';
    return;
  }

  resultsEl.classList.add('active');
  if (placeholderEl) placeholderEl.style.display = 'none';

  const nightCount = nights.length;
  const nightWord = nightCount === 1 ? t['booking.night'] : t['booking.nights'];

  // Date summary
  const dateSummary = document.getElementById('result-dates');
  if (dateSummary) {
    dateSummary.textContent = `${nightCount} ${nightWord}: ${formatDateDisplay(arrivalVal)} – ${formatDateDisplay(departureVal)}`;
  }

  // Group nights by period
  const grouped = {};
  nights.forEach(n => {
    if (!grouped[n.period]) grouped[n.period] = { rate: n.rate, count: 0 };
    grouped[n.period].count++;
  });

  // Badges
  const badgeWrap = document.getElementById('season-badges');
  if (badgeWrap) {
    badgeWrap.innerHTML = '';
    const periods = Object.keys(grouped);
    periods.forEach(p => {
      if (p === 'early' || p === 'peak' || p === 'late') {
        const span = document.createElement('span');
        span.className = `season-badge ${p}`;
        span.textContent = t[`badge.${p}`] || '';
        badgeWrap.appendChild(span);
      }
    });
  }

  // Breakdown
  const breakdownEl = document.getElementById('price-breakdown');
  if (breakdownEl) {
    breakdownEl.innerHTML = '';
    Object.entries(grouped).forEach(([period, data]) => {
      const subtotal = data.rate * rods * data.count;
      const row = document.createElement('div');
      row.className = 'breakdown-row';
      const periodNightWord = data.count === 1 ? t['booking.night'] : t['booking.nights'];
      row.innerHTML = `
        <span class="breakdown-label">${t['rate.' + period]} — ${data.count} ${periodNightWord} × ${rods} stg × ${data.rate.toLocaleString('nb-NO')} kr</span>
        <span class="breakdown-value">${formatNOK(subtotal)}</span>
      `;
      breakdownEl.appendChild(row);
    });
  }

  // Totals
  const total = nights.reduce((sum, n) => sum + n.rate * rods, 0);
  const deposit = Math.round(total * 0.3);
  const remaining = total - deposit;

  const totalEl = document.getElementById('result-total');
  const depositEl = document.getElementById('result-deposit');
  const remainingEl = document.getElementById('result-remaining');
  const totalLabelEl = document.getElementById('result-total-label');
  const depositLabelEl = document.getElementById('result-deposit-label');
  const remainingLabelEl = document.getElementById('result-remaining-label');

  if (totalEl) totalEl.textContent = formatNOK(total);
  if (depositEl) depositEl.textContent = formatNOK(deposit);
  if (remainingEl) remainingEl.textContent = formatNOK(remaining);
  if (totalLabelEl) totalLabelEl.textContent = t['booking.subtotal'];
  if (depositLabelEl) depositLabelEl.textContent = t['booking.deposit'];
  if (remainingLabelEl) remainingLabelEl.textContent = t['booking.remaining'];

  console.log('Booking:', { beat: beatVal, arrival: arrivalVal, departure: departureVal, rods, total, deposit, remaining });
}

function initBooking() {
  const beatSelect = document.getElementById('booking-beat');
  const arrivalInput = document.getElementById('booking-arrival');
  const departureInput = document.getElementById('booking-departure');
  const rodsMinus = document.getElementById('rods-minus');
  const rodsPlus = document.getElementById('rods-plus');
  const rodsValue = document.getElementById('rods-value');

  if (!beatSelect) return;

  const year = new Date().getFullYear();
  const seasonMin = `${year}-05-15`;
  const seasonMax = `${year}-09-15`;

  // Set date constraints
  if (arrivalInput) {
    arrivalInput.min = seasonMin;
    arrivalInput.max = `${year}-09-14`;
  }
  if (departureInput) {
    departureInput.min = `${year}-05-16`;
    departureInput.max = seasonMax;
  }

  // Pre-fill arrival date and show notice when currently off-season
  const { offSeason, before } = getSeasonStatus();
  if (offSeason) {
    const fillYear = before ? new Date().getFullYear() : new Date().getFullYear() + 1;
    if (arrivalInput && !arrivalInput.value) {
      arrivalInput.value = `${fillYear}-05-15`;
      if (departureInput) departureInput.min = `${fillYear}-05-16`;
    }
  }
  updateOffseasonNotice();

  // Re-run notice + error text on language toggle
  document.querySelectorAll('#lang-toggle, #lang-toggle-mobile').forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
      updateOffseasonNotice();
      if (arrivalInput && arrivalInput.value) validateDateInput(arrivalInput, 'arrival-error');
      if (departureInput && departureInput.value) validateDateInput(departureInput, 'departure-error');
    });
  });

  let maxRods = 4;
  let currentRods = 1;

  function updateStepper() {
    if (rodsValue) rodsValue.textContent = currentRods;
    if (rodsMinus) rodsMinus.disabled = currentRods <= 1;
    if (rodsPlus) rodsPlus.disabled = currentRods >= maxRods;
  }

  // Beat change
  beatSelect.addEventListener('change', () => {
    const beat = BEATS[beatSelect.value];
    if (beat) {
      maxRods = beat.maxRods;
      if (currentRods > maxRods) currentRods = maxRods;
      updateStepper();
    }
    updateBookingDisplay();
  });

  // Arrival change
  if (arrivalInput) {
    arrivalInput.addEventListener('change', () => {
      validateDateInput(arrivalInput, 'arrival-error');
      if (arrivalInput.value) {
        const nextDay = new Date(arrivalInput.value + 'T12:00:00');
        nextDay.setDate(nextDay.getDate() + 1);
        const nextStr = nextDay.toISOString().split('T')[0];
        if (departureInput) {
          departureInput.min = nextStr;
          if (departureInput.value && departureInput.value <= arrivalInput.value) {
            departureInput.value = nextStr;
          }
        }
      }
      updateBookingDisplay();
    });
  }

  if (departureInput) {
    departureInput.addEventListener('change', () => {
      validateDateInput(departureInput, 'departure-error');
      updateBookingDisplay();
    });
  }

  // Stepper
  if (rodsMinus) rodsMinus.addEventListener('click', () => {
    if (currentRods > 1) { currentRods--; updateStepper(); updateBookingDisplay(); }
  });
  if (rodsPlus) rodsPlus.addEventListener('click', () => {
    if (currentRods < maxRods) { currentRods++; updateStepper(); updateBookingDisplay(); }
  });

  updateStepper();
}

// === BEAT CARD BOOK BUTTONS ===
function initBeatBookLinks() {
  document.querySelectorAll('.btn-beat[data-beat]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const beat = btn.getAttribute('data-beat');
      const bookingSection = document.getElementById('booking');
      const beatSelect = document.getElementById('booking-beat');

      if (beatSelect && beat) {
        beatSelect.value = beat;
        beatSelect.dispatchEvent(new Event('change'));
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // On other pages, navigate to booking page
        window.location.href = `booking.html?beat=${beat}`;
      }
    });
  });
}

// Handle pre-selected beat from URL parameter (for booking.html)
function initBeatFromURL() {
  const params = new URLSearchParams(window.location.search);
  const beat = params.get('beat');
  if (beat) {
    const beatSelect = document.getElementById('booking-beat');
    if (beatSelect) {
      beatSelect.value = beat;
      beatSelect.dispatchEvent(new Event('change'));
    }
  }
}
