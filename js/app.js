/* Snap Count — client-side app. All state lives in localStorage. */

const STORAGE_KEY = "ffhq_state_v2";
const DEFAULT_SLOTS = ["QB", "RB", "RB", "WR", "WR", "TE", "FLEX", "DST", "K"];
const FLEX_ELIGIBLE = ["RB", "WR", "TE"];
const INJURY_LEVELS = ["Healthy", "Questionable", "Doubtful", "Out", "IR"];
const SEVERITY = { Healthy: 0, Questionable: 1, Doubtful: 2, Out: 3, IR: 3 };
const BOARD_POSITIONS = ["QB", "RB", "WR", "TE", "DST", "K"];
// Typical roster-construction targets (starters + realistic bench depth),
// used only as a draft-day guidance heuristic, independent of league slot config.
const RECOMMENDED_COUNTS = { QB: 2, RB: 5, WR: 6, TE: 2, DST: 1, K: 1 };
// Tier <= this counts as "top tier" for the scarcity note on Best Available.
const TOP_TIER_CUTOFF = 2;

// Full-PPR-ish defaults; editable in Import/Export -> Live Scoring.
const DEFAULT_SCORING = {
  passYdPerPt: 25, passTD: 4, passInt: -2,
  rushYdPerPt: 10, rushTD: 6,
  recYdPerPt: 10, recTD: 6, reception: 1,
  fumLost: -2,
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buildSeedState() {
  const players = SEED_PLAYERS.map(([name, pos, team, bye, tier, adpDelta], idx) => ({
    id: slugify(name) + "-" + pos.toLowerCase(),
    name, pos, team, bye,
    rank: idx + 1,
    tier,
    // FantasyPros "ECR vs. ADP": positive = experts rate them above where they're
    // actually being drafted (value); negative = market is drafting them ahead
    // of expert consensus (reach). null/undefined = no ADP data available.
    adpDelta: adpDelta === undefined ? null : adpDelta,
    status: "available", // available | mine | other
    injury: "Healthy",
  }));
  return {
    players,
    slots: DEFAULT_SLOTS.slice(),
    rosterAssignment: {},   // slotIndex -> playerId  (season default plan)
    weeklyLineup: {},       // week -> { slotIndex -> playerId }
    currentWeek: 1,
    pickLog: [],            // [{playerId, name, pos, status}] most recent last
    dataUpdatedAt: SEED_DATA_DATE,
    draftSettings: { numTeams: 10, yourSlot: 1, totalRounds: 15 },
    watchlist: [],           // playerIds you're targeting
    opponentTeams: [],       // [{id, name, playerIds}] teams you're tracking
    currentOpponentId: null, // id of the opponent team currently shown in the lineup tab
    liveScoring: { enabled: false, scoring: Object.assign({}, DEFAULT_SCORING) },
  };
}

const DEFAULT_DRAFT_SETTINGS = { numTeams: 10, yourSlot: 1, totalRounds: 15 };

let STATE = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.pickLog) parsed.pickLog = [];
      if (!parsed.dataUpdatedAt) parsed.dataUpdatedAt = SEED_DATA_DATE;
      if (!parsed.draftSettings) parsed.draftSettings = Object.assign({}, DEFAULT_DRAFT_SETTINGS);
      if (!parsed.watchlist) parsed.watchlist = [];
      if (!parsed.opponentTeams) parsed.opponentTeams = [];
      if (parsed.currentOpponentId === undefined) parsed.currentOpponentId = null;
      if (!parsed.liveScoring) parsed.liveScoring = { enabled: false, scoring: Object.assign({}, DEFAULT_SCORING) };
      if (!parsed.liveScoring.scoring) parsed.liveScoring.scoring = Object.assign({}, DEFAULT_SCORING);
      return parsed;
    }
  } catch (e) { /* fall through to seed */ }
  return buildSeedState();
}

function formatDataDate(isoDate) {
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

function playerById(id) {
  return STATE.players.find((p) => p.id === id);
}

function minePlayers() {
  return STATE.players.filter((p) => p.status === "mine");
}

function isWatched(id) {
  return STATE.watchlist.includes(id);
}

function toggleWatch(id) {
  const idx = STATE.watchlist.indexOf(id);
  if (idx === -1) STATE.watchlist.push(id);
  else STATE.watchlist.splice(idx, 1);
  save();
  renderAll();
}

/* ---------------- Tabs ---------------- */
document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab-btn");
  if (!btn) return;
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
  renderAll();
});

/* ---------------- Week selector ---------------- */
function initWeekSelect() {
  const sel = document.getElementById("currentWeek");
  sel.innerHTML = "";
  for (let w = 1; w <= 18; w++) {
    const o = document.createElement("option");
    o.value = w;
    o.textContent = "Week " + w;
    sel.appendChild(o);
  }
  sel.value = STATE.currentWeek || 1;
  sel.addEventListener("change", () => {
    STATE.currentWeek = parseInt(sel.value, 10);
    save();
    renderLineupTab();
    if (STATE.liveScoring.enabled) refreshLiveScoring();
  });
}

/* ================= DRAFT BOARD ================= */
let draftSort = { key: "rank", dir: 1 };

function renderDraftSummary() {
  const mine = minePlayers();
  const other = STATE.players.filter((p) => p.status === "other").length;
  const avail = STATE.players.filter((p) => p.status === "available").length;
  const posCounts = {};
  mine.forEach((p) => (posCounts[p.pos] = (posCounts[p.pos] || 0) + 1));
  const posStr = Object.keys(posCounts).sort().map((k) => `${k}: <b>${posCounts[k]}</b>`).join("  ·  ");
  document.getElementById("draftSummary").innerHTML =
    `My picks: <b>${mine.length}</b> &nbsp;|&nbsp; Drafted by others: <b>${other}</b> &nbsp;|&nbsp; Available: <b>${avail}</b>` +
    (posStr ? ` &nbsp;|&nbsp; ${posStr}` : "");
}

function renderDraftTable() {
  const search = document.getElementById("draftSearch").value.trim().toLowerCase();
  const posFilter = document.getElementById("draftPosFilter").value;
  const statusFilter = document.getElementById("draftStatusFilter").value;
  const watchlistOnly = document.getElementById("watchlistOnlyFilter").checked;

  let rows = STATE.players.filter((p) => {
    if (posFilter !== "ALL" && p.pos !== posFilter) return false;
    if (statusFilter === "AVAILABLE" && p.status !== "available") return false;
    if (statusFilter === "MINE" && p.status !== "mine") return false;
    if (statusFilter === "OTHER" && p.status !== "other") return false;
    if (watchlistOnly && !isWatched(p.id)) return false;
    if (search && !(p.name.toLowerCase().includes(search) || p.team.toLowerCase().includes(search))) return false;
    return true;
  });

  rows.sort((a, b) => {
    const k = draftSort.key;
    let av = a[k], bv = b[k];
    if (av === null || av === undefined) av = -Infinity;
    if (bv === null || bv === undefined) bv = -Infinity;
    if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return -1 * draftSort.dir;
    if (av > bv) return 1 * draftSort.dir;
    return 0;
  });

  const tbody = document.getElementById("draftTbody");
  tbody.innerHTML = "";
  rows.forEach((p) => {
    const tr = document.createElement("tr");
    if (p.status === "mine") tr.classList.add("drafted-mine");
    if (p.status === "other") tr.classList.add("drafted-other");
    const watched = isWatched(p.id);
    if (watched) tr.classList.add("watched-row");
    tr.innerHTML = `
      <td>${p.rank}</td>
      <td>${p.tier ?? ""}</td>
      <td><button class="star-btn${watched ? " active" : ""}" title="${watched ? "Remove from" : "Add to"} watchlist">${watched ? "★" : "☆"}</button>${p.name}</td>
      <td><span class="badge badge-${p.pos}">${p.pos}</span></td>
      <td>${p.team}</td>
      <td>${p.bye}</td>
      <td>${valueLabel(p)}</td>
      <td>${statusLabel(p)}</td>
      <td class="row-actions"></td>
    `;
    tr.querySelector(".star-btn").addEventListener("click", () => toggleWatch(p.id));
    const actionsTd = tr.querySelector(".row-actions");
    actionsTd.appendChild(actionButtonsFor(p));
    tbody.appendChild(tr);
  });
}

function statusLabel(p) {
  if (p.status === "mine") return `<span class="status-pill status-Healthy">My Team</span>`;
  if (p.status === "other") return `<span class="status-pill status-Out">Drafted</span>`;
  return `<span class="status-pill status-Questionable">Available</span>`;
}

// FantasyPros "ECR vs. ADP": positive = value (ranked above where drafted),
// negative = reach (being drafted ahead of expert consensus).
function valueLabel(p) {
  if (p.adpDelta === null || p.adpDelta === undefined) return `<span class="value-na">—</span>`;
  if (p.adpDelta === 0) return `<span class="value-even">even</span>`;
  const cls = p.adpDelta > 0 ? "value-up" : "value-down";
  const sign = p.adpDelta > 0 ? "+" : "";
  return `<span class="value-pill ${cls}">${sign}${p.adpDelta}</span>`;
}

function actionButtonsFor(p) {
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.gap = "6px";
  if (p.status === "available") {
    wrap.appendChild(mkBtn("Draft to Me", () => setStatus(p.id, "mine")));
    wrap.appendChild(mkBtn("Mark Taken", () => setStatus(p.id, "other")));
  } else {
    wrap.appendChild(mkBtn("Undo", () => setStatus(p.id, "available")));
  }
  return wrap;
}

function mkBtn(label, fn) {
  const b = document.createElement("button");
  b.textContent = label;
  b.addEventListener("click", fn);
  return b;
}

function setStatus(id, status, opts = {}) {
  const p = playerById(id);
  if (!p) return;
  p.status = status;
  if (status !== "mine") {
    // remove from any roster/lineup assignments
    Object.keys(STATE.rosterAssignment).forEach((k) => {
      if (STATE.rosterAssignment[k] === id) delete STATE.rosterAssignment[k];
    });
    Object.values(STATE.weeklyLineup).forEach((wk) => {
      Object.keys(wk).forEach((k) => { if (wk[k] === id) delete wk[k]; });
    });
  }
  if (!opts.silent && (status === "mine" || status === "other")) {
    STATE.pickLog.push({ playerId: id, name: p.name, pos: p.pos, status });
  }
  save();
  renderAll();
  toast(`${p.name} → ${status === "mine" ? "added to your team" : status === "other" ? "marked drafted" : "back to available"}`);
}

function undoLastPick() {
  const last = STATE.pickLog.pop();
  if (!last) { toast("No picks to undo."); return; }
  setStatus(last.playerId, "available", { silent: true });
  toast(`Undid pick: ${last.name}`);
}
document.getElementById("undoPickBtn").addEventListener("click", undoLastPick);

function renderPickHistory() {
  const el = document.getElementById("pickHistory");
  if (!STATE.pickLog.length) {
    el.innerHTML = `<span class="empty">No picks yet — draft a player to get started.</span>`;
    return;
  }
  const recent = STATE.pickLog.slice(-6).reverse();
  el.innerHTML = "Recent: " + recent
    .map((e) => `<b>${e.name}</b> (${e.pos}${e.status === "other" ? ", taken" : ""})`)
    .join("  ·  ");
}

// Snake-draft math: which league slot (1..numTeams) is on the clock at a
// given overall pick number. Odd rounds run 1→N, even rounds run N→1.
function slotOnClockAt(overallPick, numTeams) {
  const round = Math.ceil(overallPick / numTeams);
  const posInRound = overallPick - (round - 1) * numTeams;
  return round % 2 === 1 ? posInRound : numTeams - posInRound + 1;
}

function nextOverallPickForSlot(fromPick, yourSlot, numTeams) {
  let p = fromPick;
  while (slotOnClockAt(p, numTeams) !== yourSlot) p++;
  return p;
}

function renderDraftTracker() {
  const el = document.getElementById("draftTracker");
  const { numTeams, yourSlot, totalRounds } = STATE.draftSettings;

  if (!numTeams || numTeams < 2 || !yourSlot || yourSlot < 1 || yourSlot > numTeams) {
    el.className = "draft-tracker";
    el.innerHTML = `<span class="draft-tracker-setup">Set your league size and draft slot in <b>Import / Export → Draft Tracker</b> to see live round/pick tracking here.</span>`;
    return;
  }

  const picksMade = STATE.pickLog.length;
  const maxPicks = numTeams * (totalRounds || 15);
  const currentPick = picksMade + 1;

  if (currentPick > maxPicks) {
    el.className = "draft-tracker";
    el.innerHTML = `<span class="draft-tracker-main">Draft complete</span><span class="draft-tracker-progress">${picksMade} / ${maxPicks} picks made</span>`;
    return;
  }

  const currentRound = Math.ceil(currentPick / numTeams);
  const onClockSlot = slotOnClockAt(currentPick, numTeams);
  const isYourTurn = onClockSlot === yourSlot;
  const nextYourPick = nextOverallPickForSlot(currentPick, yourSlot, numTeams);
  const picksAway = nextYourPick - currentPick;
  const nextRound = Math.ceil(nextYourPick / numTeams);

  el.className = "draft-tracker" + (isYourTurn ? " on-clock" : "");
  const mainText = isYourTurn
    ? `🔥 You're on the clock — Round ${currentRound}, Pick ${currentPick} overall`
    : `Round ${currentRound}, Pick ${currentPick} overall`;
  const subText = isYourTurn
    ? `Make your pick, then mark it below.`
    : `Your next pick: #${nextYourPick} overall (Round ${nextRound}) — ${picksAway} pick${picksAway === 1 ? "" : "s"} away`;

  el.innerHTML = `
    <div>
      <div class="draft-tracker-main">${mainText}</div>
      <div class="draft-tracker-sub">${subText}</div>
    </div>
    <div class="draft-tracker-progress">${picksMade} / ${maxPicks} picks made</div>
  `;
}

function renderBestAvailable() {
  const el = document.getElementById("bestAvailable");
  el.innerHTML = "";
  BOARD_POSITIONS.forEach((pos) => {
    const avail = STATE.players
      .filter((p) => p.pos === pos && p.status === "available")
      .sort((a, b) => a.rank - b.rank);
    const card = document.createElement(avail.length ? "button" : "div");
    card.className = "best-card" + (avail.length ? "" : " empty");
    if (!avail.length) {
      card.innerHTML = `<div class="best-card-pos">${pos}</div><div class="best-card-meta">None left</div>`;
      el.appendChild(card);
      return;
    }
    const top = avail[0];
    const topTierLeft = avail.filter((p) => p.tier <= TOP_TIER_CUTOFF).length;
    if (isWatched(top.id)) card.classList.add("watched");
    card.innerHTML = `
      ${isWatched(top.id) ? `<span class="best-card-star" title="On your watchlist">★</span>` : ""}
      <div class="best-card-pos">${pos} · Rank ${top.rank}</div>
      <div class="best-card-name">${top.name}</div>
      <div class="best-card-meta">${top.team} · Bye ${top.bye} · ${valueLabel(top)}</div>
      ${topTierLeft ? `<div class="best-card-scarcity">${topTierLeft} top-tier left</div>` : ""}
    `;
    card.addEventListener("click", () => setStatus(top.id, "mine"));
    el.appendChild(card);
  });
}

function renderNeeds() {
  const el = document.getElementById("needsRow");
  el.innerHTML = "";
  const mine = minePlayers();
  BOARD_POSITIONS.forEach((pos) => {
    const have = mine.filter((p) => p.pos === pos).length;
    const target = RECOMMENDED_COUNTS[pos];
    const chip = document.createElement("span");
    chip.className = "need-chip" + (have >= target ? " filled" : "");
    chip.innerHTML = `<span class="pos">${pos}</span> ${have}/${target}`;
    el.appendChild(chip);
  });
}

document.getElementById("draftSearch").addEventListener("input", renderDraftTable);
document.getElementById("draftPosFilter").addEventListener("change", renderDraftTable);
document.getElementById("draftStatusFilter").addEventListener("change", renderDraftTable);
document.getElementById("watchlistOnlyFilter").addEventListener("change", renderDraftTable);
document.getElementById("resetDraftBtn").addEventListener("click", () => {
  if (!confirm("Reset draft? This clears all draft picks (players stay in the pool) and your roster.")) return;
  STATE.players.forEach((p) => (p.status = "available"));
  STATE.rosterAssignment = {};
  STATE.weeklyLineup = {};
  STATE.pickLog = [];
  save();
  renderAll();
  toast("Draft reset.");
});
document.querySelector("#draftTable thead").addEventListener("click", (e) => {
  const th = e.target.closest("th[data-sort]");
  if (!th) return;
  const key = th.dataset.sort;
  if (draftSort.key === key) draftSort.dir *= -1;
  else { draftSort.key = key; draftSort.dir = 1; }
  renderDraftTable();
});

/* ================= MY TEAM (season default lineup) ================= */
function eligibleForSlot(slotName, playerPos) {
  if (slotName === "FLEX") return FLEX_ELIGIBLE.includes(playerPos);
  return slotName === playerPos;
}

function renderRosterGrid(containerId, assignment, onChange, weekMode, week) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const mine = minePlayers();
  const usedIds = new Set(Object.values(assignment).filter(Boolean));

  STATE.slots.forEach((slotName, idx) => {
    const card = document.createElement("div");
    const assignedId = assignment[idx];
    const p = assignedId ? playerById(assignedId) : null;
    card.className = "slot-card" + (p ? "" : " empty");

    let flags = "";
    let alertFlag = false;
    if (p && weekMode) {
      if (p.bye === week) { flags += `<span class="status-pill status-Bye">BYE Wk ${week}</span>`; alertFlag = true; }
      if (p.injury !== "Healthy") { flags += `<span class="status-pill status-${p.injury}">${p.injury}</span>`; if (p.injury === "Out" || p.injury === "IR" || p.injury === "Doubtful") alertFlag = true; }
      if (STATE.liveScoring.enabled) {
        const pts = livePointsFor(p);
        if (pts !== null) flags += `<span class="live-pts">${pts} pts</span>`;
      }
    } else if (p) {
      if (p.injury !== "Healthy") flags += `<span class="status-pill status-${p.injury}">${p.injury}</span>`;
    }
    if (alertFlag) card.classList.add("alert");

    card.innerHTML = `
      <div class="slot-label">${slotName}${weekMode ? " · Wk " + week : ""}</div>
      ${p
        ? `<div class="slot-player-name">${p.name}</div>
           <div class="slot-player-meta"><span class="badge badge-${p.pos}">${p.pos}</span> ${p.team} · Bye ${p.bye}</div>
           <div class="slot-flags">${flags}</div>`
        : `<div class="slot-empty-text">Empty slot</div>`
      }
    `;

    const select = document.createElement("select");
    select.className = "slot-select";
    const emptyOpt = document.createElement("option");
    emptyOpt.value = "";
    emptyOpt.textContent = "— empty —";
    select.appendChild(emptyOpt);

    mine
      .filter((cand) => eligibleForSlot(slotName, cand.pos))
      .filter((cand) => cand.id === assignedId || !usedIds.has(cand.id))
      .sort((a, b) => a.rank - b.rank)
      .forEach((cand) => {
        const o = document.createElement("option");
        o.value = cand.id;
        let tag = "";
        if (weekMode && cand.bye === week) tag = " [BYE]";
        else if (cand.injury !== "Healthy") tag = ` [${cand.injury}]`;
        o.textContent = `${cand.name} (${cand.pos}, ${cand.team})${tag}`;
        if (cand.id === assignedId) o.selected = true;
        select.appendChild(o);
      });

    select.addEventListener("change", () => onChange(idx, select.value || null));
    card.appendChild(select);
    container.appendChild(card);
  });
}

function renderBenchTable(tbodyId, assignment, weekMode) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";
  const usedIds = new Set(Object.values(assignment).filter(Boolean));
  const bench = minePlayers().filter((p) => !usedIds.has(p.id)).sort((a, b) => a.rank - b.rank);
  bench.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td><span class="badge badge-${p.pos}">${p.pos}</span></td>
      <td>${p.team}</td>
      <td>${p.bye}</td>
      <td></td>
      ${weekMode ? `<td>${livePointsCellHtml(p)}</td>` : ""}
      <td></td>
    `;
    const injuryTd = tr.children[4];
    const injSel = document.createElement("select");
    injSel.className = "injury-select";
    INJURY_LEVELS.forEach((lvl) => {
      const o = document.createElement("option");
      o.value = lvl; o.textContent = lvl;
      if (p.injury === lvl) o.selected = true;
      injSel.appendChild(o);
    });
    injSel.addEventListener("change", () => {
      p.injury = injSel.value;
      save();
      renderAll();
    });
    injuryTd.appendChild(injSel);

    const actionsTd = tr.children[weekMode ? 6 : 5];
    actionsTd.appendChild(mkBtn("Drop", () => setStatus(p.id, "available")));
    tbody.appendChild(tr);
  });
}

function renderTeamTab() {
  renderRosterGrid("rosterGrid", STATE.rosterAssignment, (idx, val) => {
    if (val) STATE.rosterAssignment[idx] = val;
    else delete STATE.rosterAssignment[idx];
    save();
    renderAll();
  }, false, null);
  renderBenchTable("benchTbody", STATE.rosterAssignment);
}

document.getElementById("resetTeamBtn").addEventListener("click", () => {
  if (!confirm("Clear your season lineup? All starting slots go back to empty (everyone moves to the bench). Your draft picks are not affected.")) return;
  STATE.rosterAssignment = {};
  save();
  renderAll();
  toast("Lineup cleared.");
});

/* ================= WEEKLY LINEUP ================= */
// The weekly lineup defaults to the season roster plan, but any slot can be
// overridden for a specific week (manually or via auto-optimize) without
// losing that default — overrides are stored sparsely per week/slot,
// including explicit "empty" (null), and merged with the default on read.
function effectiveWeekAssignment(week) {
  const overrides = STATE.weeklyLineup[week] || {};
  const result = {};
  STATE.slots.forEach((_, idx) => {
    result[idx] = Object.prototype.hasOwnProperty.call(overrides, idx)
      ? overrides[idx]
      : STATE.rosterAssignment[idx] || null;
  });
  return result;
}

const SEASON_WEEKS = 18;

// A player counts as "available" for a given week if it's not their bye week
// and their current injury designation isn't Doubtful/Out/IR. Injury status
// is a single current field (not per-week), so this is only a reliable
// signal for the near-term weeks — treat anything further out as a
// bye-only preview, per the hint text on the Season Overview table.
function isAvailableForWeek(p, week) {
  if (p.bye === week) return false;
  return SEVERITY[p.injury] < 2;
}

function renderSeasonOverview() {
  const head = document.getElementById("seasonOverviewHead");
  const body = document.getElementById("seasonOverviewBody");
  const mine = minePlayers();
  const currentWeek = STATE.currentWeek;

  head.innerHTML = "<th>Position</th>" +
    Array.from({ length: SEASON_WEEKS }, (_, i) => `<th>Wk ${i + 1}</th>`).join("");

  const weakWeeks = [];
  body.innerHTML = "";
  BOARD_POSITIONS.forEach((pos) => {
    const atPos = mine.filter((p) => p.pos === pos);
    const total = atPos.length;
    const tr = document.createElement("tr");
    let cells = `<td>${pos}</td>`;
    for (let week = 1; week <= SEASON_WEEKS; week++) {
      const availCount = atPos.filter((p) => isAvailableForWeek(p, week)).length;
      let cls = "avail-cell ";
      if (total === 0) cls += "avail-ok";
      else if (availCount === 0) { cls += "avail-danger"; weakWeeks.push({ week, pos }); }
      else if (availCount === 1) cls += "avail-warn";
      else cls += "avail-ok";
      if (week === currentWeek) cls += " avail-current";
      const label = total === 0 ? "–" : `${availCount}/${total}`;
      cells += `<td class="${cls}">${label}</td>`;
    }
    tr.innerHTML = cells;
    body.appendChild(tr);
  });

  const el = document.getElementById("seasonOverviewAlerts");
  if (!mine.length) {
    el.textContent = "";
  } else if (weakWeeks.length) {
    const grouped = {};
    weakWeeks.forEach(({ week, pos }) => {
      grouped[week] = grouped[week] || [];
      grouped[week].push(pos);
    });
    const summary = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((week) => `Wk ${week} (no ${grouped[week].join("/")})`)
      .join(", ");
    el.textContent = `⚠ Zero available players: ${summary}`;
  } else {
    el.textContent = "✓ No zero-available weeks across your current roster.";
  }
}

function renderLineupTab() {
  const week = STATE.currentWeek;
  const assignment = effectiveWeekAssignment(week);

  renderRosterGrid("lineupGrid", assignment, (idx, val) => {
    if (!STATE.weeklyLineup[week]) STATE.weeklyLineup[week] = {};
    STATE.weeklyLineup[week][idx] = val || null;
    save();
    renderLineupTab();
  }, true, week);
  renderBenchTable("lineupBenchTbody", assignment, true);

  let alerts = 0;
  STATE.slots.forEach((slotName, idx) => {
    const p = assignment[idx] ? playerById(assignment[idx]) : null;
    if (!p) { alerts++; return; }
    if (p.bye === week) alerts++;
    else if (p.injury === "Out" || p.injury === "IR" || p.injury === "Doubtful") alerts++;
  });
  document.getElementById("lineupAlerts").textContent = alerts
    ? `⚠ ${alerts} slot(s) need attention this week`
    : "✓ Lineup looks good for this week";

  renderOpponentTracker();
}

function autoOptimizeWeek() {
  const week = STATE.currentWeek;
  const pool = minePlayers().map((p) => ({
    player: p,
    severity: p.bye === week ? 3 : SEVERITY[p.injury],
  }));

  const newAssignment = {};
  const used = new Set();

  const order = STATE.slots
    .map((name, idx) => ({ name, idx }))
    .sort((a, b) => (a.name === "FLEX") - (b.name === "FLEX"));

  order.forEach(({ name, idx }) => {
    const candidates = pool
      .filter((c) => !used.has(c.player.id) && eligibleForSlot(name, c.player.pos))
      .sort((a, b) => a.severity - b.severity || a.player.rank - b.player.rank);
    if (candidates.length) {
      const chosen = candidates[0];
      newAssignment[idx] = chosen.player.id;
      used.add(chosen.player.id);
    } else {
      newAssignment[idx] = null;
    }
  });

  STATE.weeklyLineup[week] = newAssignment;
  save();
  renderLineupTab();
  toast("Lineup auto-optimized for Week " + week);
}

document.getElementById("autoOptimizeBtn").addEventListener("click", autoOptimizeWeek);

document.getElementById("resetWeekLineupBtn").addEventListener("click", () => {
  const week = STATE.currentWeek;
  if (!confirm(`Reset Week ${week} back to your season default lineup? Any manual changes or auto-optimize swaps made for this week only will be discarded.`)) return;
  delete STATE.weeklyLineup[week];
  save();
  renderLineupTab();
  toast(`Week ${week} reset to season default.`);
});

/* ================= OPPONENT TRACKER ================= */
function opponentTeamsList() {
  return STATE.opponentTeams;
}

function currentOpponentTeam() {
  return STATE.opponentTeams.find((t) => t.id === STATE.currentOpponentId) || null;
}

function opponentAssignedPlayerIds() {
  const ids = new Set();
  STATE.opponentTeams.forEach((t) => t.playerIds.forEach((id) => ids.add(id)));
  return ids;
}

function renderOpponentTeamSelect() {
  const sel = document.getElementById("opponentTeamSelect");
  sel.innerHTML = '<option value="">— No opponent selected —</option>' +
    STATE.opponentTeams.map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
  sel.value = STATE.currentOpponentId || "";
}

function renderOpponentAddSelect() {
  const sel = document.getElementById("opponentAddPlayer");
  const team = currentOpponentTeam();
  if (!team) {
    sel.innerHTML = '<option value="">+ Add player to opponent roster…</option>';
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  const assigned = opponentAssignedPlayerIds();
  const candidates = STATE.players
    .filter((p) => p.status === "other" && !assigned.has(p.id))
    .sort((a, b) => a.rank - b.rank);
  sel.innerHTML = '<option value="">+ Add player to opponent roster…</option>' +
    candidates.map((p) => `<option value="${p.id}">${p.name} (${p.pos} · ${p.team}) — Rank ${p.rank}</option>`).join("");
  sel.value = "";
}

function renderOpponentRoster() {
  const tbody = document.getElementById("opponentRosterTbody");
  tbody.innerHTML = "";
  const alertsEl = document.getElementById("opponentAlerts");
  const team = currentOpponentTeam();
  if (!team) {
    alertsEl.textContent = "";
    return;
  }
  const week = STATE.currentWeek;
  const roster = team.playerIds
    .map((id) => playerById(id))
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank);

  let unavailable = 0;
  roster.forEach((p) => {
    if (!isAvailableForWeek(p, week)) unavailable++;
    const weekLabel = p.bye === week
      ? `<span class="status-pill status-Bye">BYE Wk ${week}</span>`
      : p.injury !== "Healthy"
        ? `<span class="status-pill status-${p.injury}">${p.injury}</span>`
        : `<span class="status-pill status-Healthy">Active</span>`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.name}</td>
      <td><span class="badge badge-${p.pos}">${p.pos}</span></td>
      <td>${p.team}</td>
      <td>${p.bye}</td>
      <td>${p.injury}</td>
      <td>${weekLabel}</td>
      <td>${livePointsCellHtml(p)}</td>
      <td></td>
    `;
    const actionsTd = tr.children[7];
    actionsTd.appendChild(mkBtn("Remove", () => {
      team.playerIds = team.playerIds.filter((id) => id !== p.id);
      save();
      renderOpponentTracker();
    }));
    tbody.appendChild(tr);
  });

  alertsEl.textContent = roster.length
    ? `${roster.length - unavailable}/${roster.length} of ${team.name}'s tracked players available in Week ${week}`
    : `No players added to ${team.name} yet.`;
}

// A read-only "best lineup" for a pool of players, mirroring autoOptimizeWeek's
// slot-fill logic but without touching STATE — used to preview how an
// opponent's tracked players would likely start this week.
function computeBestLineup(pool, week) {
  const scored = pool.map((p) => ({ player: p, severity: p.bye === week ? 3 : SEVERITY[p.injury] }));
  const assignment = {};
  const used = new Set();
  const order = STATE.slots
    .map((name, idx) => ({ name, idx }))
    .sort((a, b) => (a.name === "FLEX") - (b.name === "FLEX"));
  order.forEach(({ name, idx }) => {
    const candidates = scored
      .filter((c) => !used.has(c.player.id) && eligibleForSlot(name, c.player.pos))
      .sort((a, b) => a.severity - b.severity || a.player.rank - b.player.rank);
    assignment[idx] = candidates.length ? candidates[0].player : null;
    if (candidates.length) used.add(candidates[0].player.id);
  });
  return assignment;
}

function matchupPlayerCell(p, week, side) {
  const alignCls = side === "away" ? " away" : "";
  if (!p) return `<div class="matchup-player${alignCls}"><span class="matchup-player-empty">Empty</span></div>`;
  let flag = "";
  if (p.bye === week) flag = `<span class="status-pill status-Bye">BYE</span>`;
  else if (p.injury !== "Healthy") flag = `<span class="status-pill status-${p.injury}">${p.injury}</span>`;
  const livePts = livePointsFor(p);
  const valLine = livePts !== null
    ? `<span class="live-pts">${livePts} live pts</span>`
    : `<span class="matchup-player-val">${tradeValue(p)} val</span>`;
  return `
    <div class="matchup-player${alignCls}">
      <span class="matchup-player-name">${p.name}</span>
      <span class="matchup-player-meta"><span class="badge badge-${p.pos}">${p.pos}</span> ${p.team} ${flag}</span>
      ${valLine}
    </div>`;
}

function renderMatchup() {
  const card = document.getElementById("matchupCard");
  const team = currentOpponentTeam();
  if (!team) { card.hidden = true; card.innerHTML = ""; return; }
  card.hidden = false;

  const week = STATE.currentWeek;
  const myAssignment = effectiveWeekAssignment(week);
  const oppPool = team.playerIds.map((id) => playerById(id)).filter(Boolean);
  const oppAssignment = computeBestLineup(oppPool, week);

  const liveAvailable = STATE.liveScoring.enabled && LIVE.week === week;
  let totalMine = 0, totalOpp = 0, missingMine = 0, missingOpp = 0, filledMine = 0, filledOpp = 0;
  STATE.slots.forEach((_, idx) => {
    const mine = myAssignment[idx] ? playerById(myAssignment[idx]) : null;
    const opp = oppAssignment[idx];
    if (mine) {
      filledMine++;
      const live = liveAvailable ? livePointsFor(mine) : null;
      if (liveAvailable && live === null) missingMine++;
      totalMine += liveAvailable ? (live || 0) : tradeValue(mine);
    }
    if (opp) {
      filledOpp++;
      const live = liveAvailable ? livePointsFor(opp) : null;
      if (liveAvailable && live === null) missingOpp++;
      totalOpp += liveAvailable ? (live || 0) : tradeValue(opp);
    }
  });
  if (liveAvailable) { totalMine = Math.round(totalMine * 100) / 100; totalOpp = Math.round(totalOpp * 100) / 100; }

  const sum = totalMine + totalOpp;
  const pctMine = sum ? Math.round((totalMine / sum) * 100) : 50;
  const pctOpp = 100 - pctMine;
  const mineFavored = pctMine === pctOpp ? null : pctMine > pctOpp;

  const rows = STATE.slots.map((slotName, idx) => {
    const mine = myAssignment[idx] ? playerById(myAssignment[idx]) : null;
    return `
      <tr class="matchup-row">
        <td>${matchupPlayerCell(mine, week, "home")}</td>
        <td class="matchup-slot-col">${slotName}</td>
        <td>${matchupPlayerCell(oppAssignment[idx], week, "away")}</td>
      </tr>`;
  }).join("");

  const totalsLabel = liveAvailable
    ? `Live pts (Week ${week})${(missingMine + missingOpp) ? " — some players missing live data" : ""}`
    : "Est. value (rank-based) — not a real point projection";

  card.innerHTML = `
    <div class="matchup-teams">
      <div class="matchup-team">
        <div class="matchup-team-icon">🏈</div>
        <div class="matchup-team-name">Your Team</div>
        <div class="matchup-team-sub">Week ${week} lineup</div>
      </div>
      <div class="matchup-vs">
        <div class="matchup-totals">${totalMine} <span class="vs">vs</span> ${totalOpp}</div>
        <div class="matchup-sub">${totalsLabel}</div>
      </div>
      <div class="matchup-team">
        <div class="matchup-team-icon">🛡️</div>
        <div class="matchup-team-name">${team.name}</div>
        <div class="matchup-team-sub">${oppPool.length} tracked player${oppPool.length === 1 ? "" : "s"}</div>
      </div>
    </div>
    <div class="matchup-bar">
      <div class="matchup-bar-fill-a" style="width:${pctMine}%"></div>
      <div class="matchup-bar-fill-b" style="width:${pctOpp}%"></div>
    </div>
    <div class="matchup-bar-labels">
      <span>${mineFavored === true ? "Favorite" : mineFavored === false ? "Underdog" : "Even"} ${pctMine}%</span>
      <span>${pctOpp}% ${mineFavored === false ? "Favorite" : mineFavored === true ? "Underdog" : "Even"}</span>
    </div>
    <table class="matchup-table">
      <thead><tr><th>Your Player</th><th>Slot</th><th>${team.name}</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderOpponentTracker() {
  renderOpponentTeamSelect();
  renderOpponentAddSelect();
  renderOpponentRoster();
  renderMatchup();
}

document.getElementById("opponentTeamSelect").addEventListener("change", (e) => {
  STATE.currentOpponentId = e.target.value || null;
  save();
  renderOpponentTracker();
});

document.getElementById("addOpponentTeamBtn").addEventListener("click", () => {
  const input = document.getElementById("opponentTeamNameInput");
  const name = input.value.trim();
  if (!name) { toast("Enter a name for the opponent team."); return; }
  const team = { id: "opp-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, playerIds: [] };
  STATE.opponentTeams.push(team);
  STATE.currentOpponentId = team.id;
  input.value = "";
  save();
  renderOpponentTracker();
  toast(`${name} added — now tracking.`);
});

document.getElementById("removeOpponentTeamBtn").addEventListener("click", () => {
  const team = currentOpponentTeam();
  if (!team) return;
  if (!confirm(`Remove "${team.name}" and stop tracking it? This won't affect any drafted player statuses.`)) return;
  STATE.opponentTeams = STATE.opponentTeams.filter((t) => t.id !== team.id);
  STATE.currentOpponentId = null;
  save();
  renderOpponentTracker();
  toast(`${team.name} removed.`);
});

document.getElementById("opponentAddPlayer").addEventListener("change", (e) => {
  const team = currentOpponentTeam();
  const id = e.target.value;
  if (!team || !id) return;
  if (!team.playerIds.includes(id)) team.playerIds.push(id);
  save();
  renderOpponentTracker();
});

/* ================= TRADE ANALYZER ================= */
// Simple linear rank-based estimate: the #1 overall player is worth the most,
// value tapers to 0 by the back of the ranked pool. This is only meant to
// sanity-check a trade at a glance, not to replace real judgment about need,
// bye weeks, etc. — the hint text on the tab says as much.
function tradeValue(p) {
  return Math.max(0, 260 - p.rank);
}

let tradeSideA = [];
let tradeSideB = [];

function tradeablePlayers() {
  return STATE.players
    .filter((p) => p.status === "mine" || p.status === "other")
    .sort((a, b) => a.rank - b.rank);
}

function renderTradeSelect(selectId, excludeIds) {
  const sel = document.getElementById(selectId);
  const prevValue = sel.value;
  sel.innerHTML = '<option value="">+ Add player…</option>' +
    tradeablePlayers()
      .filter((p) => !excludeIds.has(p.id))
      .map((p) => `<option value="${p.id}">${p.name} (${p.pos} · ${p.team}) — Rank ${p.rank}${p.status === "mine" ? " · Yours" : ""}</option>`)
      .join("");
  sel.value = "";
}

function renderTradeList(listId, subtotalId, side) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  side.forEach((p) => {
    const row = document.createElement("div");
    row.className = "trade-player-row";
    row.innerHTML = `
      <div>
        <div class="name">${p.name}</div>
        <div class="meta">${p.pos} · ${p.team} · Rank ${p.rank}${p.status === "mine" ? " · Yours" : ""}</div>
      </div>
      <div class="val">${tradeValue(p)} pts</div>
      <button class="remove-btn" aria-label="Remove ${p.name}">✕</button>`;
    row.querySelector(".remove-btn").addEventListener("click", () => {
      if (side === tradeSideA) tradeSideA = tradeSideA.filter((x) => x.id !== p.id);
      else tradeSideB = tradeSideB.filter((x) => x.id !== p.id);
      renderTradeTab();
    });
    list.appendChild(row);
  });
  const total = side.reduce((sum, p) => sum + tradeValue(p), 0);
  document.getElementById(subtotalId).textContent = `Total value: ${total}`;
  return total;
}

function renderTradeTab() {
  const usedIds = new Set([...tradeSideA, ...tradeSideB].map((p) => p.id));
  renderTradeSelect("tradeAddA", usedIds);
  renderTradeSelect("tradeAddB", usedIds);

  const totalA = renderTradeList("tradeListA", "tradeSubtotalA", tradeSideA);
  const totalB = renderTradeList("tradeListB", "tradeSubtotalB", tradeSideB);

  const verdict = document.getElementById("tradeVerdict");
  if (!tradeSideA.length && !tradeSideB.length) {
    verdict.textContent = "Add players to both sides to see a verdict.";
    return;
  }
  const diff = Math.abs(totalA - totalB);
  const favored = totalA === totalB ? null : totalA > totalB ? "A" : "B";
  if (diff <= 15) {
    verdict.innerHTML = `<span class="trade-verdict-even">Fairly even trade</span> — value gap is only ${diff} points.`;
  } else {
    const favoredLabel = favored === "A" ? "Side B" : "Side A";
    verdict.innerHTML = `<span class="trade-verdict-favors-${favored === "A" ? "b" : "a"}">${favoredLabel} comes out ahead</span> by about ${diff} value points. Weigh that against roster needs before pulling the trigger.`;
  }
}

document.getElementById("tradeAddA").addEventListener("change", (e) => {
  const p = playerById(e.target.value);
  if (p) tradeSideA.push(p);
  renderTradeTab();
});
document.getElementById("tradeAddB").addEventListener("change", (e) => {
  const p = playerById(e.target.value);
  if (p) tradeSideB.push(p);
  renderTradeTab();
});
document.getElementById("tradeResetBtn").addEventListener("click", () => {
  tradeSideA = [];
  tradeSideB = [];
  renderTradeTab();
});

/* ================= PLAYER COMPARISON ================= */
let comparePlayers = [];

const COMPARE_ROWS = [
  { label: "Position", get: (p) => p.pos },
  { label: "Team", get: (p) => p.team },
  { label: "Bye", get: (p) => p.bye },
  { label: "Rank", get: (p) => p.rank, lowerIsBetter: true },
  { label: "Tier", get: (p) => p.tier, lowerIsBetter: true },
  { label: "Value (ADP)", get: (p) => (p.adpDelta === null || p.adpDelta === undefined ? "—" : p.adpDelta === 0 ? "even" : (p.adpDelta > 0 ? "+" : "") + p.adpDelta), higherIsBetter: true, raw: (p) => p.adpDelta },
  { label: "Status", get: (p) => p.status === "mine" ? "Yours" : p.status === "other" ? "Drafted (other)" : "Available" },
  { label: "Injury", get: (p) => p.injury },
];

function renderCompareSelect() {
  const sel = document.getElementById("compareAdd");
  const usedIds = new Set(comparePlayers.map((p) => p.id));
  const disabled = comparePlayers.length >= 4;
  sel.innerHTML = '<option value="">+ Add player to compare…</option>' +
    STATE.players
      .filter((p) => !usedIds.has(p.id))
      .sort((a, b) => a.rank - b.rank)
      .map((p) => `<option value="${p.id}">${p.name} (${p.pos} · ${p.team}) — Rank ${p.rank}</option>`)
      .join("");
  sel.value = "";
  sel.disabled = disabled;
}

function renderCompareTab() {
  renderCompareSelect();
  const head = document.getElementById("compareHead");
  const body = document.getElementById("compareBody");

  if (!comparePlayers.length) {
    head.innerHTML = "<th>Player</th>";
    body.innerHTML = `<tr><td class="hint" style="padding:16px;">Add players above to compare them side by side.</td></tr>`;
    return;
  }

  head.innerHTML = "<th>Player</th>" + comparePlayers.map((p) => `
    <th>${p.name}<button class="compare-remove" data-id="${p.id}" aria-label="Remove ${p.name}" style="margin-left:8px;">✕</button></th>
  `).join("");

  body.innerHTML = "";
  COMPARE_ROWS.forEach((row) => {
    const tr = document.createElement("tr");
    let bestVal = null;
    if (row.lowerIsBetter) bestVal = Math.min(...comparePlayers.map((p) => row.get(p)));
    if (row.higherIsBetter) {
      const vals = comparePlayers.map((p) => row.raw(p)).filter((v) => v !== null && v !== undefined);
      bestVal = vals.length ? Math.max(...vals) : null;
    }
    let cells = `<td>${row.label}</td>`;
    comparePlayers.forEach((p) => {
      const val = row.get(p);
      const isBest = row.lowerIsBetter
        ? val === bestVal
        : row.higherIsBetter
        ? row.raw(p) === bestVal && bestVal !== null
        : false;
      cells += `<td${isBest ? ' class="compare-best"' : ""}>${val}</td>`;
    });
    tr.innerHTML = cells;
    body.appendChild(tr);
  });

  head.querySelectorAll(".compare-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      comparePlayers = comparePlayers.filter((p) => p.id !== btn.dataset.id);
      renderCompareTab();
    });
  });
}

document.getElementById("compareAdd").addEventListener("change", (e) => {
  const p = playerById(e.target.value);
  if (p && comparePlayers.length < 4) comparePlayers.push(p);
  renderCompareTab();
});
document.getElementById("compareResetBtn").addEventListener("click", () => {
  comparePlayers = [];
  renderCompareTab();
});

/* ================= IMPORT / EXPORT ================= */
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const obj = {};
    header.forEach((h, i) => (obj[h] = cells[i]));
    return obj;
  });
}

function importCsv(text) {
  const rows = parseCsv(text);
  if (!rows.length) { toast("No rows found in CSV."); return; }
  const existingByName = {};
  STATE.players.forEach((p) => (existingByName[p.name.toLowerCase() + "|" + p.pos] = p));

  const newPlayers = rows.map((r, i) => {
    const name = r.name || "Unknown";
    const pos = (r.pos || "").toUpperCase();
    const key = name.toLowerCase() + "|" + pos;
    const prev = existingByName[key];
    return {
      id: prev ? prev.id : slugify(name) + "-" + pos.toLowerCase(),
      name,
      pos,
      team: r.team || "FA",
      bye: parseInt(r.bye, 10) || 0,
      rank: parseInt(r.rank, 10) || i + 1,
      tier: parseInt(r.tier, 10) || Math.ceil((parseInt(r.rank, 10) || i + 1) / 12),
      adpDelta: r.adpdelta !== undefined && r.adpdelta !== "" && !Number.isNaN(parseInt(r.adpdelta, 10))
        ? parseInt(r.adpdelta, 10)
        : null,
      status: prev ? prev.status : "available",
      injury: prev ? prev.injury : "Healthy",
    };
  });

  STATE.players = newPlayers;
  STATE.dataUpdatedAt = new Date().toISOString().slice(0, 10);
  // clean up assignments pointing to removed players
  const validIds = new Set(newPlayers.map((p) => p.id));
  Object.keys(STATE.rosterAssignment).forEach((k) => {
    if (!validIds.has(STATE.rosterAssignment[k])) delete STATE.rosterAssignment[k];
  });
  Object.values(STATE.weeklyLineup).forEach((wk) => {
    Object.keys(wk).forEach((k) => { if (!validIds.has(wk[k])) delete wk[k]; });
  });
  save();
  renderAll();
  toast(`Imported ${newPlayers.length} players.`);
}

document.getElementById("importBtn").addEventListener("click", () => {
  const text = document.getElementById("importText").value;
  if (!text.trim()) { toast("Paste or choose a CSV first."); return; }
  importCsv(text);
});
document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { document.getElementById("importText").value = reader.result; };
  reader.readAsText(file);
});

function toCsv() {
  const header = "name,pos,team,bye,rank,tier,adpDelta,status,injury";
  const lines = STATE.players
    .slice()
    .sort((a, b) => a.rank - b.rank)
    .map((p) => [p.name, p.pos, p.team, p.bye, p.rank, p.tier, p.adpDelta ?? "", p.status, p.injury].join(","));
  return [header, ...lines].join("\n");
}

function downloadFile(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("exportCsvBtn").addEventListener("click", () => {
  downloadFile("fantasy-players.csv", toCsv(), "text/csv");
});
document.getElementById("exportJsonBtn").addEventListener("click", () => {
  downloadFile("fantasy-football-backup.json", JSON.stringify(STATE, null, 2), "application/json");
});
document.getElementById("restoreBtn").addEventListener("click", () => {
  const text = document.getElementById("restoreText").value;
  if (!text.trim()) { toast("Paste JSON backup first."); return; }
  try {
    const parsed = JSON.parse(text);
    if (!parsed.players) throw new Error("missing players");
    if (!parsed.dataUpdatedAt) parsed.dataUpdatedAt = SEED_DATA_DATE;
    if (!parsed.pickLog) parsed.pickLog = [];
    if (!parsed.draftSettings) parsed.draftSettings = Object.assign({}, DEFAULT_DRAFT_SETTINGS);
    if (!parsed.watchlist) parsed.watchlist = [];
    STATE = parsed;
    save();
    renderAll();
    toast("Backup restored.");
  } catch (e) {
    toast("Invalid JSON backup.");
  }
});
document.getElementById("restoreFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { document.getElementById("restoreText").value = reader.result; };
  reader.readAsText(file);
});

document.getElementById("saveSlotsBtn").addEventListener("click", () => {
  const raw = document.getElementById("slotsInput").value;
  const slots = raw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  if (!slots.length) { toast("Enter at least one slot."); return; }
  STATE.slots = slots;
  STATE.rosterAssignment = {};
  STATE.weeklyLineup = {};
  save();
  renderAll();
  toast("Roster slots saved. Lineups were reset to match the new slots.");
});
document.getElementById("resetAllBtn").addEventListener("click", () => {
  if (!confirm("This wipes ALL data (players, draft, team, lineups) and reloads the default player pool. Continue?")) return;
  STATE = buildSeedState();
  save();
  renderAll();
  toast("Everything reset to defaults.");
});

document.getElementById("saveDraftTrackerBtn").addEventListener("click", () => {
  const numTeams = parseInt(document.getElementById("draftNumTeams").value, 10);
  const yourSlot = parseInt(document.getElementById("draftYourSlot").value, 10);
  const totalRounds = parseInt(document.getElementById("draftTotalRounds").value, 10);
  if (!numTeams || numTeams < 2 || numTeams > 32) { toast("Enter a valid number of teams (2-32)."); return; }
  if (!yourSlot || yourSlot < 1 || yourSlot > numTeams) { toast("Your draft slot must be between 1 and the number of teams."); return; }
  if (!totalRounds || totalRounds < 1) { toast("Enter a valid number of rounds."); return; }
  STATE.draftSettings = { numTeams, yourSlot, totalRounds };
  save();
  renderAll();
  toast("Draft tracker settings saved.");
});

/* ================= LIVE SCORING ================= */
// Pulls real weekly stat lines from Sleeper's free, public NFL stats API
// (no account/key required) and converts them into fantasy points using the
// user's scoring settings. This is best-effort: it's an unofficial API, so
// network failures or shape changes are caught and surfaced as a status
// message rather than breaking the app. Offense only (QB/RB/WR/TE) — K and
// DST scoring rules vary too much to approximate honestly here.
const SLEEPER_PLAYERS_CACHE_KEY = "ffhq_sleeper_players_cache_v1";
const SLEEPER_PLAYERS_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h — Sleeper asks not to hit this often
const LIVE_SCORING_POSITIONS = ["QB", "RB", "WR", "TE"];

// In-memory only — not persisted, since it's ephemeral and can be a few
// hundred KB (all mapped players' stat lines for the current week).
let LIVE = { byKey: {}, updatedAt: null, week: null, loading: false, error: null };

function livePlayerKey(name, pos) {
  return slugify(name) + "|" + pos;
}

async function ensureSleeperPlayerMap() {
  try {
    const cached = JSON.parse(localStorage.getItem(SLEEPER_PLAYERS_CACHE_KEY) || "null");
    if (cached && Date.now() - cached.fetchedAt < SLEEPER_PLAYERS_CACHE_TTL_MS) {
      return cached.players;
    }
  } catch (e) { /* fall through to refetch */ }

  const res = await fetch("https://api.sleeper.app/v1/players/nfl");
  if (!res.ok) throw new Error("Sleeper players list request failed (" + res.status + ")");
  const raw = await res.json();
  // Slim it down to just what we need before caching — the raw payload is ~5MB.
  const players = Object.values(raw)
    .filter((p) => p && p.full_name && LIVE_SCORING_POSITIONS.includes(p.position))
    .map((p) => ({ id: p.player_id, name: p.full_name, pos: p.position }));
  try {
    localStorage.setItem(SLEEPER_PLAYERS_CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), players }));
  } catch (e) { /* localStorage full — fine, just won't cache */ }
  return players;
}

function computeFantasyPoints(stats, scoring) {
  if (!stats) return null;
  let pts = 0;
  pts += (stats.pass_yd || 0) / scoring.passYdPerPt;
  pts += (stats.pass_td || 0) * scoring.passTD;
  pts += (stats.pass_int || 0) * scoring.passInt;
  pts += (stats.rush_yd || 0) / scoring.rushYdPerPt;
  pts += (stats.rush_td || 0) * scoring.rushTD;
  pts += (stats.rec_yd || 0) / scoring.recYdPerPt;
  pts += (stats.rec_td || 0) * scoring.recTD;
  pts += (stats.rec || 0) * scoring.reception;
  pts += (stats.fum_lost || 0) * scoring.fumLost;
  return Math.round(pts * 100) / 100;
}

async function refreshLiveScoring() {
  if (!STATE.liveScoring.enabled) return;
  const statusEl = document.getElementById("liveScoringStatus");
  LIVE.loading = true;
  LIVE.error = null;
  if (statusEl) statusEl.textContent = "Fetching live stats…";

  try {
    const stateRes = await fetch("https://api.sleeper.app/v1/state/nfl");
    if (!stateRes.ok) throw new Error("Sleeper state request failed (" + stateRes.status + ")");
    const nflState = await stateRes.json();
    const season = nflState.season;
    const week = STATE.currentWeek;

    const sleeperPlayers = await ensureSleeperPlayerMap();
    const byId = {};
    sleeperPlayers.forEach((p) => { byId[p.id] = p; });

    const statsRes = await fetch(`https://api.sleeper.app/stats/nfl/regular/${season}/${week}`);
    if (!statsRes.ok) throw new Error("Sleeper stats request failed (" + statsRes.status + ")");
    const statsById = await statsRes.json();

    const byKey = {};
    Object.keys(statsById).forEach((sleeperId) => {
      const meta = byId[sleeperId];
      if (!meta) return;
      const pts = computeFantasyPoints(statsById[sleeperId], STATE.liveScoring.scoring);
      if (pts === null) return;
      byKey[livePlayerKey(meta.name, meta.pos)] = pts;
    });

    LIVE = { byKey, updatedAt: Date.now(), week, loading: false, error: null };
    const beforeWeek = nflState.week && week < nflState.week;
    const notStarted = nflState.week && week > nflState.week;
    if (statusEl) {
      statusEl.textContent = notStarted
        ? `Week ${week} hasn't started yet — no live stats to show.`
        : `Live stats last updated ${new Date(LIVE.updatedAt).toLocaleTimeString()}${beforeWeek ? " (final)" : ""}.`;
    }
  } catch (e) {
    LIVE.loading = false;
    LIVE.error = e.message || String(e);
    console.error("Live scoring fetch failed:", e);
    if (statusEl) statusEl.textContent = `Couldn't load live stats (${LIVE.error}). This uses an unofficial free API, so it can be flaky — try again in a bit.`;
  }
  renderLineupTab();
}

function livePointsFor(p) {
  if (!STATE.liveScoring.enabled) return null;
  if (LIVE.week !== STATE.currentWeek) return null;
  const val = LIVE.byKey[livePlayerKey(p.name, p.pos)];
  return val === undefined ? null : val;
}

function livePointsCellHtml(p) {
  if (!STATE.liveScoring.enabled) return "";
  const pts = livePointsFor(p);
  if (pts === null) return `<span class="live-pts-empty">—</span>`;
  return `<span class="live-pts">${pts}</span>`;
}

let liveScoringTimer = null;
function applyLiveScoringUiState() {
  document.getElementById("liveScoringEnabled").checked = STATE.liveScoring.enabled;
  const s = STATE.liveScoring.scoring;
  document.getElementById("scorePassYdPerPt").value = s.passYdPerPt;
  document.getElementById("scorePassTD").value = s.passTD;
  document.getElementById("scorePassInt").value = s.passInt;
  document.getElementById("scoreYdPerPt").value = s.rushYdPerPt;
  document.getElementById("scoreTD").value = s.rushTD;
  document.getElementById("scoreReception").value = s.reception;
  document.getElementById("scoreFumLost").value = s.fumLost;

  const statusEl = document.getElementById("liveScoringStatus");
  if (!STATE.liveScoring.enabled) {
    statusEl.textContent = "Live scoring is off.";
    if (liveScoringTimer) { clearInterval(liveScoringTimer); liveScoringTimer = null; }
  } else if (!liveScoringTimer) {
    liveScoringTimer = setInterval(refreshLiveScoring, 60000);
  }
}

document.getElementById("liveScoringEnabled").addEventListener("change", (e) => {
  STATE.liveScoring.enabled = e.target.checked;
  save();
  applyLiveScoringUiState();
  if (STATE.liveScoring.enabled) refreshLiveScoring();
  else renderLineupTab();
});

document.getElementById("saveLiveScoringBtn").addEventListener("click", () => {
  const num = (id) => parseFloat(document.getElementById(id).value);
  const passYdPerPt = num("scorePassYdPerPt"), rushYdPerPt = num("scoreYdPerPt");
  if (!passYdPerPt || !rushYdPerPt) { toast("Yards-per-point fields can't be zero."); return; }
  STATE.liveScoring.scoring = {
    passYdPerPt, passTD: num("scorePassTD"), passInt: num("scorePassInt"),
    rushYdPerPt, rushTD: num("scoreTD"),
    recYdPerPt: rushYdPerPt, recTD: num("scoreTD"), reception: num("scoreReception"),
    fumLost: num("scoreFumLost"),
  };
  save();
  toast("Scoring settings saved.");
  if (STATE.liveScoring.enabled) refreshLiveScoring();
});

document.getElementById("refreshLiveScoringBtn").addEventListener("click", () => {
  if (!STATE.liveScoring.enabled) { toast("Enable live scoring first."); return; }
  refreshLiveScoring();
});

/* ================= RENDER ALL ================= */
function renderAll() {
  renderBestAvailable();
  renderNeeds();
  renderDraftTracker();
  renderDraftSummary();
  renderPickHistory();
  renderDraftTable();
  renderTeamTab();
  renderSeasonOverview();
  renderLineupTab();
  renderTradeTab();
  renderCompareTab();
  document.getElementById("slotsInput").value = STATE.slots.join(",");
  document.getElementById("draftNumTeams").value = STATE.draftSettings.numTeams;
  document.getElementById("draftYourSlot").value = STATE.draftSettings.yourSlot;
  document.getElementById("draftTotalRounds").value = STATE.draftSettings.totalRounds;
  applyLiveScoringUiState();
  const freshText = "Data: " + formatDataDate(STATE.dataUpdatedAt);
  document.getElementById("dataFreshness").textContent = freshText;
  document.getElementById("dataFreshnessDetail").textContent = formatDataDate(STATE.dataUpdatedAt);
}

/* ================= THEME TOGGLE ================= */
const THEME_STORAGE_KEY = "ffhq_theme";

function effectiveTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function renderThemeToggle() {
  const theme = effectiveTheme();
  document.getElementById("themeToggle").textContent = theme === "light" ? "🌙" : "☀️";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  const next = effectiveTheme() === "light" ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  document.documentElement.setAttribute("data-theme", next);
  renderThemeToggle();
});

renderThemeToggle();

initWeekSelect();
renderAll();
if (STATE.liveScoring.enabled) refreshLiveScoring();
