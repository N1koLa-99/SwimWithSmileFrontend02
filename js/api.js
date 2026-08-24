/* ============================================================
   SwimWithSmile — API клиент (Google Apps Script + Google Sheet)
   ------------------------------------------------------------
   Вместо ASP.NET сървър, приложението говори с едно Google
   Apps Script Web App, което чете/пише в Google таблица.

   ➜ ВАЖНО: постави тук адреса на своя разгърнат Web App
     (Deploy → Web app → URL, който завършва на /exec):
   ============================================================ */

const API = (() => {
  const DEFAULT_BASE = 'https://script.google.com/macros/s/AKfycbxzpytpkyBXoKVI2kPtq7Axhj6pOQnlDzcvdLAimyyesSccO8ZhoiLmoGgGloocPoFWRw/exec';

  const LS_BASE  = 'sws.apiBase';
  const LS_TOKEN = 'sws.token';
  const LS_USER  = 'sws.user';

  const getBase = () => localStorage.getItem(LS_BASE) || DEFAULT_BASE;
  const setBase = (v) => localStorage.setItem(LS_BASE, String(v).replace(/\/+$/, ''));

  const getToken = () => localStorage.getItem(LS_TOKEN);
  const setToken = (t) => t ? localStorage.setItem(LS_TOKEN, t) : localStorage.removeItem(LS_TOKEN);

  const getUser = () => { try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; } };
  const setUser = (u) => u ? localStorage.setItem(LS_USER, JSON.stringify(u)) : localStorage.removeItem(LS_USER);

  class ApiError extends Error {
    constructor(status, message) { super(message); this.status = status; }
  }

  // Всичко минава през един POST. Content-Type: text/plain пести
  // CORS preflight, който Apps Script не обслужва добре.
  async function call(action, payload = {}, auth = true) {
    const base = getBase();
    if (!base || /ПОСТАВИ_ТУК/.test(base)) {
      throw new ApiError(0, 'Няма зададен адрес на сървъра. Отвори ⚙️ и постави адреса на Apps Script.');
    }
    const body = { action, payload };
    if (auth) body.token = getToken();

    let res;
    try {
      res = await fetch(base, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        cache: 'no-store',
        redirect: 'follow',
        body: JSON.stringify(body)
      });
    } catch (e) {
      throw new ApiError(0, 'Няма връзка със сървъра. Провери адреса на API (⚙️).');
    }

    let data;
    try { data = await res.json(); }
    catch { throw new ApiError(res.status || 0, 'Неочакван отговор от сървъра. Провери дали адресът завършва на /exec и че достъпът е „Anyone".'); }

    if (!data || data.ok !== true) {
      const status = (data && data.status) || res.status || 400;
      const msg = (data && data.message) || `Грешка ${status}`;
      if (status === 401 && auth) { setToken(null); setUser(null); }
      throw new ApiError(status, msg);
    }
    return data.data;
  }

  return {
    ApiError, getBase, setBase, getToken, getUser,
    isAuthed: () => !!getToken(),

    // ---- Auth ----
    async login(email, password) {
      const r = await call('login', { email, password }, false);
      setToken(r.token); setUser({ id: r.coachId, name: r.fullName, email: r.email });
      return r;
    },
    logout() { setToken(null); setUser(null); },
    coaches: () => call('coaches'),
    createCoach: (dto) => call('createCoach', { data: dto }),

    // ---- Children ----
    children: (includeInactive = false) => call('children', { includeInactive }),
    child: (id) => call('child', { id }),
    createChild: (dto) => call('createChild', { data: dto }),
    updateChild: (id, dto) => call('updateChild', { id, data: dto }),
    regenerateCode: (id) => call('regenerateCode', { id }),
    childHistory: (id) => call('childHistory', { id }),
    childProgress: (id) => call('childProgress', { id }),
    childAchievements: (id) => call('childAchievements', { id }),
    childCompetitions: (id) => call('childCompetitions', { id }),

    // ---- Sessions ----
    calendar: (y, m) => call('sessions', { year: y, month: m }),
    sessions: (y, m) => call('sessions', { year: y, month: m }),
    calendarEvents: (y, m) => call('calendarEvents', { year: y, month: m }),
    session: (id) => call('session', { id }),
    createSession: (dto) => call('createSession', { data: dto }),
    updateSession: (id, dto) => call('updateSession', { id, data: dto }),
    deleteSession: (id) => call('deleteSession', { id }),
    upsertParticipant: (sid, dto) => call('upsertParticipant', { sessionId: sid, data: dto }),
    removeParticipant: (sid, cid) => call('removeParticipant', { sessionId: sid, childId: cid }),

    // ---- Progress ----
    createProgress: (dto) => call('createProgress', { data: dto }),
    deleteProgress: (id) => call('deleteProgress', { id }),

    // ---- Achievements ----
    achievements: (includeInactive = false) => call('achievements', { includeInactive }),
    createAchievement: (dto) => call('createAchievement', { data: dto }),
    updateAchievement: (id, dto) => call('updateAchievement', { id, data: dto }),
    deleteAchievement: (id) => call('deleteAchievement', { id }),
    award: (dto) => call('award', { data: dto }),
    removeAward: (id) => call('removeAward', { id }),

    // ---- Competitions ----
    createCompetition: (dto) => call('createCompetition', { data: dto }),
    updateCompetition: (id, dto) => call('updateCompetition', { id, data: dto }),
    deleteCompetition: (id) => call('deleteCompetition', { id }),

    // ---- Parent (публично) ----
    parentDashboard: (code, birthDate) => call('parentDashboard', { code, birthDate }, false),
  };
})();
