// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNav();
  initStickyBar();
  initScrollAnimations();
  initScrollTop();
  initBooking();
  initModal();
  initBeatBookLinks();
  initBeatFromURL();
  initStatsCounter();
  initGallerySelector();
  initAboutPhotoGrid();
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
