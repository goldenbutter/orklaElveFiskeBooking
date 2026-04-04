// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// === SCROLL TO TOP ===
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// === STATS COUNT-UP ===
function initStatsCounter() {
  const numbers = document.querySelectorAll('.stat-number[data-count-target]');
  if (!numbers.length) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const duration = 2000;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const el = entry.target;
      const target = parseInt(el.dataset.countTarget, 10);
      const suffix = el.dataset.countSuffix || '';
      const displayFinal = el.dataset.countDisplay || null;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = Math.round(eased * target);

        if (progress < 1) {
          el.textContent = current + suffix;
          requestAnimationFrame(tick);
        } else {
          el.textContent = displayFinal ? displayFinal + suffix : target + suffix;
        }
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  numbers.forEach(el => observer.observe(el));
}
