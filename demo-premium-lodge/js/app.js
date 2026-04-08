// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  if (typeof Auth !== 'undefined') Auth.applyNavState();
  initNav();
  if (typeof initStickyBar === 'function') initStickyBar();
  if (typeof initScrollAnimations === 'function') initScrollAnimations();
  if (typeof initScrollTop === 'function') initScrollTop();
  if (typeof initBooking === 'function') initBooking();
  if (typeof initModal === 'function') initModal();
  if (typeof initBeatBookLinks === 'function') initBeatBookLinks();
  if (typeof initBeatFromURL === 'function') initBeatFromURL();
  if (typeof initStatsCounter === 'function') initStatsCounter();
  if (typeof initGallerySelector === 'function') initGallerySelector();
  if (typeof initAboutPhotoGrid === 'function') initAboutPhotoGrid();
  if (typeof initBookingCheckoutGate === 'function') initBookingCheckoutGate();
  if (typeof initDashboard === 'function') initDashboard();
});

// === ABOUT PHOTO GRID — click to toggle color ===
function initAboutPhotoGrid() {
  const items = document.querySelectorAll('.about-photo-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}
