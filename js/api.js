/* ============================================================
   SwimWithSmile — API клиент
   Комуникира с ASP.NET Core Web API.
   Base URL се пази в localStorage, за да можеш да го смениш
   към Azure адреса без промяна на кода.
   ============================================================ */

const API = (() => {
  const LS_BASE = 'sws.apiBase';
  const LS_TOKEN = 'sws.token';
  const LS_USER = 'sws.user';

  // Работим директно със сървъра в Azure (облачна база + блоб).
  const DEFAULT_BASE = 'https://swimwithsmile.azurewebsites.net';

  // Еднократно почистване: ако е останал запазен локален адрес от тестовете,
  // го махаме, за да сочим към облака по подразбиране.
  (() => {
    const s = localStorage.getItem(LS_BASE);
    if (s && /localhost|127\.0\.0\.1/.test(s)) localStorage.removeItem(LS_BASE);
  })();

  const getBase = () => localStorage.getItem(LS_BASE) || DEFAULT_BASE;
  const setBase = (v) => localStorage.setItem(LS_BASE, v.replace(/\/+$/, ''));

  const getToken = () => localStorage.getItem(LS_TOKEN);
  const setToken = (t) => t ? localStorage.setItem(LS_TOKEN, t) : localStorage.removeItem(LS_TOKEN);

  const getUser = () => { try { return JSON.parse(localStorage.getItem(LS_USER)); } catch { return null; } };
  const setUser = (u) => u ? localStorage.setItem(LS_USER, JSON.stringify(u)) : localStorage.removeItem(LS_USER);

  async function request(method, path, body, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`;

    let res;
    try {
      res = await fetch(getBase() + path, {
        method,
        headers,
        cache: 'no-store', // винаги свежи данни, без кеширан стар отговор
        body: body != null ? JSON.stringify(body) : undefined
      });
    } catch (e) {
      throw new ApiError(0, 'Няма връзка със сървъра. Провери адреса на API и дали е стартиран.');
    }

    if (res.status === 401 && auth) {
      setToken(null); setUser(null);
      throw new ApiError(401, 'Сесията изтече. Влез отново.');
    }

    if (!res.ok) {
      let msg = `Грешка ${res.status}`;
      try { const j = await res.json(); if (j.message) msg = j.message; } catch {}
      throw new ApiError(res.status, msg);
    }

    if (res.status === 204) return null;
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  class ApiError extends Error {
    constructor(status, message) { super(message); this.status = status; }
  }

  const get = (p) => request('GET', p);
  const post = (p, b, auth = true) => request('POST', p, b, auth);
  const put = (p, b) => request('PUT', p, b);
  const del = (p) => request('DELETE', p);

  return {
    ApiError, getBase, setBase, getToken, getUser,
    isAuthed: () => !!getToken(),

    // ---- Auth ----
    async login(email, password) {
      const r = await post('/api/auth/login', { email, password }, false);
      setToken(r.token); setUser({ id: r.coachId, name: r.fullName, email: r.email });
      return r;
    },
    logout() { setToken(null); setUser(null); },
    coaches: () => get('/api/auth/coaches'),
    createCoach: (dto) => post('/api/auth/coaches', dto),

    // ---- Снимки (качване от устройство) ----
    async uploadPhoto(file) {
      const fd = new FormData();
      fd.append('file', file);
      const headers = {};
      if (getToken()) headers['Authorization'] = `Bearer ${getToken()}`;
      let res;
      try { res = await fetch(getBase() + '/api/photos', { method: 'POST', headers, body: fd }); }
      catch { throw new ApiError(0, 'Няма връзка със сървъра при качването.'); }
      if (!res.ok) {
        let msg = 'Качването се провали.';
        try { const j = await res.json(); if (j.message) msg = j.message; } catch {}
        throw new ApiError(res.status, msg);
      }
      return res.json(); // { url, name }
    },

    // ---- Children ----
    children: (includeInactive = false) => get(`/api/children?includeInactive=${includeInactive}`),
    child: (id) => get(`/api/children/${id}`),
    createChild: (dto) => post('/api/children', dto),
    updateChild: (id, dto) => put(`/api/children/${id}`, dto),
    deleteChild: (id) => del(`/api/children/${id}`),
    regenerateCode: (id) => post(`/api/children/${id}/regenerate-code`),
    childHistory: (id) => get(`/api/children/${id}/history`),
    childProgress: (id) => get(`/api/children/${id}/progress`),
    childAchievements: (id) => get(`/api/children/${id}/achievements`),
    childCompetitions: (id) => get(`/api/children/${id}/competitions`),

    // ---- Sessions ----
    calendar: (y, m) => get(`/api/sessions/calendar?year=${y}&month=${m}`),
    sessions: (y, m) => get(`/api/sessions?year=${y}&month=${m}`),
    session: (id) => get(`/api/sessions/${id}`),
    createSession: (dto) => post('/api/sessions', dto),
    updateSession: (id, dto) => put(`/api/sessions/${id}`, dto),
    deleteSession: (id) => del(`/api/sessions/${id}`),
    upsertParticipant: (sid, dto) => put(`/api/sessions/${sid}/participants`, dto),
    removeParticipant: (sid, cid) => del(`/api/sessions/${sid}/participants/${cid}`),

    // ---- Progress ----
    createProgress: (dto) => post('/api/progress', dto),
    deleteProgress: (id) => del(`/api/progress/${id}`),

    // ---- Achievements ----
    achievements: (includeInactive = false) => get(`/api/achievements?includeInactive=${includeInactive}`),
    createAchievement: (dto) => post('/api/achievements', dto),
    updateAchievement: (id, dto) => put(`/api/achievements/${id}`, dto),
    deleteAchievement: (id) => del(`/api/achievements/${id}`),
    award: (dto) => post('/api/achievements/award', dto),
    removeAward: (id) => del(`/api/achievements/award/${id}`),

    // ---- Competitions ----
    createCompetition: (dto) => post('/api/competitions', dto),
    updateCompetition: (id, dto) => put(`/api/competitions/${id}`, dto),
    deleteCompetition: (id) => del(`/api/competitions/${id}`),

    // ---- Parent (публично) ----
    parentDashboard: (code, birthDate) => post('/api/parent/dashboard', { code, birthDate }, false),
  };
})();
