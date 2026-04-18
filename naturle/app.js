const state = {
  maxGuesses: 6,
  guesses: [],
  over: false,
  options: [],
  optionsSet: new Set(),
  date: null,
};

let PARKS = [];
let NAME_TO_PARK = {};
let MAX_DIST = 0;
let TODAYS_PARK = null;

const shapeEl = document.getElementById('shape');
const inputEl = document.getElementById('guess-input');
const suggestionsEl = document.getElementById('suggestions');
const btnEl = document.getElementById('guess-btn');
const giveUpEl = document.getElementById('give-up-btn');
const replayEl = document.getElementById('replay-btn');
const guessesEl = document.getElementById('guesses');
const statusEl = document.getElementById('status');
const counterEl = document.getElementById('counter');
const journeyEl = document.getElementById('journey');
const journeyLoadingEl = document.getElementById('journey-loading');
const journeyLegsEl = document.getElementById('journey-legs');
const journeyTotalEl = document.getElementById('journey-total');

let activeIndex = -1;
let currentMatches = [];

function storageKey(dateStr) {
  return `naturle:${dateStr}`;
}

function saveState(answer, won) {
  localStorage.setItem(
    storageKey(state.date),
    JSON.stringify({ guesses: state.guesses, over: state.over, answer, won })
  );
}

function loadState(dateStr) {
  const raw = localStorage.getItem(storageKey(dateStr));
  return raw ? JSON.parse(raw) : null;
}

function haversineMi([lon1, lat1], [lon2, lat2]) {
  const R = 3958.7613;
  const lat1r = (lat1 * Math.PI) / 180;
  const lat2r = (lat2 * Math.PI) / 180;
  const dlat = ((lat2 - lat1) * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1r) * Math.cos(lat2r) * Math.sin(dlon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearingDeg([lon1, lat1], [lon2, lat2]) {
  const lat1r = (lat1 * Math.PI) / 180;
  const lat2r = (lat2 * Math.PI) / 180;
  const dlon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dlon) * Math.cos(lat2r);
  const x =
    Math.cos(lat1r) * Math.sin(lat2r) -
    Math.sin(lat1r) * Math.cos(lat2r) * Math.cos(dlon);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

const ARROWS = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
function arrowFor(deg) {
  return ARROWS[Math.floor((deg + 22.5) / 45) % 8];
}

function todayOrdinal() {
  const now = new Date();
  const utcMidnight = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  return Math.floor(utcMidnight / 86400000);
}

function todayDateStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// OSRM with in-flight dedup: a Map<key, Promise> — concurrent callers share work.
const routePromises = new Map();

function routeKey(a, b) {
  return `${a.lonlat[0]},${a.lonlat[1]}|${b.lonlat[0]},${b.lonlat[1]}`;
}

async function fetchOSRM(a, b) {
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${a.lonlat[0]},${a.lonlat[1]};${b.lonlat[0]},${b.lonlat[1]}` +
      `?overview=false`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const body = await res.json();
    if (body.code !== 'Ok' || !body.routes?.length) return null;
    const r = body.routes[0];
    return { duration_s: r.duration, distance_m: r.distance };
  } catch {
    return null;
  }
}

function warmRoute(a, b) {
  const key = routeKey(a, b);
  if (!routePromises.has(key)) {
    routePromises.set(key, fetchOSRM(a, b));
  }
  return routePromises.get(key);
}

async function init() {
  let raw;
  try {
    const res = await fetch('parks.json');
    raw = await res.json();
  } catch {
    shapeEl.textContent = 'Failed to load park data.';
    return;
  }

  const ids = Object.keys(raw.PARKNAME);
  PARKS = ids.map((id) => ({
    id,
    name: raw.PARKNAME[id],
    svg: raw.svg[id],
    lonlat: raw.latlon_centroid[id],
  }));
  NAME_TO_PARK = Object.fromEntries(PARKS.map((p) => [p.name, p]));
  state.options = PARKS.map((p) => p.name).sort();
  state.optionsSet = new Set(state.options);

  for (let i = 0; i < PARKS.length; i++) {
    for (let j = i + 1; j < PARKS.length; j++) {
      const d = haversineMi(PARKS[i].lonlat, PARKS[j].lonlat);
      if (d > MAX_DIST) MAX_DIST = d;
    }
  }

  TODAYS_PARK = PARKS[todayOrdinal() % PARKS.length];
  state.date = todayDateStr();
  shapeEl.innerHTML = TODAYS_PARK.svg;

  const saved = loadState(state.date);
  if (saved) {
    state.guesses = saved.guesses;
    state.over = saved.over;
    for (const g of state.guesses) renderGuess(g);
    if (saved.over) endGame(saved.answer, saved.won);
  }

  updateCounter();
  btnEl.addEventListener('click', submitGuess);
  giveUpEl.addEventListener('click', giveUp);
  replayEl.addEventListener('click', replay);
  inputEl.addEventListener('input', () => renderSuggestions(inputEl.value));
  inputEl.addEventListener('focus', () => renderSuggestions(inputEl.value));
  inputEl.addEventListener('keydown', onInputKeydown);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#combobox')) hideSuggestions();
  });
}

function filterOptions(query) {
  const q = query.trim().toLowerCase();
  const taken = new Set(state.guesses.map((g) => g.name));
  const pool = state.options.filter((n) => !taken.has(n));
  if (!q) return pool;
  const starts = [];
  const contains = [];
  for (const name of pool) {
    const lower = name.toLowerCase();
    if (lower.startsWith(q)) starts.push(name);
    else if (lower.includes(q)) contains.push(name);
  }
  return [...starts, ...contains];
}

function renderSuggestions(query) {
  if (state.over) return hideSuggestions();
  currentMatches = filterOptions(query);
  suggestionsEl.innerHTML = '';
  if (currentMatches.length === 0) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No matches';
    suggestionsEl.appendChild(li);
  } else {
    currentMatches.forEach((name, i) => {
      const li = document.createElement('li');
      li.textContent = name;
      li.setAttribute('role', 'option');
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        selectSuggestion(i);
      });
      suggestionsEl.appendChild(li);
    });
  }
  activeIndex = -1;
  suggestionsEl.hidden = false;
  inputEl.setAttribute('aria-expanded', 'true');
}

function hideSuggestions() {
  suggestionsEl.hidden = true;
  activeIndex = -1;
  inputEl.setAttribute('aria-expanded', 'false');
}

function highlightActive() {
  const items = suggestionsEl.querySelectorAll('li');
  items.forEach((el, i) => el.classList.toggle('active', i === activeIndex));
  const active = items[activeIndex];
  if (active) active.scrollIntoView({ block: 'nearest' });
}

function selectSuggestion(i) {
  if (i < 0 || i >= currentMatches.length) return;
  inputEl.value = currentMatches[i];
  hideSuggestions();
  inputEl.focus();
}

function onInputKeydown(e) {
  const visible = !suggestionsEl.hidden && currentMatches.length > 0;
  if (e.key === 'ArrowDown') {
    if (!visible) renderSuggestions(inputEl.value);
    activeIndex = Math.min(currentMatches.length - 1, activeIndex + 1);
    highlightActive();
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    if (!visible) return;
    activeIndex = Math.max(0, activeIndex - 1);
    highlightActive();
    e.preventDefault();
  } else if (e.key === 'Enter') {
    if (visible && activeIndex >= 0) {
      selectSuggestion(activeIndex);
      e.preventDefault();
    } else {
      submitGuess();
    }
  } else if (e.key === 'Escape') {
    hideSuggestions();
  }
}

function updateCounter() {
  if (state.over) {
    counterEl.textContent = '';
    return;
  }
  const left = state.maxGuesses - state.guesses.length;
  counterEl.textContent = `${left} guess${left === 1 ? '' : 'es'} left`;
}

function evaluateGuess(name) {
  const target = TODAYS_PARK;
  const guessed = NAME_TO_PARK[name];
  if (guessed.name === target.name) {
    return { correct: true, distance_mi: 0, arrow: '🎯', proximity_pct: 100 };
  }
  const d = haversineMi(guessed.lonlat, target.lonlat);
  const b = bearingDeg(guessed.lonlat, target.lonlat);
  return {
    correct: false,
    distance_mi: +d.toFixed(1),
    arrow: arrowFor(b),
    proximity_pct: +(Math.max(0, 1 - d / MAX_DIST) * 100).toFixed(1),
  };
}

function submitGuess() {
  if (state.over) return;
  const name = inputEl.value.trim();

  if (!state.optionsSet.has(name)) {
    flashError('Pick a park from the list.');
    return;
  }
  if (state.guesses.some((g) => g.name === name)) {
    flashError('Already guessed.');
    return;
  }

  const prevGuessName =
    state.guesses.length > 0 ? state.guesses[state.guesses.length - 1].name : null;

  const data = evaluateGuess(name);
  const guessedPark = NAME_TO_PARK[name];

  // Fire-and-forget background warms. Shared promises via warmRoute.
  if (prevGuessName && prevGuessName !== name) {
    warmRoute(NAME_TO_PARK[prevGuessName], guessedPark);
  }
  if (!data.correct) {
    warmRoute(guessedPark, TODAYS_PARK);
  }

  const entry = {
    name,
    distance: data.distance_mi,
    arrow: data.arrow,
    proximity: data.proximity_pct,
    correct: data.correct,
  };
  state.guesses.push(entry);
  renderGuess(entry);
  inputEl.value = '';
  hideSuggestions();
  statusEl.innerHTML = '';

  if (data.correct) {
    state.over = true;
    saveState(name, true);
    endGame(name, true);
  } else if (state.guesses.length >= state.maxGuesses) {
    state.over = true;
    saveState(TODAYS_PARK.name, false);
    endGame(TODAYS_PARK.name, false);
  } else {
    saveState(null, false);
  }
  updateCounter();
}

function renderGuess(g) {
  const li = document.createElement('li');
  li.className = 'guess-row' + (g.correct ? ' correct' : '');

  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = g.name;

  const dist = document.createElement('span');
  dist.className = 'distance';
  dist.textContent = g.correct ? '—' : `${g.distance} mi`;

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.textContent = g.arrow;

  const prox = document.createElement('span');
  prox.className = 'proximity';
  const bar = document.createElement('span');
  bar.style.width = `${g.proximity}%`;
  prox.appendChild(bar);
  prox.title = `${g.proximity}% proximity`;

  li.appendChild(name);
  li.appendChild(dist);
  li.appendChild(arrow);
  li.appendChild(prox);
  guessesEl.appendChild(li);
}

function endGame(answer, won) {
  btnEl.disabled = true;
  inputEl.disabled = true;
  giveUpEl.hidden = true;
  replayEl.hidden = false;
  hideSuggestions();
  statusEl.innerHTML = won
    ? `<span class="win">Solved in ${state.guesses.length}! 🌲</span>`
    : `<span class="lose">${
        state.guesses.length === 0 || state.guesses.length < state.maxGuesses
          ? 'Gave up'
          : 'Out of guesses'
      } — it was <strong>${answer}</strong>.</span>`;
  updateCounter();
  showJourney();
}

function replay() {
  localStorage.removeItem(storageKey(state.date));
  state.guesses = [];
  state.over = false;
  guessesEl.innerHTML = '';
  statusEl.innerHTML = '';
  journeyEl.hidden = true;
  journeyLegsEl.innerHTML = '';
  journeyTotalEl.textContent = '';
  journeyLoadingEl.hidden = true;
  journeyLoadingEl.textContent = 'Plotting route…';
  btnEl.disabled = false;
  inputEl.disabled = false;
  inputEl.value = '';
  giveUpEl.hidden = false;
  replayEl.hidden = true;
  updateCounter();
  inputEl.focus();
}

async function buildJourney() {
  const stops = state.guesses.map((g) => NAME_TO_PARK[g.name]);
  if (!stops.length || stops[stops.length - 1].name !== TODAYS_PARK.name) {
    stops.push(TODAYS_PARK);
  }
  const pairs = [];
  for (let i = 0; i < stops.length - 1; i++) pairs.push([stops[i], stops[i + 1]]);

  const routes = await Promise.all(pairs.map(([a, b]) => warmRoute(a, b)));

  return pairs.map(([a, b], i) => {
    const r = routes[i];
    if (r) {
      return {
        from: a.name,
        to: b.name,
        drive_time_min: Math.round(r.duration_s / 60),
        drive_distance_mi: +(r.distance_m / 1609.344).toFixed(1),
        estimated: false,
      };
    }
    const d = haversineMi(a.lonlat, b.lonlat);
    return {
      from: a.name,
      to: b.name,
      drive_time_min: Math.round(((d * 1.3) / 55) * 60),
      drive_distance_mi: +(d * 1.3).toFixed(1),
      estimated: true,
    };
  });
}

async function showJourney() {
  if (state.guesses.length === 0) return;
  journeyEl.hidden = false;
  journeyLegsEl.innerHTML = '';
  journeyTotalEl.textContent = '';
  journeyLoadingEl.hidden = false;
  try {
    const legs = await buildJourney();
    journeyLoadingEl.hidden = true;
    renderJourney(legs);
  } catch {
    journeyLoadingEl.textContent = 'Could not plot route.';
  }
}

function formatMinutes(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function renderJourney(legs) {
  let totalMin = 0;
  let totalMi = 0;
  let anyEstimated = false;
  for (const leg of legs) {
    totalMin += leg.drive_time_min;
    totalMi += leg.drive_distance_mi;
    if (leg.estimated) anyEstimated = true;
    const li = document.createElement('li');
    li.textContent = `${leg.from} → ${leg.to}: ${formatMinutes(
      leg.drive_time_min
    )} (${leg.drive_distance_mi.toLocaleString()} mi)`;
    if (leg.estimated) {
      const est = document.createElement('span');
      est.className = 'est';
      est.textContent = '(estimated — no road route)';
      li.appendChild(est);
    }
    journeyLegsEl.appendChild(li);
  }
  journeyTotalEl.textContent = `Total: ${formatMinutes(totalMin)} · ${totalMi.toLocaleString(
    undefined,
    { maximumFractionDigits: 1 }
  )} mi${anyEstimated ? ' (includes estimates)' : ''}`;
}

function giveUp() {
  if (state.over) return;
  if (!confirm("Give up and reveal today's park?")) return;
  state.over = true;
  saveState(TODAYS_PARK.name, false);
  endGame(TODAYS_PARK.name, false);
}

let errTimeout;
function flashError(msg) {
  statusEl.innerHTML = `<span class="error">${msg}</span>`;
  clearTimeout(errTimeout);
  errTimeout = setTimeout(() => {
    if (!state.over) statusEl.innerHTML = '';
  }, 2500);
}

init();
