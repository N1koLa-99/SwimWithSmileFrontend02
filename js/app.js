/* ============================================================
   SwimWithSmile — Приложение (SPA)
   Vanilla JS · hash router · без build стъпка
   ============================================================ */
(() => {
  const app = document.getElementById('app');

  /* ---------- Икони (SVG) ---------- */
  const I = {
    wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6c1.5 0 2 1.5 3.5 1.5S7.5 6 9 6s2 1.5 3.5 1.5S14.5 6 16 6s2 1.5 3.5 1.5S21 6 22 6"/><path d="M2 12c1.5 0 2 1.5 3.5 1.5S7.5 12 9 12s2 1.5 3.5 1.5S14.5 12 16 12s2 1.5 3.5 1.5S21 12 22 12"/><path d="M2 18c1.5 0 2 1.5 3.5 1.5S7.5 18 9 18s2 1.5 3.5 1.5S14.5 18 16 18s2 1.5 3.5 1.5S21 18 22 18"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>',
    kids: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="7" r="4"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21c0-3-1.8-5.6-4.5-6.6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v4a6 6 0 0 1-12 0V4z"/><path d="M6 6H3v1a3 3 0 0 0 3 3M18 6h3v1a3 3 0 0 1-3 3M9 20h6M10 16h4l.5 4h-5z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6M6 12l6-6 6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v13M6 12l6 6 6-6"/></svg>',
  };

  /* ---------- Помощници ---------- */
  const MONTHS = ['януари','февруари','март','април','май','юни','юли','август','септември','октомври','ноември','декември'];
  const DOW = ['пн','вт','ср','чт','пт','сб','нд'];
  const MOODS = ['много добро','добро','неутрално','умора','лошо'];
  const MOOD_EMOJI = { 'много добро':'😄','добро':'🙂','неутрално':'😐','умора':'😴','лошо':'😢' };
  const GENDERS = ['момче','момиче','друго'];

  const esc = (s) => (s == null ? '' : String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const initials = (a, b) => ((a?.[0] || '') + (b?.[0] || '')).toUpperCase();
  const pad = (n) => String(n).padStart(2, '0');

  function fmtDate(d) {
    if (!d) return '';
    const dt = new Date(d);
    return `${dt.getDate()} ${MONTHS[dt.getMonth()].slice(0,3)} ${dt.getFullYear()}`;
  }
  function fmtTime(t) { return t ? String(t).slice(0,5) : ''; }
  function ageFrom(bd) {
    if (!bd) return '';
    const b = new Date(bd), n = new Date();
    let a = n.getFullYear() - b.getFullYear();
    if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
    return a;
  }
  // Локална дата (без изместване от часовата зона) за <input type="date">
  const toDateInput = (d) => { if (!d) return ''; const t = new Date(d); return `${t.getFullYear()}-${pad(t.getMonth()+1)}-${pad(t.getDate())}`; };

  /* ---------- Тост ---------- */
  function toast(msg, type = '') {
    const host = document.getElementById('toast-host');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const ico = type === 'ok' ? I.check : type === 'err' ? I.x : I.wave;
    el.innerHTML = `${ico}<span>${esc(msg)}</span>`;
    host.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(10px)'; el.style.transition = 'all .3s'; setTimeout(() => el.remove(), 300); }, 2800);
  }
  const err = (e) => {
    toast(e?.message || 'Възникна грешка', 'err');
    // Самолекуване: невалиден/изтекъл токен -> чистим и връщаме към вход
    if (e && e.status === 401) { try { API.logout(); } catch {} navigate('/login'); }
  };

  /* ---------- Модал ---------- */
  // Заключва скрола на фона зад модала. На iOS Safari overflow:hidden на body
  // не спира тъч-скрола отдолу, затова тялото се фиксира на текущата позиция.
  let _scrollLockY = 0, _scrollLocked = false;
  function lockScroll() {
    if (_scrollLocked) return;
    _scrollLocked = true;
    _scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${_scrollLockY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }
  function unlockScroll() {
    if (!_scrollLocked) return;
    _scrollLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, _scrollLockY);
  }
  function modal({ title, body, footer, large }) {
    const host = document.getElementById('modal-host');
    host.hidden = false;
    lockScroll();
    host.innerHTML = `
      <div class="modal-scrim" data-close></div>
      <div class="modal ${large ? 'modal-lg' : ''}" role="dialog" aria-modal="true">
        <div class="modal-head"><h3>${esc(title)}</h3><button class="x-btn" data-close aria-label="Затвори">${I.x}</button></div>
        <div class="modal-body">${body}</div>
        ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
      </div>`;
    $$('[data-close]', host).forEach(b => b.onclick = closeModal);
    return host;
  }
  function closeModal() { const h = document.getElementById('modal-host'); h.hidden = true; h.innerHTML = ''; unlockScroll(); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Рутер ---------- */
  const routes = [];
  const route = (re, handler) => routes.push({ re, handler });
  function navigate(hash) { location.hash = hash; }

  async function render() {
    const hash = location.hash.replace(/^#/, '') || '/';
    // защита: ако не е логнат треньор и не е родителски път
    for (const r of routes) {
      const m = hash.match(r.re);
      if (m) { try { await r.handler(...m.slice(1)); } catch (e) { err(e); if (e.status === 401) navigate('/login'); } return; }
    }
    navigate(API.isAuthed() ? '/app/calendar' : '/login');
  }
  window.addEventListener('hashchange', render);

  /* ============================================================
     ЕКРАН: ВХОД (треньор + родител)
     ============================================================ */
  route(/^\/login$/, () => {
    document.body.classList.remove('has-topbar');
    app.innerHTML = `
      <div class="aqua-bg"></div>
      <div class="auth">
        <aside class="auth-hero">
          <div class="auth-hero-in rise">
            <div class="brand-name" style="font-size:1.3rem;color:#fff;margin-bottom:18px">Swim<span style="color:var(--sky-200)">With</span>Smile</div>
            <h1 class="auth-h">Плувай<br>с усмивка</h1>
            <p class="auth-sub">Тренировки, картони и напредък на всяко дете — на едно място, красиво подредено.</p>
            <div class="auth-feats">
              <div class="feat">${I.cal}<span>График и тренировки</span></div>
              <div class="feat">${I.kids}<span>Картони на децата</span></div>
              <div class="feat">${I.trophy}<span>Постижения и награди</span></div>
            </div>
          </div>
          <div class="wave-deco">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="rgba(255,255,255,.14)" d="M0,64 C240,110 480,10 720,48 C960,86 1200,20 1440,60 L1440,120 L0,120 Z"/><path fill="rgba(255,255,255,.10)" d="M0,80 C240,40 480,110 720,74 C960,38 1200,100 1440,72 L1440,120 L0,120 Z"/></svg>
          </div>
        </aside>

        <main class="auth-panel">
          <button class="gear-btn" id="cfgBtn" title="Настройки на връзката">${I.gear}</button>
          <div class="auth-card rise">
            <div class="seg">
              <button class="seg-btn active" data-tab="coach">Треньор</button>
              <button class="seg-btn" data-tab="parent">Родител</button>
            </div>

            <form id="coachForm" class="auth-form">
              <h2>Добре дошъл 👋</h2>
              <p class="subtle" style="margin-bottom:18px">Влез, за да управляваш тренировките.</p>
              <div class="field"><label>Имейл</label><input class="input" name="email" type="email" placeholder="ime@example.com" required></div>
              <div class="field"><label>Парола</label><input class="input" name="password" type="password" placeholder="••••••••" required></div>
              <button class="btn btn-primary btn-block btn-lg" type="submit">Вход</button>
            </form>

            <form id="parentForm" class="auth-form" hidden>
              <h2>Родителски достъп</h2>
              <p class="subtle" style="margin-bottom:18px">Виж напредъка на детето си.</p>
              <div class="field"><label>Код от треньора (8 цифри)</label><input class="input" name="code" inputmode="numeric" maxlength="8" placeholder="12345678" required style="letter-spacing:5px;font-weight:700"></div>
              <div class="field"><label>Дата на раждане на детето</label><input class="input" name="birth" type="date" required></div>
              <button class="btn btn-sky btn-block btn-lg" type="submit">Виж детето</button>
            </form>
          </div>
        </main>
      </div>`;

    $$('.seg-btn').forEach(b => b.onclick = () => {
      $$('.seg-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const coach = b.dataset.tab === 'coach';
      $('#coachForm').hidden = !coach; $('#parentForm').hidden = coach;
    });

    $('#coachForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'Влизане…';
      try {
        const f = e.target;
        await API.login(f.email.value.trim(), f.password.value);
        toast('Здравей!', 'ok'); navigate('/app/calendar');
      } catch (ex) { err(ex); btn.disabled = false; btn.textContent = 'Вход'; }
    };

    $('#parentForm').onsubmit = async (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button'); btn.disabled = true; btn.textContent = 'Търсене…';
      try {
        const f = e.target;
        const data = await API.parentDashboard(f.code.value.trim(), f.birth.value);
        sessionStorage.setItem('sws.parent', JSON.stringify(data));
        navigate('/parent/view');
      } catch (ex) { err(ex); btn.disabled = false; btn.textContent = 'Виж детето'; }
    };

    $('#cfgBtn').onclick = openConfig;
  });

  function openConfig() {
    modal({
      title: 'Връзка към API',
      body: `<div class="field"><label>Адрес на сървъра (API)</label>
        <input class="input" id="apiBaseIn" value="${esc(API.getBase())}" placeholder="https://...">
        <span class="hint">Напр. локално: https://localhost:7174 · в Azure: адресът на твоя App Service.</span></div>`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="saveCfg">Запази</button>`
    });
    $('#saveCfg').onclick = () => { API.setBase($('#apiBaseIn').value.trim()); toast('Запазено', 'ok'); closeModal(); };
  }

  /* ============================================================
     ЧЕРУПКА (треньор) — топбар + навигация
     ============================================================ */
  function shell(active, content) {
    const u = API.getUser() || {};
    document.body.classList.add('has-topbar');
    const navItems = [
      { to: '/app/calendar', key: 'calendar', ico: I.cal, label: 'График' },
      { to: '/app/children', key: 'children', ico: I.kids, label: 'Деца' },
      { to: '/app/achievements', key: 'achievements', ico: I.trophy, label: 'Постижения' },
    ];
    const navLink = it => `<a href="#${it.to}" class="${active===it.key?'active':''}">${it.ico}<span>${it.label}</span></a>`;
    app.innerHTML = `
      <div class="aqua-bg"></div>
      <header class="topbar">
        <div class="brand">
          <div class="brand-name">Swim<span>With</span>Smile</div>
        </div>
        <nav class="nav">
          ${navItems.map(navLink).join('')}
        </nav>
        <div class="topbar-right">
          <div class="usr"><span class="nm">${esc(u.name || u.email || 'Треньор')}</span><div class="avatar">${esc(initials(u.name||'Т', ' '))}</div></div>
          <button class="btn-icon btn-ghost" id="logoutBtn" title="Изход">${I.logout}</button>
        </div>
      </header>
      <div class="wrap" id="view">${content}</div>
      <nav class="bottom-nav" aria-label="Основна навигация">
        ${navItems.map(navLink).join('')}
      </nav>`;
    $('#logoutBtn').onclick = () => {
      modal({
        title: 'Изход',
        body: `<p>Сигурни ли сте, че искате да излезете от профила си?</p>`,
        footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="confirmLogout">${I.logout} Изход</button>`
      });
      $('#confirmLogout').onclick = () => { closeModal(); API.logout(); navigate('/login'); };
    };
  }
  const guard = () => { if (!API.isAuthed()) { navigate('/login'); return false; } return true; };

  // Продължава в app.js (част 2)
  window.__SWS = { app, shell, guard, modal, closeModal, toast, err, navigate, render, route, routes,
    I, esc, $, $$, initials, fmtDate, fmtTime, ageFrom, toDateInput, MONTHS, DOW, MOODS, MOOD_EMOJI, GENDERS, pad };
})();

/* ============================================================
   ЧАСТ 2 — Треньорски изгледи + родителски изглед
   ============================================================ */
(() => {
  const S = window.__SWS;
  const { app, shell, guard, modal, closeModal, toast, err, navigate, route,
    I, esc, $, $$, initials, fmtDate, fmtTime, ageFrom, toDateInput,
    MONTHS, DOW, MOODS, MOOD_EMOJI, GENDERS, pad } = S;

  const loading = () => `<div class="stagger" style="display:grid;gap:14px">${'<div class="skel" style="height:74px"></div>'.repeat(4)}</div>`;
  const emptyState = (icon, title, sub) => `<div class="empty rise"><div class="ico">${icon}</div><h3>${esc(title)}</h3><p class="subtle">${esc(sub||'')}</p></div>`;

  /* ===================== ГРАФИК / КАЛЕНДАР ===================== */
  const now = new Date();
  const calState = { y: now.getFullYear(), m: now.getMonth() }; // m: 0-11

  // Цветове на треньорите (стабилни по ред на създаване)
  const COACH_PALETTE = ['#1F73E0', '#12805a', '#F5883C', '#8B5CF6', '#EF5F6B', '#14B8A6', '#EAB308', '#EC4899'];
  let _coachColors = null;
  async function ensureCoachColors() {
    if (_coachColors) return _coachColors;
    _coachColors = {};
    try {
      const coaches = await API.coaches() || [];
      coaches.forEach((c, i) => { _coachColors[c.id] = { name: c.fullName || c.email, color: COACH_PALETTE[i % COACH_PALETTE.length] }; });
    } catch {}
    return _coachColors;
  }
  const coachColor = (id) => (_coachColors && _coachColors[id] && _coachColors[id].color) || '#9DB2D6';

  route(/^\/app\/calendar$/, async () => {
    if (!guard()) return;
    shell('calendar', `
      <div class="page-head">
        <div><h1 class="pagettl">График</h1><p class="subtle hide-sm">Тренировки по дни</p></div>
        <button class="btn btn-primary" id="newSession">${I.plus} Нова тренировка</button>
      </div>
      <div class="card card-pad rise">
        <div class="cal-head">
          <div class="cal-nav">
            <button class="btn-icon btn-ghost" id="prevM" aria-label="Предишен месец">${I.chevL}</button>
          </div>
          <div class="cal-title" id="calTitle"></div>
          <div class="cal-nav">
            <button class="btn-icon btn-ghost" id="nextM" aria-label="Следващ месец">${I.chevR}</button>
          </div>
          <button class="btn btn-soft btn-sm" id="todayBtn" style="margin-left:auto">Днес</button>
        </div>
        <div id="calBody">${loading()}</div>
      </div>`);
    $('#newSession').onclick = () => sessionForm();
    $('#prevM').onclick = () => { calState.m--; if (calState.m<0){calState.m=11;calState.y--;} drawCalendar(); };
    $('#nextM').onclick = () => { calState.m++; if (calState.m>11){calState.m=0;calState.y++;} drawCalendar(); };
    $('#todayBtn').onclick = () => { calState.y=now.getFullYear(); calState.m=now.getMonth(); drawCalendar(); };
    drawCalendar();
  });

  let calRenderToken = 0;

  async function drawCalendar() {
    const myToken = ++calRenderToken;
    const t = $('#calTitle'); if (!t) return;
    t.textContent = `${MONTHS[calState.m]} ${calState.y}`;
    const body = $('#calBody'); body.innerHTML = loading();
    let list = [];
    try { list = await API.sessions(calState.y, calState.m + 1) || []; } catch (e) { err(e); }
    if (myToken !== calRenderToken) return; // потребителят вече е сменил месеца
    await ensureCoachColors();

    const byDay = {};
    list.forEach(s => { const d = new Date(s.sessionDate).getDate(); (byDay[d] ||= []).push(s); });

    const first = new Date(calState.y, calState.m, 1);
    const offset = (first.getDay() + 6) % 7; // понеделник = 0
    const days = new Date(calState.y, calState.m + 1, 0).getDate();
    const today = new Date();
    const isThisMonth = today.getFullYear() === calState.y && today.getMonth() === calState.m;

    let cells = DOW.map((d,i) => `<div class="cal-dow ${i>=5?'weekend':''}">${d}</div>`).join('');
    for (let i = 0; i < offset; i++) cells += `<div class="cal-cell empty"></div>`;
    const MAX_EV = 3;
    for (let d = 1; d <= days; d++) {
      const arr = (byDay[d] || []).slice().sort((a,b) => (a.startTime||'').localeCompare(b.startTime||''));
      const isToday = isThisMonth && today.getDate() === d;
      const dow = (offset + d - 1) % 7;
      const shown = arr.slice(0, MAX_EV);
      const rest = arr.length - shown.length;
      const events = shown.map(s => {
        const who = (s.coachName || 'Треньор').split(' ')[0];
        const cnt = s.participantCount || 0;
        const label = `${fmtTime(s.startTime)} ${who}${cnt ? ' · ' + cnt : ''}`;
        const title = `${fmtTime(s.startTime)} · ${s.coachName || 'Треньор'} · ${cnt} деца`;
        return `<div class="cal-ev" data-sid="${s.id}" style="background:${coachColor(s.coachId)}" title="${esc(title)}">${esc(label)}</div>`;
      }).join('') + (rest > 0 ? `<div class="cal-more">+${rest} още</div>` : '');
      cells += `<div class="cal-cell ${isToday?'today':''} ${dow>=5?'weekend':''}" data-day="${d}">
        <div class="cal-daynum">${d}</div>
        <div class="cal-events">${events}</div>
      </div>`;
    }
    const legend = Object.values(_coachColors || {}).map(cc => `<span class="legend-item"><span class="dot" style="background:${cc.color}"></span>${esc(cc.name)}</span>`).join('');
    body.innerHTML = `${legend ? `<div class="coach-legend">${legend}</div>` : ''}<div class="cal-grid">${cells}</div>`;
    $$('.cal-cell[data-day]', body).forEach(c => c.onclick = () => dayModal(+c.dataset.day, byDay[+c.dataset.day] || []));
    $$('.cal-ev[data-sid]', body).forEach(el => el.onclick = (e) => { e.stopPropagation(); sessionDetail(el.dataset.sid); });
  }

  // Обогатява клетките на календара с имената на децата (в стил Apple Calendar), без да блокира първото рисуване
  async function fillCalendarKidPills(list, myToken) {
    const withKids = list.filter(s => (s.participantCount || 0) > 0);
    if (!withKids.length) return;
    const details = await Promise.all(withKids.map(s => API.session(s.id).catch(() => null)));
    if (myToken !== calRenderToken) return;

    const byDay = {};
    details.forEach(full => {
      if (!full) return;
      const d = new Date(full.sessionDate).getDate();
      (byDay[d] ||= []).push(...(full.participants || []));
    });

    Object.entries(byDay).forEach(([d, participants]) => {
      const host = $(`.cal-events[data-events-for="${d}"]`);
      if (!host) return;
      const MAX = 3;
      const shown = participants.slice(0, MAX);
      const rest = participants.length - shown.length;
      host.innerHTML = shown.map(p => `<div class="cal-kid-pill ${p.attended===false?'absent':''}">${esc((p.childName||'').split(' ')[0])}</div>`).join('')
        + (rest > 0 ? `<div class="cal-more">+${rest}</div>` : '');
    });
  }

  function dayModal(day, sessions) {
    const dateStr = `${day} ${MONTHS[calState.m]} ${calState.y}`;
    const rows = sessions.length ? sessions.sort((a,b)=>a.startTime.localeCompare(b.startTime)).map(s => `
      <div class="slot" data-sid="${s.id}" style="border-left:5px solid ${coachColor(s.coachId)}">
        <div class="slot-time">${fmtTime(s.startTime)}</div>
        <div class="slot-main"><div class="t">${esc(s.coachName || 'Треньор')}</div>
          <div class="s">${s.location?esc(s.location)+' · ':''}${s.participantCount||0} деца</div></div>
        ${I.chevR}
      </div>`).join('') : emptyState(I.cal, 'Няма тренировки', 'Добави първата за този ден.');

    modal({ title: dateStr, body: `<div class="stagger" style="display:grid;gap:12px">${rows}</div>`,
      footer: `<button class="btn btn-ghost" data-close>Затвори</button><button class="btn btn-primary" id="addOnDay">${I.plus} Добави</button>` });
    $('#addOnDay').onclick = () => { closeModal(); sessionForm(null, new Date(calState.y, calState.m, day)); };
    $$('.slot[data-sid]').forEach(el => el.onclick = () => { closeModal(); sessionDetail(el.dataset.sid); });
  }

  // Списък с часове в 24-часов формат (06:00–22:00, на 15 минути)
  function timeOptions(selected) {
    let o = '';
    for (let mins = 6 * 60; mins <= 22 * 60; mins += 15) {
      const t = `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
      o += `<option value="${t}" ${t === selected ? 'selected' : ''}>${t}</option>`;
    }
    return o;
  }
  async function sessionForm(existing, presetDate) {
    let coaches = [];
    try { coaches = await API.coaches() || []; } catch {}
    const opts = coaches.map(c => `<option value="${c.id}" ${existing?.coachId===c.id?'selected':''}>${esc(c.fullName||c.email)}</option>`).join('');
    const d = existing ? toDateInput(existing.sessionDate) : (presetDate ? toDateInput(presetDate) : toDateInput(new Date()));
    modal({ title: existing ? 'Редакция на тренировка' : 'Нова тренировка', body: `
      <div class="grid-2">
        <div class="field"><label>Дата</label><input class="input" id="s_date" type="date" value="${d}"></div>
        <div class="field"><label>Час</label><select class="select" id="s_time">${timeOptions(existing?fmtTime(existing.startTime):'17:00')}</select></div>
      </div>
      <div class="field"><label>Треньор</label><select class="select" id="s_coach">${opts||'<option>Няма треньори</option>'}</select></div>
      <div class="field"><label>Място</label><input class="input" id="s_loc" placeholder="Басейн / зала" value="${esc(existing?.location||'')}"></div>
      <div class="field"><label>Бележки</label><textarea class="textarea" id="s_notes" placeholder="По желание">${esc(existing?.notes||'')}</textarea></div>`,
      footer: `${existing?`<button class="btn btn-danger" id="s_del">${I.trash}</button>`:''}
        <button class="btn btn-ghost" data-close>Отказ</button>
        <button class="btn btn-primary" id="s_save">${I.check} Запази</button>` });

    $('#s_save').onclick = async () => {
      const dto = { sessionDate: $('#s_date').value, startTime: $('#s_time').value + ':00',
        location: $('#s_loc').value.trim() || null, coachId: $('#s_coach').value, notes: $('#s_notes').value.trim() || null };
      try {
        if (existing) { await API.updateSession(existing.id, dto); toast('Обновено', 'ok'); }
        else { const r = await API.createSession(dto); toast('Създадено', 'ok'); closeModal(); drawCalendar(); return sessionDetail(r.id); }
        closeModal(); drawCalendar();
      } catch (e) { err(e); }
    };
    if (existing) $('#s_del').onclick = async () => { if (!confirm('Изтриване на тренировката?')) return;
      try { await API.deleteSession(existing.id); toast('Изтрито','ok'); closeModal(); drawCalendar(); } catch(e){ err(e);} };
  }

  async function sessionDetail(id) {
    modal({ title: 'Тренировка', body: loading(), large: true });
    let s, children = [];
    try { [s, children] = await Promise.all([API.session(id), API.children()]); }
    catch (e) { return err(e); }

    const present = new Set((s.participants||[]).map(p => p.childId));
    const addable = (children||[]).filter(c => !present.has(c.id));
    const childById = new Map((children||[]).map(c => [c.id, c]));

    const partRows = (s.participants||[]).map(p => participantRow(p, childById.get(p.childId))).join('');
    const body = `
      <div class="card-pad" style="padding:0">
        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:18px">
          <span class="chip">${I.clock}&nbsp;${fmtTime(s.startTime)}</span>
          <span class="chip">${I.cal}&nbsp;${fmtDate(s.sessionDate)}</span>
          ${s.location?`<span class="chip">${I.pin}&nbsp;${esc(s.location)}</span>`:''}
          <span class="chip">${esc(s.coachName||'Треньор')}</span>
          <button class="btn btn-ghost btn-sm" id="editSess" style="margin-left:auto">${I.edit} Редакция</button>
        </div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <strong style="font-family:var(--font-head)">Деца на тренировката</strong>
          ${addable.length?`<select class="select" id="addChild" style="margin-left:auto;max-width:220px"><option value="">+ Добави дете…</option>${addable.map(c=>`<option value="${c.id}">${esc(c.firstName+' '+c.lastName)}</option>`).join('')}</select>`:''}
        </div>
        <div id="partList" class="stagger" style="display:grid;gap:12px">${partRows || emptyState(I.kids,'Още няма деца','Добави от менюто горе.')}</div>
      </div>`;
    $('.modal-body').innerHTML = body;

    $('#editSess').onclick = () => sessionForm(s);
    const addSel = $('#addChild');
    if (addSel) addSel.onchange = async () => {
      const cid = addSel.value; if (!cid) return;
      try { await API.upsertParticipant(id, { childId: cid, attended: true, swamWhat: null, dailyProgress: null, mood: null });
        toast('Добавено','ok'); sessionDetail(id); drawCalendar(); refreshChildTab(); } catch(e){ err(e); }
    };
    bindParticipants(id);
  }

  function participantRow(p, child) {
    const ph = child?.photoUrl
      ? `<img src="${esc(child.photoUrl)}" alt="">`
      : `<span>${initials(p.childName?.split(' ')[0], p.childName?.split(' ')[1])}</span>`;
    return `<div class="part-card" data-cid="${p.childId}">
      <div class="part-head">
        <div class="part-avatar">${ph}</div>
        <div class="part-name">${esc(p.childName)}</div>
        <div class="att-seg" data-att data-val="${p.attended?'1':'0'}">
          <button type="button" class="att-opt yes ${p.attended?'on':''}" data-v="1">${I.check} Присъства</button>
          <button type="button" class="att-opt no ${!p.attended?'on':''}" data-v="0">Отсъства</button>
        </div>
        <button class="x-btn" data-remove title="Махни">${I.trash}</button>
      </div>
      <div class="field" style="margin:0 0 14px"><label>Какво плува</label>
        <textarea class="textarea textarea-lg" data-swam placeholder="напр. 6x25 крака гръб, дишане настрани…">${esc(p.swamWhat||'')}</textarea></div>
      <div class="field" style="margin:0 0 14px"><label>Настроение</label><select class="select" data-mood>
        <option value="">—</option>${MOODS.map(m=>`<option ${p.mood===m?'selected':''} value="${m}">${MOOD_EMOJI[m]} ${m}</option>`).join('')}</select></div>
      <div class="field" style="margin:0"><label>Прогрес за деня</label><textarea class="textarea textarea-lg" data-prog placeholder="Какво постигнахме днес…">${esc(p.dailyProgress||'')}</textarea></div>
      <button class="btn btn-sky btn-sm" data-save style="margin-top:14px">${I.check} Запази</button>
    </div>`;
  }

  function bindParticipants(sessionId) {
    $$('#partList [data-cid]').forEach(row => {
      const cid = row.dataset.cid;
      const attSeg = row.querySelector('[data-att]');
      attSeg.querySelectorAll('.att-opt').forEach(b => b.onclick = () => {
        attSeg.dataset.val = b.dataset.v;
        attSeg.querySelectorAll('.att-opt').forEach(x => x.classList.toggle('on', x.dataset.v === attSeg.dataset.val));
      });
      row.querySelector('[data-remove]').onclick = async () => {
        try { await API.removeParticipant(sessionId, cid); toast('Махнато','ok'); sessionDetail(sessionId); drawCalendar(); refreshChildTab(); } catch(e){ err(e); }
      };
      row.querySelector('[data-save]').onclick = async (ev) => {
        const btn = ev.currentTarget; btn.disabled = true;
        const dto = { childId: cid, attended: attSeg.dataset.val === '1',
          swamWhat: row.querySelector('[data-swam]').value.trim() || null,
          dailyProgress: row.querySelector('[data-prog]').value.trim() || null,
          mood: row.querySelector('[data-mood]').value || null };
        try {
          await API.upsertParticipant(sessionId, dto);
          toast('Запазено', 'ok');
          drawCalendar();
          refreshChildTab();
          sessionDetail(sessionId); // презарежда картона с реалното състояние от сървъра, за да е сигурно, че се е записало
        } catch (e) { btn.disabled = false; err(e); }
      };
    });
  }

  /* ===================== ДЕЦА ===================== */
  route(/^\/app\/children$/, async () => {
    if (!guard()) return;
    shell('children', `
      <div class="page-head">
        <div><h1 class="pagettl">Деца</h1><p class="subtle">Картони и напредък</p></div>
        <button class="btn btn-primary" id="newChild">${I.plus} Ново дете</button>
      </div>
      <div id="kids">${loading()}</div>`);
    $('#newChild').onclick = () => childForm();
    try {
      const kids = await API.children();
      const host = $('#kids');
      if (!kids.length) { host.innerHTML = emptyState(I.kids, 'Още няма деца', 'Добави първото дете.'); return; }
      host.innerHTML = `<div class="kid-grid stagger">${kids.map(kidCard).join('')}</div>`;
      $$('.kid[data-id]').forEach(el => el.onclick = () => navigate('/app/child/' + el.dataset.id));
    } catch (e) { err(e); }
  });

  function kidCard(k) {
    const ph = k.photoUrl ? `<img src="${esc(k.photoUrl)}" alt="">` : `<div class="ph">${initials(k.firstName,k.lastName)}</div>`;
    return `<div class="kid" data-id="${k.id}">
      <div class="kid-photo">${ph}</div>
      <div class="kid-body">
        <div class="kid-name">${esc(k.firstName)} ${esc(k.lastName)}</div>
        <div class="kid-meta">
          <span class="badge">${ageFrom(k.birthDate)} г.</span>
          ${k.level?`<span class="badge">${esc(k.level)}</span>`:''}
        </div>
      </div></div>`;
  }

  /* ===================== ПРОФИЛ НА ДЕТЕ ===================== */
  const profileTab = { cur: 'card' };
  let _currentChild = null;
  // Обновява активния таб на отворения картон (напр. след промяна на присъствие)
  function refreshChildTab() {
    if (_currentChild && document.getElementById('tabView') && ['sessions','history'].includes(profileTab.cur))
      renderTab(profileTab.cur, _currentChild);
  }
  route(/^\/app\/child\/([\w-]+)$/, async (id) => {
    if (!guard()) return;
    shell('children', `<div id="prof">${loading()}</div>`);
    let child;
    try { child = await API.child(id); } catch (e) { return err(e); }
    if (!child) return;
    _currentChild = child;
    const ph = child.photoUrl ? `<img class="profile-avatar" src="${esc(child.photoUrl)}" alt="">`
      : `<div class="profile-avatar ph">${initials(child.firstName,child.lastName)}</div>`;
    $('#prof').innerHTML = `
      <a href="#/app/children" class="btn btn-ghost btn-sm" style="margin-bottom:18px">${I.chevL} Всички деца</a>
      <div class="profile-head rise">
        ${ph}
        <div class="profile-info">
          <h1>${esc(child.firstName)} ${esc(child.lastName)}</h1>
          <div class="row">
            <span class="badge">${ageFrom(child.birthDate)} години</span>
            ${child.gender?`<span class="badge">${esc(child.gender)}</span>`:''}
            ${child.level?`<span class="badge">${esc(child.level)}</span>`:''}
            <span class="badge badge-code">${esc(child.parentCode||'—')}</span>
          </div>
        </div>
      </div>
      <div class="tabs" id="tabs">
        <button class="tab" data-t="card">Картон</button>
        <button class="tab" data-t="sessions">Тренировки</button>
        <button class="tab" data-t="progress">Напредък</button>
        <button class="tab" data-t="ach">Постижения</button>
        <button class="tab" data-t="history">История</button>
        <button class="tab" data-t="comp">Състезания</button>
      </div>
      <div id="tabView"></div>`;

    const setTab = (t) => { profileTab.cur = t; $$('#tabs .tab').forEach(x=>x.classList.toggle('active', x.dataset.t===t)); renderTab(t, child); };
    $$('#tabs .tab').forEach(b => b.onclick = () => setTab(b.dataset.t));
    setTab(profileTab.cur || 'card');
  });

  async function renderTab(t, child) {
    const host = $('#tabView'); host.innerHTML = loading();
    try {
      if (t === 'card') { host.innerHTML = cardTab(child); bindCardTab(child); }
      else if (t === 'sessions') { host.innerHTML = await sessionsTab(child); bindSessionsTab(child); }
      else if (t === 'progress') {
        host.innerHTML = await progressTab(child);
        bindProg(child);
        $$('.prog-fill').forEach(f => setTimeout(() => f.style.width = f.dataset.w + '%', 60));
      }
      else if (t === 'ach') { host.innerHTML = await achTab(child); bindAchTab(child); }
      else if (t === 'history') {
        host.innerHTML = await historyTab(child);
        const me = (API.getUser() || {}).name || '';
        const sel = $('#histDate'); if (sel) sel.onchange = () => renderHistoryRows(sel.value, me);
      }
      else if (t === 'comp') { host.innerHTML = await compTab(child); bindCompTab(child); }
    } catch (e) { err(e); }
  }

  function infoItem(k, v) { return `<div class="info-item"><div class="k">${esc(k)}</div><div class="v ${v?'':'no-data'}">${v?esc(v):'Няма въведени данни'}</div></div>`; }
  function cardTab(c) {
    const section = (icon, title, items) => `
      <div class="card-section">
        <div class="card-section-title"><span class="ico">${icon}</span>${title}</div>
        <div class="info-grid">${items}</div>
      </div>`;
    return `<div class="card card-pad rise">
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:22px">
        <button class="btn btn-primary btn-sm" id="editChild">${I.edit} Редакция</button>
        <button class="btn btn-ghost btn-sm" id="regen">Нов родителски код</button>
      </div>
      ${section(I.kids, 'Основна информация',
        infoItem('Дата на раждане', fmtDate(c.birthDate)) +
        infoItem('Възраст', ageFrom(c.birthDate) + ' години') +
        infoItem('Пол', c.gender) +
        infoItem('Ниво', c.level) +
        infoItem('Начало на тренировки', c.trainingStartDate ? fmtDate(c.trainingStartDate) : '—'))}
      ${section(I.heart, 'Здравна информация',
        infoItem('Диагноза', c.diagnosis) +
        infoItem('Обективно състояние', c.objectiveCondition) +
        infoItem('Алергии / медицински', c.allergiesMedical))}
      ${section(I.pin, 'Контакти',
        infoItem('Контакт на родител', c.parentContact) +
        infoItem('Спешен контакт', c.emergencyContact))}
      ${section(I.trophy, 'Цели и бележки',
        infoItem('Цели', c.goals) +
        infoItem('Бележки', c.notes))}
    </div>`;
  }
  function bindCardTab(c) {
    $('#editChild').onclick = () => childForm(c);
    $('#regen').onclick = async () => { if (!confirm('Да генерирам нов код? Старият спира да работи.')) return;
      try { const r = await API.regenerateCode(c.id); toast('Нов код: ' + r.parentCode, 'ok'); c.parentCode = r.parentCode; navigate('/app/child/'+c.id); render(); } catch(e){ err(e); } };
  }

  // Индикатор за тенденция спрямо предната карта — зелена стрелка нагоре при подобрение, червена надолу при спад
  function trend(v, pv, suffix = '%') {
    if (v == null || pv == null || v === pv) return '';
    const up = v > pv;
    const diff = Math.abs(v - pv);
    return `<span class="trend ${up?'trend-up':'trend-down'}" title="${up?'Подобрение':'Спад'} спрямо предната карта (${up?'+':'-'}${diff}${suffix})">${up?I.up:I.down}${diff}${suffix}</span>`;
  }
  async function progressTab(c) {
    const list = await API.childProgress(c.id) || [];
    const add = `<button class="btn btn-primary btn-sm" id="addProg" style="margin-bottom:16px">${I.plus} Нова карта за напредък</button>`;
    if (!list.length) return add + emptyState(I.trophy, 'Няма карти за напредък', 'Създай първата.');
    const legend = list.length > 1 ? `<div class="trend-legend">
        <span class="trend trend-up">${I.up}<b>подобрение</b></span>
        <span class="trend trend-down">${I.down}<b>спад</b></span>
        <span class="subtle">спрямо предната карта</span>
      </div>` : '';
    const cards = list.map((p, i) => {
      const prev = list[i + 1] || null; // предната (по-стара) карта
      const bar = (lbl, v, pv) => v==null?'':`<div class="prog-row"><div class="prog-top"><span>${lbl}</span><span class="val">${v}% ${trend(v,pv,'%')}</span></div><div class="prog-track"><div class="prog-fill" data-w="${v}"></div></div></div>`;
      const dots = (lbl, v, pv) => v==null?'':`<div style="display:flex;justify-content:space-between;align-items:center;margin:6px 0"><span>${lbl}</span><span style="display:flex;align-items:center;gap:8px">${trend(v,pv,'')}${ratingDots(v)}</span></div>`;
      return `<div class="card card-pad" style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:14px"><strong style="font-family:var(--font-head)">${esc(p.periodLabel||'Оценка')}</strong><span class="subtle">${fmtDate(p.assessmentDate)}</span></div>
        ${bar('Сила',p.physStrength,prev?.physStrength)}${bar('Гъвкавост',p.physFlexibility,prev?.physFlexibility)}${bar('Издръжливост',p.physEndurance,prev?.physEndurance)}${bar('Координация',p.physCoordination,prev?.physCoordination)}
        <div style="margin-top:10px">${dots('Работа в екип',p.teamwork,prev?.teamwork)}${dots('Дисциплина',p.discipline,prev?.discipline)}${dots('Мотивация',p.motivation,prev?.motivation)}${dots('Концентрация',p.concentration,prev?.concentration)}</div>
        ${p.nextGoals?`<hr class="divider"><div class="info-item"><div class="k">Цели за следващия период</div><div class="v">${esc(p.nextGoals)}</div></div>`:''}
        ${p.coachNotes?`<div class="info-item" style="margin-top:10px"><div class="k">Бележки</div><div class="v">${esc(p.coachNotes)}</div></div>`:''}
      </div>`;
    }).join('');
    return add + legend + `<div class="stagger">${cards}</div>`;
  }
  const ratingDots = (v) => `<span class="rate">${[1,2,3,4,5].map(i=>`<span class="d ${i<=v?'on-'+v:''}"></span>`).join('')}</span>`;
  function bindProg(c){ const b=$('#addProg'); if(b) b.onclick=()=>progressForm(c); }

  async function achTab(c) {
    const list = await API.childAchievements(c.id) || [];
    const add = `<button class="btn btn-primary btn-sm" id="awardBtn" style="margin-bottom:16px">${I.trophy} Дай постижение</button>`;
    if (!list.length) return add + emptyState(I.trophy, 'Няма постижения още', 'Награди детето за напредъка му!');
    return add + `<div class="stagger" style="display:grid;gap:12px">${list.map(a => `
      <div class="ach">
        <div class="ach-ico">${a.icon || '🏅'}</div>
        <div class="ach-main"><div class="n">${esc(a.name)}</div>${a.reward?`<div class="r">🎁 ${esc(a.reward)}</div>`:''}</div>
        <div style="text-align:right"><div class="ach-date">${fmtDate(a.awardedDate)}</div>
          <button class="x-btn" data-un="${a.id}" title="Махни">${I.trash}</button></div>
      </div>`).join('')}</div>`;
  }
  function bindAchTab(c) {
    const b = $('#awardBtn'); if (b) b.onclick = () => awardForm(c);
    $$('[data-un]').forEach(x => x.onclick = async () => { if (!confirm('Да махна това постижение?')) return;
      try { await API.removeAward(x.dataset.un); toast('Махнато','ok'); renderTab('ach', c); } catch(e){ err(e); } });
  }

  /* ---------- Таб „Тренировки" (само за това дете) ---------- */
  let _childSessions = [];
  // Текущ момент по БЪЛГАРСКО време като сортируем низ "YYYY-MM-DDTHH:mm:ss"
  function nowSofia() {
    const s = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Sofia',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date());
    return s.replace(' ', 'T');
  }
  async function sessionsTab(c) {
    const list = await API.childHistory(c.id) || [];
    _childSessions = list;
    if (!list.length) return emptyState(I.cal, 'Няма тренировки', 'Добави детето към тренировка от „График".');
    const me = (API.getUser() || {}).name || '';
    const nowKey = nowSofia();
    const keyOf = h => `${(h.sessionDate || '').slice(0, 10)}T${(h.startTime || '00:00:00').slice(0, 8)}`;
    const upcoming = list.filter(h => keyOf(h) >= nowKey).sort((a, b) => keyOf(a).localeCompare(keyOf(b)));
    const past = list.filter(h => keyOf(h) < nowKey); // списъкът вече е DESC

    const row = h => {
      const coach = h.coachName || 'Треньор';
      const other = me && coach !== me;
      return `<div class="slot" data-sid="${h.sessionId}">
        <div class="slot-time">${fmtTime(h.startTime) || '—'}</div>
        <div class="slot-main">
          <div class="t">${fmtDate(h.sessionDate)}</div>
          <div class="s">${h.location ? esc(h.location) + ' · ' : ''}${esc(coach)}</div>
        </div>
        ${h.attended === false ? '<span class="chip" style="background:#FFF1F2;color:var(--red)">отсъствал</span>' : ''}
        ${I.chevR}
      </div>`;
    };
    const section = (title, arr) => arr.length ? `
      <div style="margin-bottom:22px">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
          <strong style="font-family:var(--font-head);font-size:1.05rem">${title}</strong>
          <span class="badge">${arr.length}</span>
        </div>
        <div class="stagger" style="display:grid;gap:10px">${arr.map(row).join('')}</div>
      </div>` : '';

    return `<div class="card card-pad rise">
      <p class="subtle" style="margin-bottom:16px">Тренировките само на това дете — минали и предстоящи. Натисни тренировка, за да видиш/редактираш неговите данни за нея.</p>
      ${section('Предстоящи', upcoming)}
      ${section('Минали', past)}
    </div>`;
  }
  function bindSessionsTab(c) {
    $$('#tabView .slot[data-sid]').forEach(el => el.onclick = () => {
      const h = _childSessions.find(x => String(x.sessionId) === el.dataset.sid);
      if (h) childSessionModal(c, h);
    });
  }

  // Фокусиран изглед на тренировка САМО за това дете
  function childSessionModal(child, h) {
    const attended = h.attended !== false;
    modal({ title: `${esc(child.firstName)} · ${fmtDate(h.sessionDate)}`, body: `
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">
        <span class="chip">${I.clock}&nbsp;${fmtTime(h.startTime)||'—'}</span>
        ${h.location?`<span class="chip">${I.pin}&nbsp;${esc(h.location)}</span>`:''}
        <span class="chip">${esc(h.coachName||'Треньор')}</span>
      </div>
      <div class="field"><label>Присъствие</label>
        <div class="att-seg" data-att data-val="${attended?'1':'0'}">
          <button type="button" class="att-opt yes ${attended?'on':''}" data-v="1">${I.check} Присъства</button>
          <button type="button" class="att-opt no ${!attended?'on':''}" data-v="0">Отсъства</button>
        </div></div>
      <div class="field"><label>Какво плува</label><textarea class="textarea" id="cs_swam" style="min-height:80px" placeholder="напр. 6x25 крака гръб…">${esc(h.swamWhat||'')}</textarea></div>
      <div class="field"><label>Настроение</label><select class="select" id="cs_mood"><option value="">—</option>${MOODS.map(m=>`<option ${h.mood===m?'selected':''} value="${m}">${MOOD_EMOJI[m]} ${m}</option>`).join('')}</select></div>
      <div class="field" style="margin:0"><label>Прогрес за деня</label><textarea class="textarea" id="cs_prog" style="min-height:80px" placeholder="Какво постигнахме днес…">${esc(h.dailyProgress||'')}</textarea></div>`,
      footer: `<button class="btn btn-ghost" data-close>Затвори</button><button class="btn btn-primary" id="cs_save">${I.check} Запази</button>` });
    const attSeg = document.querySelector('#modal-host [data-att]');
    attSeg.querySelectorAll('.att-opt').forEach(b => b.onclick = () => {
      attSeg.dataset.val = b.dataset.v;
      attSeg.querySelectorAll('.att-opt').forEach(x => x.classList.toggle('on', x.dataset.v === attSeg.dataset.val));
    });
    $('#cs_save').onclick = async () => {
      const dto = { childId: child.id, attended: attSeg.dataset.val === '1',
        swamWhat: $('#cs_swam').value.trim() || null,
        dailyProgress: $('#cs_prog').value.trim() || null,
        mood: $('#cs_mood').value || null };
      try { await API.upsertParticipant(h.sessionId, dto); toast('Запазено','ok'); closeModal(); renderTab('sessions', child); }
      catch(e){ err(e); }
    };
  }

  let _historyCache = [];

  function historyRowsHtml(list, me) {
    return list.map(h => {
      const coach = h.coachName || 'Треньор';
      const other = me && coach && coach !== me;   // тренировка, водена от другия треньор
      const badge = other
        ? `<span class="chip" style="background:linear-gradient(135deg,#FFE9C2,#F6B23C);color:#6b4a05;font-weight:700">${esc(coach)}</span>`
        : `<span class="chip">${esc(coach)}</span>`;
      return `<div class="tl-item">
        <div class="tl-date" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">${fmtDate(h.sessionDate)} ${badge}</div>
        ${h.swamWhat?`<div style="margin-top:6px"><strong>Плувахме:</strong> ${esc(h.swamWhat)}</div>`:''}
        ${h.dailyProgress?`<div style="margin-top:2px"><strong>Постигнахме:</strong> ${esc(h.dailyProgress)}</div>`:''}
        ${h.mood?`<span class="chip" style="margin-top:8px">${MOOD_EMOJI[h.mood]||''} ${esc(h.mood)}</span>`:''}
      </div>`;
    }).join('');
  }

  function renderHistoryRows(dateFilter, me) {
    const host = document.getElementById('histRows');
    if (!host) return;
    const rows = dateFilter
      ? _historyCache.filter(h => (h.sessionDate || '').slice(0, 10) === dateFilter)
      : _historyCache;
    host.innerHTML = rows.length
      ? historyRowsHtml(rows, me)
      : `<p class="subtle" style="padding:14px 2px">Няма тренировка на избраната дата.</p>`;
  }

  async function historyTab(c) {
    const list = await API.childHistory(c.id) || [];
    _historyCache = list;
    if (!list.length) return emptyState(I.cal, 'Няма история', 'Тренировките ще се появят тук.');
    const me = (API.getUser() || {}).name || '';
    const dates = [...new Set(list.map(h => (h.sessionDate || '').slice(0, 10)).filter(Boolean))];
    const options = ['<option value="">Всички дати</option>',
      ...dates.map(d => `<option value="${d}">${fmtDate(d)}</option>`)].join('');

    return `<div class="card card-pad rise">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:12px">
        <strong style="font-family:var(--font-head)">История на тренировките</strong>
        <select class="select" id="histDate" style="max-width:230px;margin-left:auto">${options}</select>
      </div>
      <p class="subtle" style="margin-bottom:14px">Избери дата, за да видиш какво е плувало и какво сте постигнали на нея. Жълто = водена от другия треньор. Родителят вижда само датите и кой е водил.</p>
      <div class="tl" id="histRows">${historyRowsHtml(list, me)}</div>
    </div>`;
  }

  async function compTab(c) {
    const list = await API.childCompetitions(c.id) || [];
    const add = `<button class="btn btn-primary btn-sm" id="addComp" style="margin-bottom:16px">${I.plus} Ново състезание</button>`;
    if (!list.length) return add + emptyState(I.trophy, 'Няма състезания', 'Добави събитие или състезание.');
    return add + `<div class="stagger" style="display:grid;gap:12px">${list.map(k => `
      <div class="card card-pad">
        <div style="display:flex;justify-content:space-between"><strong style="font-family:var(--font-head)">${esc(k.eventName)}</strong><span class="subtle">${fmtDate(k.eventDate)}</span></div>
        ${k.results?`<div style="margin-top:6px">🏁 ${esc(k.results)}</div>`:''}
        ${k.notes?`<div class="subtle" style="margin-top:4px">${esc(k.notes)}</div>`:''}
        <div style="margin-top:8px"><button class="x-btn" data-delc="${k.id}">${I.trash}</button></div>
      </div>`).join('')}</div>`;
  }
  function bindCompTab(c) {
    const b = $('#addComp'); if (b) b.onclick = () => compForm(c);
    $$('[data-delc]').forEach(x => x.onclick = async () => { if(!confirm('Изтриване?'))return;
      try { await API.deleteCompetition(x.dataset.delc); toast('Изтрито','ok'); renderTab('comp', c); } catch(e){ err(e); } });
  }

  /* ---------- Форми за дете / прогрес / награда / състезание ---------- */
  function field(label, id, val, type='text', ph='') {
    return `<div class="field"><label>${label}</label><input class="input" id="${id}" type="${type}" value="${esc(val||'')}" placeholder="${esc(ph)}"></div>`;
  }
  function area(label, id, val) { return `<div class="field"><label>${label}</label><textarea class="textarea" id="${id}">${esc(val||'')}</textarea></div>`; }

  function childForm(c) {
    const genderOpts = ['<option value="">—</option>', ...GENDERS.map(g=>`<option ${c?.gender===g?'selected':''}>${g}</option>`)].join('');
    modal({ title: c ? 'Редакция на картон' : 'Ново дете', large: true, body: `
      <div class="form-section">
        <div class="form-section-title">${I.kids} Основна информация</div>
        <div class="field"><label>Снимка</label>
          <div class="photo-up">
            <div class="photo-preview" id="c_photo_prev">${c?.photoUrl?`<img src="${esc(c.photoUrl)}" alt="">`:I.kids}</div>
            <div style="flex:1;min-width:0">
              <input type="file" id="c_photo_file" accept="image/*" class="input">
              <span class="hint" id="c_photo_hint">JPG или PNG, до 8 MB — качва се от устройството ти</span>
            </div>
          </div>
          <input type="hidden" id="c_photo" value="${esc(c?.photoUrl||'')}">
        </div>
        <div class="grid-2">${field('Име','c_fn',c?.firstName)}${field('Фамилия','c_ln',c?.lastName)}</div>
        <div class="grid-2">${field('Дата на раждане','c_bd',toDateInput(c?.birthDate),'date')}
          <div class="field"><label>Пол</label><select class="select" id="c_g">${genderOpts}</select></div></div>
        <div class="grid-2">${field('Ниво','c_lvl',c?.level)}${field('Начало на тренировки','c_start',toDateInput(c?.trainingStartDate),'date')}</div>
      </div>

      <div class="form-section">
        <div class="form-section-title">${I.heart} Здравна информация</div>
        ${area('Диагноза','c_diag',c?.diagnosis)}
        ${area('Обективно състояние','c_obj',c?.objectiveCondition)}
        ${area('Алергии / медицински бележки','c_alg',c?.allergiesMedical)}
      </div>

      <div class="form-section">
        <div class="form-section-title">${I.pin} Контакти</div>
        <div class="grid-2">${field('Контакт на родител','c_pc',c?.parentContact)}${field('Спешен контакт','c_ec',c?.emergencyContact)}</div>
      </div>

      <div class="form-section">
        <div class="form-section-title">${I.trophy} Цели и бележки</div>
        ${area('Цели','c_goals',c?.goals)}
        ${area('Бележки','c_notes',c?.notes)}
      </div>`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="c_save">${I.check} Запази</button>` });

    // Качване на снимка от устройството
    const fileIn = $('#c_photo_file');
    if (fileIn) fileIn.onchange = async () => {
      const f = fileIn.files[0]; if (!f) return;
      const hint = $('#c_photo_hint'), saveBtn = $('#c_save');
      hint.textContent = 'Качване…'; saveBtn.disabled = true;
      try {
        const r = await API.uploadPhoto(f);
        $('#c_photo').value = r.url;
        $('#c_photo_prev').innerHTML = `<img src="${esc(r.url)}" alt="">`;
        hint.textContent = 'Снимката е качена ✓';
      } catch (e) { hint.textContent = 'Грешка при качване'; err(e); }
      finally { saveBtn.disabled = false; }
    };

    $('#c_save').onclick = async () => {
      const dto = { firstName:$('#c_fn').value.trim(), lastName:$('#c_ln').value.trim(), birthDate:$('#c_bd').value,
        photoUrl:$('#c_photo').value.trim()||null, gender:$('#c_g').value||null, diagnosis:$('#c_diag').value.trim()||null,
        objectiveCondition:$('#c_obj').value.trim()||null, level:$('#c_lvl').value.trim()||null,
        allergiesMedical:$('#c_alg').value.trim()||null, parentContact:$('#c_pc').value.trim()||null,
        emergencyContact:$('#c_ec').value.trim()||null, goals:$('#c_goals').value.trim()||null,
        notes:$('#c_notes').value.trim()||null, trainingStartDate:$('#c_start').value||null };
      if (!dto.firstName || !dto.lastName || !dto.birthDate) return toast('Име, фамилия и дата на раждане са задължителни','err');
      try {
        if (c) { dto.isActive = c.isActive ?? true; await API.updateChild(c.id, dto); toast('Обновено','ok'); closeModal(); navigate('/app/child/'+c.id); render(); }
        else { const nc = await API.createChild(dto); toast('Създадено! Код: '+(nc.parentCode||''),'ok'); closeModal(); navigate('/app/child/'+nc.id); }
      } catch (e) { err(e); }
    };
  }

  function ratePick(label, id, val) {
    return `<div class="field"><label>${label}</label><div class="ratepick" data-id="${id}" data-val="${val||0}">
      ${[1,2,3,4,5].map(i=>`<button type="button" class="rp d${i}" data-v="${i}">${i}</button>`).join('')}
      <button type="button" class="rp clr" data-v="0">—</button></div></div>`;
  }
  function rangePick(label, id, val) {
    return `<div class="field"><label>${label} <span class="subtle" id="${id}_o">${val||0}%</span></label>
      <input class="input" id="${id}" type="range" min="0" max="100" value="${val||0}" oninput="document.getElementById('${id}_o').textContent=this.value+'%'"></div>`;
  }
  async function progressForm(c) {
    // Зареждаме последната карта като начална точка (историята се пази — това е нов запис)
    let last = null;
    try { const list = await API.childProgress(c.id); last = (list && list[0]) || null; } catch {}
    modal({ title: 'Нова карта за напредък', large: true, body: `
      ${last ? `<p class="subtle" style="margin-bottom:14px">Заредени са стойностите от последната карта (${esc(last.periodLabel || fmtDate(last.assessmentDate))}). Промени само каквото се е подобрило — старата карта остава в историята.</p>` : ''}
      <div class="grid-2">${field('Период','p_period',last?.periodLabel,'text','напр. Есен 2026')}${field('Дата','p_date',toDateInput(new Date()),'date')}</div>
      <hr class="divider"><strong style="font-family:var(--font-head)">Основни умения <span class="subtle" style="font-weight:400">(1–5)</span></strong>
      <div class="grid-2" style="margin-top:10px">${ratePick('Скокове/атлетика','p_jump',last?.jumpsAthletics)}${ratePick('Баланс/координация','p_bal',last?.balanceCoordination)}${ratePick('Сила/издръжливост','p_se',last?.strengthEndurance)}</div>
      <hr class="divider"><strong style="font-family:var(--font-head)">Физическо развитие <span class="subtle" style="font-weight:400">(0–100%)</span></strong>
      <div class="grid-2" style="margin-top:10px">${rangePick('Сила','p_ps',last?.physStrength)}${rangePick('Гъвкавост','p_pf',last?.physFlexibility)}${rangePick('Издръжливост','p_pe',last?.physEndurance)}${rangePick('Координация','p_pc',last?.physCoordination)}</div>
      <hr class="divider"><strong style="font-family:var(--font-head)">Социални умения <span class="subtle" style="font-weight:400">(1–5)</span></strong>
      <div class="grid-2" style="margin-top:10px">${ratePick('Работа в екип','p_tw',last?.teamwork)}${ratePick('Дисциплина','p_di',last?.discipline)}${ratePick('Мотивация','p_mo',last?.motivation)}${ratePick('Концентрация','p_co',last?.concentration)}</div>
      <hr class="divider">${area('Цели за следващия период','p_goals',last?.nextGoals)}${area('Бележки от треньора','p_notes',last?.coachNotes)}`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="p_save">${I.check} Запази</button>` });

    $$('.ratepick').forEach(rp => {
      const paint = () => $$('.rp', rp).forEach(b => b.classList.toggle('sel', +b.dataset.v === +rp.dataset.val && +b.dataset.v>0));
      $$('.rp', rp).forEach(b => b.onclick = () => { rp.dataset.val = b.dataset.v; paint(); });
      paint();
    });
    const rv = (id) => { const el=document.querySelector(`.ratepick[data-id="${id}"]`); const n=+el.dataset.val; return n>0?n:null; };
    const pv = (id) => { const n=+$('#'+id).value; return n>0?n:null; };
    $('#p_save').onclick = async () => {
      const dto = { childId:c.id, coachId:(API.getUser()||{}).id||null, assessmentDate:$('#p_date').value, periodLabel:$('#p_period').value.trim()||null,
        jumpsAthletics:rv('p_jump'), balanceCoordination:rv('p_bal'), strengthEndurance:rv('p_se'), basicSkillsComment:null,
        physStrength:pv('p_ps'), physFlexibility:pv('p_pf'), physEndurance:pv('p_pe'), physCoordination:pv('p_pc'),
        teamwork:rv('p_tw'), discipline:rv('p_di'), motivation:rv('p_mo'), concentration:rv('p_co'),
        nextGoals:$('#p_goals').value.trim()||null, coachNotes:$('#p_notes').value.trim()||null };
      try { await API.createProgress(dto); toast('Запазено','ok'); closeModal(); renderTab('progress', c); } catch(e){ err(e); }
    };
  }

  async function awardForm(c) {
    let defs = [];
    try { defs = await API.achievements() || []; } catch {}
    if (!defs.length) { closeModal?.(); return toast('Първо създай постижения в „Постижения“','err'); }
    modal({ title: 'Дай постижение', body: `
      <div class="field"><label>Постижение</label><select class="select" id="a_def">${defs.map(d=>`<option value="${d.id}">${d.icon||'🏅'} ${esc(d.name)}${d.reward?' · '+esc(d.reward):''}</option>`).join('')}</select></div>
      ${field('Дата','a_date',toDateInput(new Date()),'date')}
      ${area('Бележка','a_note')}`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="a_save">${I.check} Дай</button>` });
    $('#a_save').onclick = async () => {
      const dto = { childId:c.id, achievementId:$('#a_def').value, awardedDate:$('#a_date').value, awardedBy:(API.getUser()||{}).id||null, note:$('#a_note').value.trim()||null };
      try { await API.award(dto); toast('Награден! 🎉','ok'); closeModal(); renderTab('ach', c); } catch(e){ err(e); }
    };
  }

  function compForm(c) {
    modal({ title: 'Ново състезание / събитие', body: `
      ${field('Име на събитието','k_name','', 'text','напр. Градско първенство')}
      ${field('Дата','k_date',toDateInput(new Date()),'date')}
      ${area('Резултати','k_res')}${area('Забележки','k_notes')}`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="k_save">${I.check} Запази</button>` });
    $('#k_save').onclick = async () => {
      const dto = { childId:c.id, eventDate:$('#k_date').value, eventName:$('#k_name').value.trim(), results:$('#k_res').value.trim()||null, notes:$('#k_notes').value.trim()||null, createdBy:(API.getUser()||{}).id||null };
      if (!dto.eventName) return toast('Въведи име','err');
      try { await API.createCompetition(dto); toast('Запазено','ok'); closeModal(); renderTab('comp', c); } catch(e){ err(e); }
    };
  }

  /* ===================== ПОСТИЖЕНИЯ (дефиниции) ===================== */
  route(/^\/app\/achievements$/, async () => {
    if (!guard()) return;
    shell('achievements', `
      <div class="page-head"><div><h1 class="pagettl">Постижения</h1><p class="subtle">Ти създаваш наградите</p></div>
        <button class="btn btn-primary" id="newAch">${I.plus} Ново постижение</button></div>
      <div id="achList">${loading()}</div>`);
    $('#newAch').onclick = () => achDefForm();
    await loadAchDefs();
  });
  async function loadAchDefs() {
    try {
      const list = await API.achievements(true) || [];
      const host = $('#achList');
      if (!list.length) { host.innerHTML = emptyState(I.trophy, 'Още няма постижения', 'Създай тениска, медал, шапка…'); return; }
      host.innerHTML = `<div class="kid-grid stagger">${list.map(a => `
        <div class="card card-pad" style="text-align:center">
          <div class="ach-ico" style="margin:0 auto 12px;width:64px;height:64px;font-size:2rem">${a.icon||'🏅'}</div>
          <div class="kid-name">${esc(a.name)}</div>
          ${a.category?`<span class="badge" style="margin-top:8px">${esc(a.category)}</span>`:''}
          ${a.reward?`<div style="margin-top:10px" class="reward-tag">🎁 ${esc(a.reward)}</div>`:''}
          <div style="display:flex;gap:8px;justify-content:center;margin-top:14px">
            <button class="btn btn-ghost btn-sm" data-edit="${a.id}">${I.edit}</button>
            <button class="btn btn-danger btn-sm" data-del="${a.id}">${I.trash}</button>
          </div>
        </div>`).join('')}</div>`;
      $$('[data-edit]').forEach(b => b.onclick = () => achDefForm(list.find(x=>x.id===b.dataset.edit)));
      $$('[data-del]').forEach(b => b.onclick = async () => { if(!confirm('Изтриване на постижението?'))return;
        try { await API.deleteAchievement(b.dataset.del); toast('Изтрито','ok'); loadAchDefs(); } catch(e){ err(e); } });
    } catch (e) { err(e); }
  }
  function achDefForm(a) {
    const icons = ['🏅','🥇','🏆','⭐','🎖️','👕','🧢','🥽','🌊','🐬','🚀','💪','🔥','❤️'];
    modal({ title: a ? 'Редакция' : 'Ново постижение', body: `
      <div class="field"><label>Икона</label><div class="iconpick" id="iconPick">${icons.map(ic=>`<button type="button" class="ic ${a?.icon===ic?'sel':''}" data-ic="${ic}">${ic}</button>`).join('')}</div></div>
      ${field('Име','ad_name',a?.name,'text','напр. Първи 25 метра')}
      ${field('Категория','ad_cat',a?.category,'text','напр. Техника')}
      ${field('Награда','ad_reward',a?.reward,'text','тениска, медал, шапка…')}`,
      footer: `<button class="btn btn-ghost" data-close>Отказ</button><button class="btn btn-primary" id="ad_save">${I.check} Запази</button>` });
    let icon = a?.icon || '🏅';
    $$('#iconPick .ic').forEach(b => b.onclick = () => { icon=b.dataset.ic; $$('#iconPick .ic').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); });
    $('#ad_save').onclick = async () => {
      const dto = { name:$('#ad_name').value.trim(), icon, category:$('#ad_cat').value.trim()||null, reward:$('#ad_reward').value.trim()||null };
      if (!dto.name) return toast('Въведи име','err');
      try {
        if (a) { dto.isActive = a.isActive ?? true; await API.updateAchievement(a.id, dto); } else { await API.createAchievement(dto); }
        toast('Запазено','ok'); closeModal(); loadAchDefs();
      } catch(e){ err(e); }
    };
  }

  /* ===================== РОДИТЕЛСКИ ИЗГЛЕД ===================== */
  route(/^\/parent\/view$/, () => {
    document.body.classList.remove('has-topbar');
    let data; try { data = JSON.parse(sessionStorage.getItem('sws.parent')); } catch {}
    if (!data) return navigate('/login');
    const c = data.child;
    const ph = c.photoUrl ? `<img class="profile-avatar" src="${esc(c.photoUrl)}">` : `<div class="profile-avatar ph">${initials(c.firstName,c.lastName)}</div>`;

    const achHtml = (data.achievements||[]).length ? data.achievements.map(a => `
      <div class="ach"><div class="ach-ico">${a.icon||'🏅'}</div>
        <div class="ach-main"><div class="n">${esc(a.name)}</div>${a.reward?`<div class="r">🎁 ${esc(a.reward)}</div>`:''}</div>
        <div class="ach-date">${fmtDate(a.awardedDate)}</div></div>`).join('')
      : emptyState(I.trophy,'Още няма постижения','Скоро ще дойдат! 💪');

    const histHtml = (data.history||[]).length ? `<div class="tl">${data.history.map(h=>`
      <div class="tl-item"><div class="tl-date">${fmtDate(h.sessionDate)} · <span class="subtle">${esc(h.coachName||'Треньор')}</span></div></div>`).join('')}</div>`
      : emptyState(I.cal,'Няма тренировки още','');

    const pr = data.progress;
    const bar = (l,v) => v==null?'':`<div class="prog-row"><div class="prog-top"><span>${l}</span><span class="val">${v}%</span></div><div class="prog-track"><div class="prog-fill" data-w="${v}"></div></div></div>`;
    const progHtml = pr ? `<div class="card card-pad">
        <div style="display:flex;justify-content:space-between;margin-bottom:14px"><strong style="font-family:var(--font-head)">${esc(pr.periodLabel||'Напредък')}</strong><span class="subtle">${fmtDate(pr.assessmentDate)}</span></div>
        ${bar('Сила',pr.physStrength)}${bar('Гъвкавост',pr.physFlexibility)}${bar('Издръжливост',pr.physEndurance)}${bar('Координация',pr.physCoordination)}
        ${pr.nextGoals?`<hr class="divider"><div class="info-item"><div class="k">Следваща цел</div><div class="v">${esc(pr.nextGoals)}</div></div>`:''}
      </div>` : '';

    app.innerHTML = `
      <div class="aqua-bg"></div>
      <div class="parent-top">
        <div class="brand-name">Swim<span>With</span>Smile</div>
        <button class="btn btn-ghost btn-sm" id="pOut" style="margin-left:auto">${I.logout} Изход</button>
      </div>
      <div class="wrap">
        <div class="profile-head rise">${ph}
          <div class="profile-info"><h1>${esc(c.firstName)} ${esc(c.lastName)}</h1>
            <div class="row"><span class="badge">${c.ageYears ?? ageFrom(c.birthDate)} години</span>${c.level?`<span class="badge">${esc(c.level)}</span>`:''}</div>
          </div></div>

        ${c.goals?`<div class="card card-pad rise" style="margin-top:20px"><div class="info-item"><div class="k">Цели</div><div class="v">${esc(c.goals)}</div></div></div>`:''}

        ${progHtml?`<h2 style="margin:26px 0 14px">Напредък</h2>${progHtml}`:''}

        <h2 style="margin:26px 0 14px">Постижения 🏆</h2>
        <div class="stagger" style="display:grid;gap:12px">${achHtml}</div>

        <h2 style="margin:26px 0 14px">История на тренировките</h2>
        <div class="card card-pad rise">${histHtml}</div>
      </div>`;
    $('#pOut').onclick = () => { sessionStorage.removeItem('sws.parent'); navigate('/login'); };
    setTimeout(()=>$$('.prog-fill').forEach(f=>f.style.width=f.dataset.w+'%'), 80);
  });

  /* ---------- Стилове за пикери (малки) ---------- */
  const st = document.createElement('style');
  st.textContent = `
    .trend{display:inline-flex;align-items:center;gap:1px;vertical-align:middle;font-family:var(--font-head);font-weight:800;font-size:.78rem;padding:2px 6px 2px 4px;border-radius:var(--r-pill)}
    .trend svg{width:13px;height:13px;flex-shrink:0}
    .trend-up{color:#1B7A47;background:#D9F7E6}
    .trend-down{color:#B0303B;background:#FBD9DC}
    .trend-legend{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:16px;font-size:.86rem}
    .trend-legend b{font-weight:800}
    .att-seg{display:inline-flex;gap:4px;background:var(--sky-50);border-radius:var(--r-pill);padding:4px}
    .att-opt{display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:var(--r-pill);font-family:var(--font-head);font-weight:600;font-size:.82rem;color:var(--ink-2);transition:all .15s;white-space:nowrap}
    .att-opt svg{width:15px;height:15px}
    .att-opt:hover{background:var(--sky-100)}
    .att-opt.yes.on{background:linear-gradient(135deg,#34D07F,#12805a);color:#fff;box-shadow:var(--shadow-sm)}
    .att-opt.no.on{background:linear-gradient(135deg,#F0616D,#c33645);color:#fff;box-shadow:var(--shadow-sm)}
    .ratepick{display:flex;gap:6px;flex-wrap:wrap}
    .iconpick{display:flex;gap:8px;flex-wrap:wrap}
    .rp{flex:1 1 0;min-width:40px;height:44px;border-radius:12px;background:var(--sky-50);font-family:var(--font-head);font-weight:700;font-size:1rem;color:var(--ink-2);transition:all .15s}
    .rp:hover{background:var(--sky-100)}
    .rp.sel{color:#fff}.rp.d1.sel{background:var(--red)}.rp.d2.sel{background:#F5883C}.rp.d3.sel{background:var(--amber)}.rp.d4.sel{background:#7BC96F}.rp.d5.sel{background:var(--green)}.rp.clr.sel{background:var(--navy)}
    .ic{width:46px;height:46px;border-radius:12px;background:var(--sky-50);font-size:1.4rem;transition:all .15s}
    .ic:hover{background:var(--sky-100);transform:scale(1.1)}
    .ic.sel{background:var(--navy);box-shadow:var(--shadow-navy)}
    input[type=range]{-webkit-appearance:none;appearance:none;height:8px;border-radius:99px;background:var(--sky-100);padding:0}
    input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,var(--brand-light),var(--navy));cursor:pointer;box-shadow:var(--shadow-sm)}
    input[type=range]::-moz-range-thumb{width:22px;height:22px;border:none;border-radius:50%;background:var(--navy);cursor:pointer}
  `;
  document.head.appendChild(st);

  const render = S.render;
  render();
})();
