/* ============================================================
   SwimWithSmile — Бекенд върху Google Sheet (Google Apps Script)
   ------------------------------------------------------------
   Този скрипт заменя ASP.NET + база данни. Данните живеят в
   табовете на Google таблицата (всеки таб = таблица).

   Публикува се като Web App (Deploy → New deployment → Web app,
   "Execute as: Me", "Who has access: Anyone"). Полученият URL
   се поставя в js/api.js (DEFAULT_BASE).

   Първо стартиране:
     1) Меню „SwimWithSmile → 1) Първоначална настройка"
     2) В таб „Coaches" сложи имейл + парола (в колона passwordHash)
     3) Меню „SwimWithSmile → 2) Хеширай паролите"
   ============================================================ */

var TZ = 'Europe/Sofia';

var SCHEMA = {
  Coaches:      ['id','fullName','email','passwordHash','active','createdAt'],
  Children:     ['id','firstName','lastName','birthDate','gender','level','trainingStartDate',
                 'diagnosis','objectiveCondition','allergiesMedical','parentContact','emergencyContact',
                 'goals','notes','parentCode','photoUrl','isActive','createdAt'],
  Sessions:     ['id','sessionDate','startTime','coachId','location','notes','createdAt'],
  Participants: ['id','sessionId','childId','attended','swamWhat','dailyProgress','mood','updatedAt'],
  Progress:     ['id','childId','coachId','assessmentDate','periodLabel','jumpsAthletics','balanceCoordination',
                 'strengthEndurance','basicSkillsComment','physStrength','physFlexibility','physEndurance',
                 'physCoordination','teamwork','discipline','motivation','concentration','nextGoals','coachNotes','createdAt'],
  Achievements: ['id','name','icon','category','reward','isActive','createdAt'],
  Awards:       ['id','childId','achievementId','awardedDate','awardedBy','note','createdAt'],
  Competitions: ['id','childId','eventDate','eventName','results','notes','createdBy','createdAt']
};

/* ---------------- Меню в таблицата ---------------- */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SwimWithSmile')
    .addItem('1) Първоначална настройка', 'setup')
    .addItem('2) Хеширай паролите', 'hashPlainPasswords')
    .addToUi();
}

/* ---------------- Първоначална настройка ---------------- */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(SCHEMA).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    var headers = SCHEMA[name];
    // Форматираме всичко като текст, за да не превръща Sheets датите/числата
    sh.getRange(1, 1, sh.getMaxRows(), headers.length).setNumberFormat('@');
    sh.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sh.setFrozenRows(1);
  });

  // Гарантираме „pepper" (таен ключ) за подписване на токени и хеширане
  pepper_();

  // Демо треньор (смени го!) — паролата е в чист вид, докато не я хешираш
  if (readObjects_('Coaches').length === 0) {
    appendObject_('Coaches', {
      id: Utilities.getUuid(), fullName: 'Треньор', email: 'coach@example.com',
      passwordHash: 'promeni-me', active: 'TRUE', createdAt: nowIso_()
    });
  }

  // Няколко примерни постижения, за да работи „Дай постижение" веднага
  if (readObjects_('Achievements').length === 0) {
    [['Първи 25 метра','🏊','Техника','стикер'],
     ['Скок от стартов блок','🚀','Смелост','медал'],
     ['Пълна тренировка без спиране','🔥','Издръжливост','тениска']
    ].forEach(function (a) {
      appendObject_('Achievements', {
        id: Utilities.getUuid(), name: a[0], icon: a[1], category: a[2], reward: a[3],
        isActive: 'TRUE', createdAt: nowIso_()
      });
    });
  }

  SpreadsheetApp.getUi().alert('Готово! Табовете са създадени.\n\nСега: в таб „Coaches" сложи своя имейл и парола, после пусни „2) Хеширай паролите".');
}

function hashPlainPasswords() {
  var sh = sh_('Coaches');
  var vals = sh.getDataRange().getValues();
  var headers = vals[0].map(String);
  var col = headers.indexOf('passwordHash');
  var n = 0;
  for (var i = 1; i < vals.length; i++) {
    var v = String(vals[i][col] || '');
    if (v && v.indexOf('sha256:') !== 0) {
      sh.getRange(i + 1, col + 1).setNumberFormat('@').setValue(hashPw_(v));
      n++;
    }
  }
  SpreadsheetApp.getUi().alert(n + ' парола(и) хеширани.');
}

/* ============================================================
   HTTP входни точки
   ============================================================ */
function doGet() {
  return ContentService
    .createTextOutput('SwimWithSmile API е активно.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var out;
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    out = handle_(req);
  } catch (err) {
    out = E(500, 'Сървърна грешка: ' + (err && err.message ? err.message : err));
  }
  return json_(out);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function D(data) { return { ok: true, data: (data === undefined ? null : data) }; }
function E(status, message) { return { ok: false, status: status, message: message }; }

/* ---------------- Рутер ---------------- */
var PUBLIC_ACTIONS = { login: 1, parentDashboard: 1 };
var WRITE_RE = /^(create|update|delete|regenerate|upsert|remove|award)/;

function handle_(req) {
  var action = req.action;
  var p = req.payload || {};

  var coachId = null;
  if (!PUBLIC_ACTIONS[action]) {
    coachId = verifyToken_(req.token);
    if (!coachId) return E(401, 'Сесията изтече. Влез отново.');
  }
  p._coachId = coachId;

  var isWrite = WRITE_RE.test(action);
  var lock = null;
  if (isWrite) {
    lock = LockService.getScriptLock();
    try { lock.waitLock(20000); } catch (e) { return E(503, 'Сървърът е зает, опитай пак.'); }
  }
  try {
    switch (action) {
      case 'login':                return actLogin_(p);
      case 'coaches':              return actCoaches_(p);
      case 'createCoach':          return actCreateCoach_(p);

      case 'children':             return actChildren_(p);
      case 'child':                return D(childOut_(mustChild_(p.id)));
      case 'createChild':          return actCreateChild_(p);
      case 'updateChild':          return actUpdateChild_(p);
      case 'regenerateCode':       return actRegenerateCode_(p);
      case 'childHistory':         return actChildHistory_(p);
      case 'childProgress':        return actChildProgress_(p);
      case 'childAchievements':    return actChildAchievements_(p);
      case 'childCompetitions':    return actChildCompetitions_(p);

      case 'sessions':             return actSessions_(p);
      case 'calendar':             return actSessions_(p);
      case 'session':              return actSession_(p);
      case 'createSession':        return actCreateSession_(p);
      case 'updateSession':        return actUpdateSession_(p);
      case 'deleteSession':        return actDeleteSession_(p);
      case 'upsertParticipant':    return actUpsertParticipant_(p);
      case 'removeParticipant':    return actRemoveParticipant_(p);

      case 'createProgress':       return actCreateProgress_(p);
      case 'deleteProgress':       return actDeleteById_('Progress', p.id);

      case 'achievements':         return actAchievements_(p);
      case 'createAchievement':    return actCreateAchievement_(p);
      case 'updateAchievement':    return actUpdateAchievement_(p);
      case 'deleteAchievement':    return actDeleteAchievement_(p);
      case 'award':                return actAward_(p);
      case 'removeAward':          return actDeleteById_('Awards', p.id);

      case 'createCompetition':    return actCreateCompetition_(p);
      case 'updateCompetition':    return actUpdateCompetition_(p);
      case 'deleteCompetition':    return actDeleteById_('Competitions', p.id);

      case 'parentDashboard':      return actParentDashboard_(p);

      default:                     return E(400, 'Непозната операция: ' + action);
    }
  } finally {
    if (lock) lock.releaseLock();
  }
}

/* ============================================================
   Действия — Auth
   ============================================================ */
function actLogin_(p) {
  var email = String(p.email || '').trim().toLowerCase();
  var password = String(p.password || '');
  var c = readObjects_('Coaches').filter(function (x) {
    return String(x.email || '').trim().toLowerCase() === email && nb_(x.active);
  })[0];
  if (!c) return E(401, 'Грешен имейл или парола.');

  var stored = String(c.passwordHash || '');
  var okpw = stored.indexOf('sha256:') === 0 ? (stored === hashPw_(password)) : (stored === password);
  if (!okpw) return E(401, 'Грешен имейл или парола.');

  return D({ token: makeToken_(c.id), coachId: c.id, fullName: c.fullName, email: c.email });
}

function actCoaches_() {
  return D(readObjects_('Coaches').filter(function (c) { return nb_(c.active); })
    .map(function (c) { return { id: c.id, fullName: c.fullName, email: c.email }; }));
}

function actCreateCoach_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Coaches', {
    id: id, fullName: d.fullName || '', email: String(d.email || '').trim(),
    passwordHash: d.password ? hashPw_(String(d.password)) : '', active: 'TRUE', createdAt: nowIso_()
  });
  return D({ id: id });
}

/* ============================================================
   Действия — Деца
   ============================================================ */
function actChildren_(p) {
  var list = readObjects_('Children');
  if (!p.includeInactive) list = list.filter(function (c) { return nb_(c.isActive); });
  list.sort(function (a, b) {
    return ((a.firstName || '') + (a.lastName || '')).localeCompare((b.firstName || '') + (b.lastName || ''), 'bg');
  });
  return D(list.map(childOut_));
}

function actCreateChild_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  var code = newParentCode_();
  appendObject_('Children', {
    id: id, firstName: d.firstName || '', lastName: d.lastName || '', birthDate: nd_(d.birthDate),
    gender: d.gender || '', level: d.level || '',
    trainingStartDate: d.trainingStartDate ? nd_(d.trainingStartDate) : '',
    diagnosis: d.diagnosis || '', objectiveCondition: d.objectiveCondition || '',
    allergiesMedical: d.allergiesMedical || '', parentContact: d.parentContact || '',
    emergencyContact: d.emergencyContact || '', goals: d.goals || '', notes: d.notes || '',
    parentCode: code, photoUrl: d.photoUrl || '', isActive: 'TRUE', createdAt: nowIso_()
  });
  return D({ id: id, parentCode: code });
}

function actUpdateChild_(p) {
  var d = p.data || {};
  var patch = {};
  ['firstName','lastName','gender','level','diagnosis','objectiveCondition','allergiesMedical',
   'parentContact','emergencyContact','goals','notes','photoUrl'].forEach(function (k) {
    if (d[k] !== undefined) patch[k] = d[k] === null ? '' : d[k];
  });
  if (d.birthDate !== undefined) patch.birthDate = nd_(d.birthDate);
  if (d.trainingStartDate !== undefined) patch.trainingStartDate = d.trainingStartDate ? nd_(d.trainingStartDate) : '';
  if (d.isActive !== undefined) patch.isActive = d.isActive ? 'TRUE' : 'FALSE';
  if (!updateById_('Children', p.id, patch)) return E(404, 'Детето не е намерено.');
  return D(null);
}

function actRegenerateCode_(p) {
  var code = newParentCode_();
  if (!updateById_('Children', p.id, { parentCode: code })) return E(404, 'Детето не е намерено.');
  return D({ parentCode: code });
}

function actChildHistory_(p) {
  var sessions = mapById_('Sessions');
  var coaches = coachMap_();
  var out = readObjects_('Participants')
    .filter(function (pt) { return String(pt.childId) === String(p.id); })
    .map(function (pt) {
      var s = sessions[pt.sessionId] || {};
      return {
        sessionId: pt.sessionId, sessionDate: nd_(s.sessionDate), startTime: nt_(s.startTime),
        location: nn_(s.location), coachId: nn_(s.coachId),
        coachName: (coaches[s.coachId] || {}).fullName || 'Треньор',
        attended: nb_(pt.attended), swamWhat: nn_(pt.swamWhat),
        dailyProgress: nn_(pt.dailyProgress), mood: nn_(pt.mood)
      };
    })
    .filter(function (h) { return h.sessionDate; });
  out.sort(function (a, b) {
    return (b.sessionDate + (b.startTime || '')).localeCompare(a.sessionDate + (a.startTime || ''));
  });
  return D(out);
}

function actChildProgress_(p) {
  var out = readObjects_('Progress')
    .filter(function (r) { return String(r.childId) === String(p.id); })
    .map(progressOut_);
  out.sort(function (a, b) {
    return (b.assessmentDate || '').localeCompare(a.assessmentDate || '') ||
           (b._createdAt || '').localeCompare(a._createdAt || '');
  });
  return D(out);
}

function actChildAchievements_(p) {
  var ach = mapById_('Achievements');
  var out = readObjects_('Awards')
    .filter(function (a) { return String(a.childId) === String(p.id); })
    .map(function (a) {
      var d = ach[a.achievementId] || {};
      return { id: a.id, name: d.name || '', icon: d.icon || '🏅', reward: nn_(d.reward), awardedDate: nd_(a.awardedDate) };
    });
  out.sort(function (a, b) { return (b.awardedDate || '').localeCompare(a.awardedDate || ''); });
  return D(out);
}

function actChildCompetitions_(p) {
  var out = readObjects_('Competitions')
    .filter(function (k) { return String(k.childId) === String(p.id); })
    .map(function (k) {
      return { id: k.id, eventName: k.eventName || '', eventDate: nd_(k.eventDate),
               results: nn_(k.results), notes: nn_(k.notes) };
    });
  out.sort(function (a, b) { return (b.eventDate || '').localeCompare(a.eventDate || ''); });
  return D(out);
}

/* ============================================================
   Действия — Тренировки
   ============================================================ */
function actSessions_(p) {
  var y = Number(p.year), m = Number(p.month);           // month 1-12
  var prefix = y + '-' + pad2_(m);
  var coaches = coachMap_();
  var countBy = {};
  readObjects_('Participants').forEach(function (pt) {
    countBy[pt.sessionId] = (countBy[pt.sessionId] || 0) + 1;
  });
  var out = readObjects_('Sessions')
    .filter(function (s) { return nd_(s.sessionDate).slice(0, 7) === prefix; })
    .map(function (s) {
      return {
        id: s.id, sessionDate: nd_(s.sessionDate), startTime: nt_(s.startTime),
        coachId: nn_(s.coachId), coachName: (coaches[s.coachId] || {}).fullName || 'Треньор',
        location: nn_(s.location), notes: nn_(s.notes), participantCount: countBy[s.id] || 0
      };
    });
  return D(out);
}

function actSession_(p) {
  var s = findById_('Sessions', p.id);
  if (!s) return E(404, 'Тренировката не е намерена.');
  var coaches = coachMap_();
  var children = childMap_();
  var participants = readObjects_('Participants')
    .filter(function (pt) { return String(pt.sessionId) === String(p.id); })
    .map(function (pt) {
      var ch = children[pt.childId] || {};
      return {
        childId: pt.childId, childName: ((ch.firstName || '') + ' ' + (ch.lastName || '')).trim(),
        attended: nb_(pt.attended), swamWhat: nn_(pt.swamWhat),
        dailyProgress: nn_(pt.dailyProgress), mood: nn_(pt.mood)
      };
    });
  return D({
    id: s.id, sessionDate: nd_(s.sessionDate), startTime: nt_(s.startTime),
    coachId: nn_(s.coachId), coachName: (coaches[s.coachId] || {}).fullName || 'Треньор',
    location: nn_(s.location), notes: nn_(s.notes), participants: participants
  });
}

function actCreateSession_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Sessions', {
    id: id, sessionDate: nd_(d.sessionDate), startTime: nt_(d.startTime),
    coachId: d.coachId || '', location: d.location || '', notes: d.notes || '', createdAt: nowIso_()
  });
  return D({ id: id });
}

function actUpdateSession_(p) {
  var d = p.data || {};
  var patch = {};
  if (d.sessionDate !== undefined) patch.sessionDate = nd_(d.sessionDate);
  if (d.startTime !== undefined) patch.startTime = nt_(d.startTime);
  if (d.coachId !== undefined) patch.coachId = d.coachId || '';
  if (d.location !== undefined) patch.location = d.location || '';
  if (d.notes !== undefined) patch.notes = d.notes || '';
  if (!updateById_('Sessions', p.id, patch)) return E(404, 'Тренировката не е намерена.');
  return D(null);
}

function actDeleteSession_(p) {
  // Изтриваме и участниците към тренировката
  readObjects_('Participants')
    .filter(function (pt) { return String(pt.sessionId) === String(p.id); })
    .forEach(function (pt) { deleteById_('Participants', pt.id); });
  deleteById_('Sessions', p.id);
  return D(null);
}

function actUpsertParticipant_(p) {
  var sid = p.sessionId;
  var d = p.data || {};
  var existing = readObjects_('Participants').filter(function (pt) {
    return String(pt.sessionId) === String(sid) && String(pt.childId) === String(d.childId);
  })[0];
  var patch = {
    attended: d.attended ? 'TRUE' : 'FALSE',
    swamWhat: d.swamWhat || '', dailyProgress: d.dailyProgress || '',
    mood: d.mood || '', updatedAt: nowIso_()
  };
  if (existing) {
    updateById_('Participants', existing.id, patch);
  } else {
    appendObject_('Participants', Object.assign(
      { id: Utilities.getUuid(), sessionId: sid, childId: d.childId }, patch));
  }
  return D(null);
}

function actRemoveParticipant_(p) {
  readObjects_('Participants')
    .filter(function (pt) { return String(pt.sessionId) === String(p.sessionId) && String(pt.childId) === String(p.childId); })
    .forEach(function (pt) { deleteById_('Participants', pt.id); });
  return D(null);
}

/* ============================================================
   Действия — Напредък
   ============================================================ */
function actCreateProgress_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Progress', {
    id: id, childId: d.childId || '', coachId: d.coachId || '',
    assessmentDate: nd_(d.assessmentDate), periodLabel: d.periodLabel || '',
    jumpsAthletics: numStr_(d.jumpsAthletics), balanceCoordination: numStr_(d.balanceCoordination),
    strengthEndurance: numStr_(d.strengthEndurance), basicSkillsComment: d.basicSkillsComment || '',
    physStrength: numStr_(d.physStrength), physFlexibility: numStr_(d.physFlexibility),
    physEndurance: numStr_(d.physEndurance), physCoordination: numStr_(d.physCoordination),
    teamwork: numStr_(d.teamwork), discipline: numStr_(d.discipline),
    motivation: numStr_(d.motivation), concentration: numStr_(d.concentration),
    nextGoals: d.nextGoals || '', coachNotes: d.coachNotes || '', createdAt: nowIso_()
  });
  return D({ id: id });
}

/* ============================================================
   Действия — Постижения
   ============================================================ */
function actAchievements_(p) {
  var list = readObjects_('Achievements');
  if (!p.includeInactive) list = list.filter(function (a) { return nb_(a.isActive); });
  return D(list.map(function (a) {
    return { id: a.id, name: a.name || '', icon: a.icon || '🏅', category: nn_(a.category),
             reward: nn_(a.reward), isActive: nb_(a.isActive) };
  }));
}

function actCreateAchievement_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Achievements', {
    id: id, name: d.name || '', icon: d.icon || '🏅', category: d.category || '',
    reward: d.reward || '', isActive: 'TRUE', createdAt: nowIso_()
  });
  return D({ id: id });
}

function actUpdateAchievement_(p) {
  var d = p.data || {};
  var patch = {};
  ['name','icon','category','reward'].forEach(function (k) { if (d[k] !== undefined) patch[k] = d[k] === null ? '' : d[k]; });
  if (d.isActive !== undefined) patch.isActive = d.isActive ? 'TRUE' : 'FALSE';
  if (!updateById_('Achievements', p.id, patch)) return E(404, 'Постижението не е намерено.');
  return D(null);
}

function actDeleteAchievement_(p) {
  // Махаме и раздадените награди с това постижение
  readObjects_('Awards')
    .filter(function (a) { return String(a.achievementId) === String(p.id); })
    .forEach(function (a) { deleteById_('Awards', a.id); });
  deleteById_('Achievements', p.id);
  return D(null);
}

function actAward_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Awards', {
    id: id, childId: d.childId || '', achievementId: d.achievementId || '',
    awardedDate: nd_(d.awardedDate), awardedBy: d.awardedBy || '', note: d.note || '', createdAt: nowIso_()
  });
  return D({ id: id });
}

/* ============================================================
   Действия — Състезания
   ============================================================ */
function actCreateCompetition_(p) {
  var d = p.data || {};
  var id = Utilities.getUuid();
  appendObject_('Competitions', {
    id: id, childId: d.childId || '', eventDate: nd_(d.eventDate), eventName: d.eventName || '',
    results: d.results || '', notes: d.notes || '', createdBy: d.createdBy || '', createdAt: nowIso_()
  });
  return D({ id: id });
}

function actUpdateCompetition_(p) {
  var d = p.data || {};
  var patch = {};
  ['eventName','results','notes'].forEach(function (k) { if (d[k] !== undefined) patch[k] = d[k] === null ? '' : d[k]; });
  if (d.eventDate !== undefined) patch.eventDate = nd_(d.eventDate);
  if (!updateById_('Competitions', p.id, patch)) return E(404, 'Състезанието не е намерено.');
  return D(null);
}

/* ============================================================
   Действие — Родителски достъп (публично)
   ============================================================ */
function actParentDashboard_(p) {
  var code = String(p.code || '').trim();
  var bd = nd_(p.birthDate);
  var child = readObjects_('Children').filter(function (c) {
    return String(c.parentCode || '') === code && nd_(c.birthDate) === bd && nb_(c.isActive);
  })[0];
  if (!child) return E(404, 'Няма дете с този код и дата на раждане.');

  var co = childOut_(child);
  var ach = mapById_('Achievements');
  var awards = readObjects_('Awards')
    .filter(function (a) { return String(a.childId) === String(child.id); })
    .map(function (a) { var d = ach[a.achievementId] || {};
      return { icon: d.icon || '🏅', name: d.name || '', reward: nn_(d.reward), awardedDate: nd_(a.awardedDate) }; })
    .sort(function (a, b) { return (b.awardedDate || '').localeCompare(a.awardedDate || ''); });

  var sessions = mapById_('Sessions');
  var coaches = coachMap_();
  var history = readObjects_('Participants')
    .filter(function (pt) { return String(pt.childId) === String(child.id); })
    .map(function (pt) { var s = sessions[pt.sessionId] || {};
      return { sessionDate: nd_(s.sessionDate), coachName: (coaches[s.coachId] || {}).fullName || 'Треньор' }; })
    .filter(function (h) { return h.sessionDate; })
    .sort(function (a, b) { return (b.sessionDate || '').localeCompare(a.sessionDate || ''); });

  var progs = readObjects_('Progress')
    .filter(function (r) { return String(r.childId) === String(child.id); })
    .map(progressOut_)
    .sort(function (a, b) { return (b.assessmentDate || '').localeCompare(a.assessmentDate || ''); });

  return D({
    child: {
      firstName: co.firstName, lastName: co.lastName, birthDate: co.birthDate,
      photoUrl: co.photoUrl, level: co.level, goals: co.goals, ageYears: ageFromBd_(co.birthDate)
    },
    achievements: awards, history: history, progress: progs[0] || null
  });
}

/* ============================================================
   Изходни форматери
   ============================================================ */
function childOut_(c) {
  return {
    id: c.id, firstName: c.firstName, lastName: c.lastName,
    birthDate: nd_(c.birthDate), gender: nn_(c.gender), level: nn_(c.level),
    trainingStartDate: c.trainingStartDate ? nd_(c.trainingStartDate) : null,
    diagnosis: nn_(c.diagnosis), objectiveCondition: nn_(c.objectiveCondition),
    allergiesMedical: nn_(c.allergiesMedical), parentContact: nn_(c.parentContact),
    emergencyContact: nn_(c.emergencyContact), goals: nn_(c.goals), notes: nn_(c.notes),
    parentCode: String(c.parentCode || ''), photoUrl: nn_(c.photoUrl), isActive: nb_(c.isActive)
  };
}

function progressOut_(r) {
  return {
    id: r.id, childId: r.childId, coachId: nn_(r.coachId),
    assessmentDate: nd_(r.assessmentDate), periodLabel: nn_(r.periodLabel),
    jumpsAthletics: num_(r.jumpsAthletics), balanceCoordination: num_(r.balanceCoordination),
    strengthEndurance: num_(r.strengthEndurance), basicSkillsComment: nn_(r.basicSkillsComment),
    physStrength: num_(r.physStrength), physFlexibility: num_(r.physFlexibility),
    physEndurance: num_(r.physEndurance), physCoordination: num_(r.physCoordination),
    teamwork: num_(r.teamwork), discipline: num_(r.discipline),
    motivation: num_(r.motivation), concentration: num_(r.concentration),
    nextGoals: nn_(r.nextGoals), coachNotes: nn_(r.coachNotes),
    _createdAt: String(r.createdAt || '')
  };
}

/* ============================================================
   Достъп до таблицата
   ============================================================ */
function sh_(name) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh) throw new Error('Липсва таб „' + name + '". Пусни „Първоначална настройка".');
  return sh;
}

function headers_(name) {
  var sh = sh_(name);
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
}

function readObjects_(name) {
  var sh = sh_(name);
  if (sh.getLastRow() < 2) return [];
  var vals = sh.getDataRange().getValues();
  var headers = vals[0].map(String);
  var out = [];
  for (var i = 1; i < vals.length; i++) {
    var row = vals[i];
    var empty = true;
    for (var k = 0; k < row.length; k++) { if (row[k] !== '' && row[k] !== null) { empty = false; break; } }
    if (empty) continue;
    var o = {};
    for (var j = 0; j < headers.length; j++) o[headers[j]] = row[j];
    out.push(o);
  }
  return out;
}

function appendObject_(name, obj) {
  var sh = sh_(name);
  var headers = headers_(name);
  var r = sh.getLastRow() + 1;
  var rng = sh.getRange(r, 1, 1, headers.length);
  rng.setNumberFormat('@');
  var row = headers.map(function (h) {
    return (obj[h] !== undefined && obj[h] !== null) ? String(obj[h]) : '';
  });
  rng.setValues([row]);
  return obj;
}

function updateById_(name, id, patch) {
  var sh = sh_(name);
  var vals = sh.getDataRange().getValues();
  var headers = vals[0].map(String);
  var idCol = headers.indexOf('id');
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][idCol]) === String(id)) {
      var row = headers.map(function (h, j) {
        if (patch[h] !== undefined) return patch[h] === null ? '' : String(patch[h]);
        var v = vals[i][j];
        return (v === null || v === undefined) ? '' : String(v);
      });
      var rng = sh.getRange(i + 1, 1, 1, headers.length);
      rng.setNumberFormat('@');
      rng.setValues([row]);
      return true;
    }
  }
  return false;
}

function deleteById_(name, id) {
  var sh = sh_(name);
  var vals = sh.getDataRange().getValues();
  var headers = vals[0].map(String);
  var idCol = headers.indexOf('id');
  for (var i = vals.length - 1; i >= 1; i--) {
    if (String(vals[i][idCol]) === String(id)) { sh.deleteRow(i + 1); return true; }
  }
  return false;
}

function actDeleteById_(name, id) { deleteById_(name, id); return D(null); }

function findById_(name, id) {
  return readObjects_(name).filter(function (o) { return String(o.id) === String(id); })[0] || null;
}

function mapById_(name) {
  var m = {};
  readObjects_(name).forEach(function (o) { m[o.id] = o; });
  return m;
}

function coachMap_() { return mapById_('Coaches'); }
function childMap_() { return mapById_('Children'); }

function mustChild_(id) {
  var c = findById_('Children', id);
  if (!c) throw new Error('Детето не е намерено.');
  return c;
}

/* ============================================================
   Сигурност — токени и пароли
   ============================================================ */
function pepper_() {
  var props = PropertiesService.getScriptProperties();
  var s = props.getProperty('PEPPER');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); props.setProperty('PEPPER', s); }
  return s;
}

function sign_(msg) {
  var raw = Utilities.computeHmacSha256Signature(msg, pepper_());
  return Utilities.base64EncodeWebSafe(raw).replace(/=+$/, '');
}

function makeToken_(coachId) { return coachId + '.' + sign_('tok:' + coachId); }

function verifyToken_(token) {
  if (!token || String(token).indexOf('.') < 0) return null;
  var id = String(token).slice(0, String(token).lastIndexOf('.'));
  return token === makeToken_(id) ? id : null;
}

function hashPw_(plain) {
  var raw = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 'pw:' + pepper_() + ':' + plain, Utilities.Charset.UTF_8);
  return 'sha256:' + Utilities.base64Encode(raw);
}

/* ============================================================
   Дребни помощници
   ============================================================ */
function nowIso_() { return Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd'T'HH:mm:ss"); }
function pad2_(n) { n = String(n); return n.length < 2 ? '0' + n : n; }

function nn_(v) {  // празно → null
  if (v === null || v === undefined) return null;
  v = String(v);
  return v === '' ? null : v;
}

function nd_(v) {  // нормализирана дата „yyyy-MM-dd"
  if (v === null || v === undefined || v === '') return '';
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  return String(v).slice(0, 10);
}

function nt_(v) {  // време „HH:mm:ss"
  if (v === null || v === undefined || v === '') return '';
  if (Object.prototype.toString.call(v) === '[object Date]') return Utilities.formatDate(v, TZ, 'HH:mm:ss');
  return String(v);
}

function nb_(v) {  // булево
  return v === true || v === 1 || v === '1' ||
    String(v).toUpperCase() === 'TRUE' || String(v).toLowerCase() === 'true' ||
    String(v).toLowerCase() === 'да';
}

function num_(v) {  // число или null
  if (v === null || v === undefined || v === '') return null;
  var n = Number(v);
  return isNaN(n) ? null : n;
}

function numStr_(v) {  // за запис: число като текст, или празно
  if (v === null || v === undefined || v === '') return '';
  var n = Number(v);
  return isNaN(n) ? '' : String(n);
}

function newParentCode_() {
  var existing = {};
  readObjects_('Children').forEach(function (c) { existing[String(c.parentCode || '')] = 1; });
  for (var i = 0; i < 2000; i++) {
    var code = String(Math.floor(10000000 + Math.random() * 90000000));
    if (!existing[code]) return code;
  }
  return String(Date.now()).slice(-8);
}

function ageFromBd_(bd) {
  if (!bd) return null;
  var b = new Date(bd + 'T00:00:00'), n = new Date();
  var a = n.getFullYear() - b.getFullYear();
  if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
  return a;
}
