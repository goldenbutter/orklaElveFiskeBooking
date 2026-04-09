// === AUTH SYSTEM (DEMO) ===
// Simulated auth backed by localStorage. Two roles:
//   - "customer": registered visitor, can complete checkout
//   - "admin":    beat owner, also sees the dashboard
// DEMO ONLY. In production, replace with a real auth provider (Supabase Auth,
// Auth0, Clerk, etc.). The API surface here mirrors what such a provider would
// expose, so swapping it out later is a single-file change.

const Auth = (function () {
  const SESSION_KEY = 'currentUser';

  // Hardcoded admin credentials so the demo viewer can log in immediately.
  // Documented in the dashboard top banner. Not a secret — this is a demo.
  const ADMIN = {
    username: 'owner',
    password: 'lodge2026',
    name: 'Tor Hagen',
    role: 'admin'
  };

  function getUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  async function login(username, password) {
    if (!username || !password) {
      throw new Error('missing_credentials');
    }

    // Admin check first
    if (
      username.toLowerCase() === ADMIN.username.toLowerCase() &&
      password === ADMIN.password
    ) {
      const session = { username: ADMIN.username, name: ADMIN.name, role: 'admin' };
      setSession(session);
      return session;
    }

    // Otherwise check customer accounts
    const user = await DataStore.verifyUser(username, password);
    if (!user) {
      throw new Error('invalid_credentials');
    }
    const session = { username: user.username, name: user.name, email: user.email, role: 'customer' };
    setSession(session);
    return session;
  }

  async function register({ username, password, name, email }) {
    if (!username || !password || !name || !email) {
      throw new Error('missing_fields');
    }
    const user = await DataStore.createUser({ username, password, name, email });
    const session = { username: user.username, name: user.name, email: user.email, role: 'customer' };
    setSession(session);
    return session;
  }

  function logout() {
    clearSession();
    // Reload current page so all role-gated UI resets
    window.location.reload();
  }

  function isAdmin() {
    const u = getUser();
    return !!u && u.role === 'admin';
  }

  function requireAdmin() {
    if (!isAdmin()) {
      window.location.href = 'index.html';
    }
  }

  // Renders the login/logout state into the nav and injects a Dashboard
  // link when the current user is an admin. Called from app.js on every page.
  function applyNavState() {
    const user = getUser();
    const t = (typeof translations !== 'undefined' && typeof currentLang !== 'undefined')
      ? translations[currentLang]
      : null;

    const txt = (key, fallback) => (t && t[key]) || fallback;

    // 1. Inject Dashboard link into desktop + mobile navs (admin only)
    document.querySelectorAll('.nav-links').forEach(ul => {
      const existing = ul.querySelector('.nav-dashboard-item');
      if (user && user.role === 'admin') {
        if (!existing) {
          const li = document.createElement('li');
          li.className = 'nav-dashboard-item';
          li.innerHTML = `<a href="dashboard.html" data-i18n="nav.dashboard">${txt('nav.dashboard', 'Dashboard')}</a>`;
          ul.appendChild(li);
        }
      } else if (existing) {
        existing.remove();
      }
    });

    document.querySelectorAll('.mobile-menu').forEach(menu => {
      const existing = menu.querySelector('.mobile-dashboard-link');
      if (user && user.role === 'admin') {
        if (!existing) {
          const link = document.createElement('a');
          link.href = 'dashboard.html';
          link.className = 'mobile-dashboard-link';
          link.setAttribute('data-i18n', 'nav.dashboard');
          link.textContent = txt('nav.dashboard', 'Dashboard');
          // Insert right after the static nav links, before the auth slot.
          // Falls back to before the language toggle, then append.
          const authSlot = menu.querySelector('#auth-nav-slot-mobile');
          const langBtn = menu.querySelector('.mobile-lang');
          if (authSlot) menu.insertBefore(link, authSlot);
          else if (langBtn) menu.insertBefore(link, langBtn);
          else menu.appendChild(link);
        }
      } else if (existing) {
        existing.remove();
      }
    });

    // 2. Render the auth slot (login/register OR welcome + logout)
    document.querySelectorAll('#auth-nav-slot').forEach(slot => {
      slot.innerHTML = '';
      if (user) {
        const wrap = document.createElement('div');
        wrap.className = 'auth-nav-user';
        wrap.innerHTML = `
          <span class="auth-nav-name">${user.name || user.username}</span>
          <button class="auth-nav-logout" type="button" data-i18n="auth.logout">${txt('auth.logout', 'Logg ut')}</button>
        `;
        wrap.querySelector('.auth-nav-logout').addEventListener('click', logout);
        slot.appendChild(wrap);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'auth-nav-login';
        btn.setAttribute('data-i18n', 'auth.login');
        btn.textContent = txt('auth.login', 'Logg inn');
        btn.addEventListener('click', () => openAuthModal('login'));
        slot.appendChild(btn);
      }
    });

    // 3. Mobile slot (mirrors desktop)
    document.querySelectorAll('#auth-nav-slot-mobile').forEach(slot => {
      slot.innerHTML = '';
      if (user) {
        const wrap = document.createElement('div');
        wrap.className = 'auth-nav-user-mobile';
        wrap.innerHTML = `
          <span class="auth-nav-name">${user.name || user.username}</span>
          <button class="auth-nav-logout" type="button" data-i18n="auth.logout">${txt('auth.logout', 'Logg ut')}</button>
        `;
        wrap.querySelector('.auth-nav-logout').addEventListener('click', logout);
        slot.appendChild(wrap);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'auth-nav-login';
        btn.setAttribute('data-i18n', 'auth.login');
        btn.textContent = txt('auth.login', 'Logg inn');
        btn.addEventListener('click', () => openAuthModal('login'));
        slot.appendChild(btn);
      }
    });
  }

  // === AUTH MODAL CONTROL ===
  let pendingAfterLogin = null;

  function openAuthModal(initialTab = 'login', afterLoginCallback = null) {
    pendingAfterLogin = afterLoginCallback;
    let modal = document.getElementById('auth-modal');
    if (!modal) {
      modal = buildAuthModal();
      document.body.appendChild(modal);
    }
    setAuthTab(initialTab);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    clearAuthErrors();
  }

  function setAuthTab(tab) {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.dataset.tab = tab;
    modal.querySelectorAll('.auth-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    modal.querySelectorAll('.auth-form').forEach(form => {
      form.classList.toggle('active', form.dataset.tab === tab);
    });
    clearAuthErrors();
  }

  function clearAuthErrors() {
    document.querySelectorAll('.auth-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
  }

  function showAuthError(formTab, message) {
    const el = document.querySelector(`.auth-form[data-tab="${formTab}"] .auth-error`);
    if (el) {
      el.textContent = message;
      el.classList.add('visible');
    }
  }

  function buildAuthModal() {
    const t = (key, fallback) => {
      if (typeof translations !== 'undefined' && typeof currentLang !== 'undefined') {
        return translations[currentLang][key] || fallback;
      }
      return fallback;
    };

    const overlay = document.createElement('div');
    overlay.id = 'auth-modal';
    overlay.className = 'modal-overlay auth-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="modal-box auth-modal-box">
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab active" data-tab="login" type="button" data-i18n="auth.login">${t('auth.login', 'Logg inn')}</button>
          <button class="auth-tab" data-tab="register" type="button" data-i18n="auth.register">${t('auth.register', 'Registrer')}</button>
        </div>

        <form class="auth-form active" data-tab="login" novalidate>
          <h2 class="auth-form-title" data-i18n="auth.welcome">${t('auth.welcome', 'Velkommen tilbake')}</h2>

          <div class="auth-field">
            <label for="login-username" data-i18n="auth.username">${t('auth.username', 'Brukernavn')}</label>
            <input type="text" id="login-username" autocomplete="username" required />
          </div>
          <div class="auth-field">
            <label for="login-password" data-i18n="auth.password">${t('auth.password', 'Passord')}</label>
            <input type="password" id="login-password" autocomplete="current-password" required />
          </div>
          <p class="auth-error" aria-live="polite"></p>
          <button type="submit" class="auth-submit" data-i18n="auth.submit">${t('auth.submit', 'Fortsett')}</button>
          <p class="auth-switch">
            <span data-i18n="auth.noAccount">${t('auth.noAccount', 'Ny her?')}</span>
            <button type="button" class="auth-switch-btn" data-switch="register" data-i18n="auth.switchToRegister">${t('auth.switchToRegister', 'Opprett konto')}</button>
          </p>
          <p class="auth-demo-hint" data-i18n="auth.demoHint">${t('auth.demoHint', 'Demo eierkonto: owner / lodge2026')}</p>
        </form>

        <form class="auth-form" data-tab="register" novalidate>
          <h2 class="auth-form-title" data-i18n="auth.createAccount">${t('auth.createAccount', 'Opprett konto')}</h2>

          <div class="auth-field">
            <label for="reg-name" data-i18n="auth.name">${t('auth.name', 'Fullt navn')}</label>
            <input type="text" id="reg-name" autocomplete="name" required />
          </div>
          <div class="auth-field">
            <label for="reg-email" data-i18n="auth.email">${t('auth.email', 'E-post')}</label>
            <input type="email" id="reg-email" autocomplete="email" required />
          </div>
          <div class="auth-field">
            <label for="reg-username" data-i18n="auth.username">${t('auth.username', 'Brukernavn')}</label>
            <input type="text" id="reg-username" autocomplete="username" required />
          </div>
          <div class="auth-field">
            <label for="reg-password" data-i18n="auth.password">${t('auth.password', 'Passord')}</label>
            <input type="password" id="reg-password" autocomplete="new-password" required />
          </div>
          <p class="auth-error" aria-live="polite"></p>
          <button type="submit" class="auth-submit" data-i18n="auth.submit">${t('auth.submit', 'Fortsett')}</button>
          <p class="auth-switch">
            <span data-i18n="auth.haveAccount">${t('auth.haveAccount', 'Har du allerede en konto?')}</span>
            <button type="button" class="auth-switch-btn" data-switch="login" data-i18n="auth.switchToLogin">${t('auth.switchToLogin', 'Logg inn')}</button>
          </p>
        </form>

        <button class="auth-close" type="button" aria-label="Lukk">×</button>
      </div>
    `;

    // Wire interactions
    overlay.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => setAuthTab(tab.dataset.tab));
    });
    overlay.querySelectorAll('.auth-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => setAuthTab(btn.dataset.switch));
    });
    overlay.querySelector('.auth-close').addEventListener('click', closeAuthModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAuthModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeAuthModal();
    });

    // Login submit
    overlay.querySelector('.auth-form[data-tab="login"]').addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthErrors();
      const username = overlay.querySelector('#login-username').value.trim();
      const password = overlay.querySelector('#login-password').value;
      try {
        await login(username, password);
        closeAuthModal();
        const cb = pendingAfterLogin;
        pendingAfterLogin = null;
        if (cb) cb();
        else window.location.reload();
      } catch (err) {
        showAuthError('login', getErrorText(err.message));
      }
    });

    // Register submit
    overlay.querySelector('.auth-form[data-tab="register"]').addEventListener('submit', async (e) => {
      e.preventDefault();
      clearAuthErrors();
      const name = overlay.querySelector('#reg-name').value.trim();
      const email = overlay.querySelector('#reg-email').value.trim();
      const username = overlay.querySelector('#reg-username').value.trim();
      const password = overlay.querySelector('#reg-password').value;
      try {
        await register({ name, email, username, password });
        closeAuthModal();
        const cb = pendingAfterLogin;
        pendingAfterLogin = null;
        if (cb) cb();
        else window.location.reload();
      } catch (err) {
        showAuthError('register', getErrorText(err.message));
      }
    });

    return overlay;
  }

  function getErrorText(code) {
    const t = (typeof translations !== 'undefined' && typeof currentLang !== 'undefined')
      ? translations[currentLang]
      : {};
    const map = {
      missing_credentials: t['auth.error.missing'] || 'Fyll inn brukernavn og passord',
      missing_fields:      t['auth.error.fields']  || 'Alle felter er påkrevd',
      invalid_credentials: t['auth.error.invalid'] || 'Feil brukernavn eller passord',
      username_taken:      t['auth.error.taken']   || 'Brukernavnet er allerede tatt'
    };
    return map[code] || code;
  }

  // Re-apply nav text on language change
  window.addEventListener('langchange', () => {
    applyNavState();
  });

  return {
    getUser,
    isAdmin,
    requireAdmin,
    login,
    register,
    logout,
    applyNavState,
    openAuthModal,
    closeAuthModal
  };
})();

window.Auth = Auth;
