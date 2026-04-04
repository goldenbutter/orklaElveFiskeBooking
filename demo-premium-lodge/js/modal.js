// === VIPPS MODAL ===
function initModal() {
  const overlay = document.getElementById('vipps-modal');
  const closeBtn = document.getElementById('modal-close');
  const vippsBtn = document.getElementById('vipps-btn');

  if (!overlay) return;

  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (vippsBtn) vippsBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}
