// === VIPPS MODAL ===
function openVippsModal() {
  const overlay = document.getElementById('vipps-modal');
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVippsModal() {
  const overlay = document.getElementById('vipps-modal');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initModal() {
  const overlay = document.getElementById('vipps-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  if (closeBtn) closeBtn.addEventListener('click', closeVippsModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeVippsModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeVippsModal();
  });
}

// === CHECKOUT GATE ===
// Vipps button requires the visitor to be logged in (or registered).
// If logged out, opens the auth modal first; on success continues to Vipps.
function initBookingCheckoutGate() {
  const vippsBtn = document.getElementById('vipps-btn');
  if (!vippsBtn || typeof Auth === 'undefined') return;

  vippsBtn.addEventListener('click', () => {
    const user = Auth.getUser();
    if (user) {
      openVippsModal();
    } else {
      Auth.openAuthModal('login', () => {
        openVippsModal();
      });
    }
  });
}
