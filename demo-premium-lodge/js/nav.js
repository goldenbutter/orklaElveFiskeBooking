// === STICKY BOOKING BAR ===
function initStickyBar() {
  const bar = document.getElementById('sticky-bar');
  const btn = document.getElementById('sticky-bar-btn');
  const bookingSection = document.getElementById('booking');
  const scrollTopBtn = document.getElementById('scroll-top');

  if (!bar || !bookingSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Booking section is in view — hide bar
        bar.classList.remove('visible');
        bar.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('sticky-bar-visible');
        if (scrollTopBtn) scrollTopBtn.style.bottom = '';
      } else {
        // Only show bar when booking section has scrolled above viewport
        if (entry.boundingClientRect.top < 0) {
          bar.classList.add('visible');
          bar.setAttribute('aria-hidden', 'false');
          document.body.classList.add('sticky-bar-visible');
          if (scrollTopBtn) scrollTopBtn.style.bottom = '5rem';
        } else {
          bar.classList.remove('visible');
          bar.setAttribute('aria-hidden', 'true');
          document.body.classList.remove('sticky-bar-visible');
          if (scrollTopBtn) scrollTopBtn.style.bottom = '';
        }
      }
    });
  }, { threshold: 0 });

  observer.observe(bookingSection);

  if (btn) {
    btn.addEventListener('click', () => {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// === NAVIGATION ===
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Active section highlighting via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[data-section], .mobile-menu a[data-section]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === id);
          });
        }
      });
    }, { threshold: 0.35 });

    sections.forEach(s => observer.observe(s));
  }
}
