// === LANGUAGE SYSTEM ===
let currentLang = 'no';

function applyLanguage(lang) {
  currentLang = lang;

  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  // Alt attributes on images
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    const val = translations[lang][key];
    if (val !== undefined) el.setAttribute('alt', val);
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = translations[lang][key];
    if (val !== undefined) el.setAttribute('placeholder', val);
  });

  // Option elements inside selects
  document.querySelectorAll('option[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = translations[lang][key];
    if (val !== undefined) el.textContent = val;
  });

  document.documentElement.lang = lang === 'no' ? 'nb' : 'en';
  localStorage.setItem('lang', lang);

  // Re-render booking output if active
  updateBookingDisplay();
}

function initLanguage() {
  const saved = localStorage.getItem('lang') || 'no';
  applyLanguage(saved);

  const btn = document.getElementById('lang-toggle');
  const mobileBtn = document.getElementById('lang-toggle-mobile');

  if (btn) btn.addEventListener('click', () => {
    applyLanguage(currentLang === 'no' ? 'en' : 'no');
  });
  if (mobileBtn) mobileBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'no' ? 'en' : 'no');
  });
}
