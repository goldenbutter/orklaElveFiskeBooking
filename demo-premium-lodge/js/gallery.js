// === GALLERY INTERACTIVE SELECTOR ===
function initGallerySelector() {
  const container = document.querySelector('.gallery-selector');
  if (!container) return;

  const options = container.querySelectorAll('.gallery-option');
  if (!options.length) return;

  // Click to activate
  options.forEach(option => {
    option.addEventListener('click', () => {
      if (option.classList.contains('active')) return;
      options.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });

    // Keyboard support
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        option.click();
      }
    });
  });

  // Mark container so CSS hides items for animation
  container.classList.add('has-animation');

  // Staggered entrance animation on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      options.forEach((opt, i) => {
        setTimeout(() => {
          opt.classList.add('animated');
        }, 150 * i);
      });
    });
  }, { threshold: 0.1 });

  observer.observe(container);
}
