// === DATA STORE ===
// Single source of truth for all data access. Today this reads from the
// in-memory MOCK_BOOKINGS array and from localStorage. To migrate to a real
// backend (Supabase, Postgres, etc.) only this file needs to change — every
// caller already uses async/await, so the public API stays identical.

const DataStore = (function () {
  const USERS_KEY = 'users';

  // ----- Internal helpers -----
  function readUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Failed to parse users from localStorage', err);
      return [];
    }
  }

  function writeUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ----- Public API (all async to match a future backend) -----

  async function getBookings() {
    // Future Supabase swap:
    // const { data } = await supabase.from('bookings').select('*');
    // return data;
    return Array.isArray(MOCK_BOOKINGS) ? [...MOCK_BOOKINGS] : [];
  }

  async function getUsers() {
    return readUsers();
  }

  async function findUser(username) {
    const users = readUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  async function createUser({ username, password, name, email }) {
    const users = readUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('username_taken');
    }
    const newUser = {
      username,
      // DEMO ONLY — never store plaintext or trivial encoding in production.
      // Replace with Supabase Auth (or any real provider) before going live.
      passwordHash: btoa(password),
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
  }

  async function verifyUser(username, password) {
    const user = await findUser(username);
    if (!user) return null;
    if (user.passwordHash !== btoa(password)) return null;
    return user;
  }

  async function saveBooking(booking) {
    // Placeholder for future use — booking.html currently logs to console only.
    // When migrating to Supabase, insert into the bookings table here.
    console.log('[DataStore] saveBooking (demo, not persisted):', booking);
    return booking;
  }

  return {
    getBookings,
    getUsers,
    findUser,
    createUser,
    verifyUser,
    saveBooking
  };
})();

window.DataStore = DataStore;
