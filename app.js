/* ==========================================================================
   TERMINAL//WORD — Core Game Engine, Persistence, Hard Mode & Accessibility
   ========================================================================== */

(() => {
  'use strict';

  // Single-source configuration constants (easy to customize)
  const CONFIG = {
    PROJECT_NAME: 'TERMINAL//WORD',
    START_DATE: '2026-11-24', // YYYY-MM-DD (local midnight Day #1)
    WORD_LENGTH: 5,
    MAX_GUESSES: 6,
    FLIP_STAGGER_MS: 300,
    STORAGE_KEYS: {
      DAILY: 'terminal_word_daily_v1',
      STATS: 'terminal_word_stats_v1',
      SETTINGS: 'terminal_word_settings_v1'
    }
  };

  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  const WIN_MESSAGES = [
    'ROOT ACCESS GRANTED',
    'FLAWLESS DECRYPTION',
    'SIGNAL LOCKED',
    'PAYLOAD VERIFIED',
    'TRACE COMPLETE',
    'BARELY IN TIME'
  ];

  const STATE_RANK = { absent: 1, present: 2, correct: 3 };

  const { ANSWERS, VALID_GUESSES } = window.WORD_DATA;

  // Application runtime state
  let mode = 'daily'; // 'daily' | 'practice'
  let isRevealing = false;
  let activeModal = null;
  let lastFocusedEl = null;
  let audioCtx = null;

  let settings = loadSettings();
  let stats = loadStats();
  let dailyState = loadOrInitDailyState();
  let practiceState = null;

  // Cached DOM references
  const els = {
    title: document.getElementById('app-title'),
    board: document.getElementById('board'),
    keyboard: document.getElementById('keyboard'),
    toastContainer: document.getElementById('toast-container'),
    modeBadge: document.getElementById('mode-badge'),
    puzzleMeta: document.getElementById('puzzle-meta'),
    hardBadge: document.getElementById('hard-badge'),
    offlineBadge: document.getElementById('offline-badge'),
    postgameBar: document.getElementById('postgame-bar'),
    btnHelp: document.getElementById('btn-help'),
    btnStats: document.getElementById('btn-stats'),
    btnSettings: document.getElementById('btn-settings'),
    btnExitPractice: document.getElementById('btn-exit-practice'),
    btnQuickStats: document.getElementById('btn-quick-stats'),
    btnUnlimited: document.getElementById('btn-unlimited'),
    btnStatsUnlimited: document.getElementById('btn-stats-unlimited'),
    statsUnlimitedCard: document.getElementById('stats-unlimited-card'),
    btnShare: document.getElementById('btn-share'),
    countdown: document.getElementById('countdown-timer'),
    distChart: document.getElementById('dist-chart'),
    statPlayed: document.getElementById('stat-played'),
    statWinPct: document.getElementById('stat-winpct'),
    statStreak: document.getElementById('stat-streak'),
    statMaxStreak: document.getElementById('stat-maxstreak'),
    modalHelp: document.getElementById('modal-help'),
    modalStats: document.getElementById('modal-stats'),
    modalSettings: document.getElementById('modal-settings'),
    toggleHard: document.getElementById('toggle-hard'),
    toggleSound: document.getElementById('toggle-sound'),
    toggleHaptics: document.getElementById('toggle-haptics'),
    toggleContrast: document.getElementById('toggle-contrast'),
    toggleScanlines: document.getElementById('toggle-scanlines'),
    toggleMatrix: document.getElementById('toggle-matrix'),
    btnResetPrompt: document.getElementById('btn-reset-prompt'),
    resetConfirmBox: document.getElementById('reset-confirm-box'),
    btnResetCancel: document.getElementById('btn-reset-cancel'),
    btnResetConfirm: document.getElementById('btn-reset-confirm')
  };

  /* ========================================================================
     1. Date & Daily Puzzle Indexing (Local Midnight, DST-Safe)
     ======================================================================== */

  function getDayIndex(now = new Date()) {
    const [sy, sm, sd] = CONFIG.START_DATE.split('-').map(Number);
    // Use UTC midnight of both calendar dates so 23h/25h DST days never drift
    const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const startUtc = Date.UTC(sy, sm - 1, sd);
    return Math.floor((todayUtc - startUtc) / 86400000);
  }

  function getDailyAnswer(dayIndex) {
    const len = ANSWERS.length;
    const safeIdx = ((dayIndex % len) + len) % len;
    return ANSWERS[safeIdx];
  }

  function msUntilLocalMidnight(now = new Date()) {
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    return Math.max(0, nextMidnight.getTime() - now.getTime());
  }

  function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  /* ========================================================================
     2. Storage Helpers
     ======================================================================== */

  function safeRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota/private-mode storage errors
    }
  }

  function loadSettings() {
    return Object.assign(
      {
        hardMode: false,
        sound: true,
        haptics: true,
        highContrast: false,
        scanlines: true,
        matrixTheme: false
      },
      safeRead(CONFIG.STORAGE_KEYS.SETTINGS, {})
    );
  }

  function saveSettings() {
    safeWrite(CONFIG.STORAGE_KEYS.SETTINGS, settings);
  }

  function defaultStats() {
    return {
      played: 0,
      won: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: [0, 0, 0, 0, 0, 0],
      lastCompletedDay: null,
      lastWinGuesses: null
    };
  }

  function loadStats() {
    return Object.assign(defaultStats(), safeRead(CONFIG.STORAGE_KEYS.STATS, {}));
  }

  function saveStats() {
    safeWrite(CONFIG.STORAGE_KEYS.STATS, stats);
  }

  function createFreshGameState(dayIndex, answer) {
    return {
      dayIndex,
      answer,
      guesses: [],       // Array of submitted 5-letter strings
      evaluations: [],   // Array of 5-item arrays ('correct' | 'present' | 'absent')
      currentGuess: '',
      status: 'playing', // 'playing' | 'won' | 'lost'
      hardModeUsed: settings.hardMode
    };
  }

  function loadOrInitDailyState() {
    const today = getDayIndex();
    const saved = safeRead(CONFIG.STORAGE_KEYS.DAILY, null);
    if (saved && saved.dayIndex === today && Array.isArray(saved.guesses)) {
      saved.answer = getDailyAnswer(today);
      return saved;
    }
    const fresh = createFreshGameState(today, getDailyAnswer(today));
    safeWrite(CONFIG.STORAGE_KEYS.DAILY, fresh);
    return fresh;
  }

  function saveDailyState() {
    safeWrite(CONFIG.STORAGE_KEYS.DAILY, dailyState);
  }

  function currentGame() {
    return mode === 'daily' ? dailyState : practiceState;
  }

  /* ========================================================================
     3. Core Wordle Evaluation (Two-Pass Duplicate-Letter Algorithm) & Hard Mode
     ======================================================================== */

  function evaluateGuess(guess, answer) {
    const result = Array(CONFIG.WORD_LENGTH).fill('absent');
    const remaining = Object.create(null);

    // Pass 1: Lock exact matches (green) and tally unmatched answer letters
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
      if (guess[i] === answer[i]) {
        result[i] = 'correct';
      } else {
        const ch = answer[i];
        remaining[ch] = (remaining[ch] || 0) + 1;
      }
    }

    // Pass 2: Mark misplaced letters (blue) bounded by remaining counts
    for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
      if (result[i] === 'correct') continue;
      const ch = guess[i];
      if (remaining[ch] > 0) {
        result[i] = 'present';
        remaining[ch]--;
      }
    }

    return result;
  }

  function ordinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function validateHardMode(guess, game) {
    for (let r = 0; r < game.guesses.length; r++) {
      const prevGuess = game.guesses[r];
      const prevEval = game.evaluations[r];
      const requiredCounts = Object.create(null);

      // 1. Exact green slots must be preserved
      for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
        if (prevEval[i] === 'correct') {
          if (guess[i] !== prevGuess[i]) {
            return `${ordinal(i + 1)} letter must be ${prevGuess[i]}`;
          }
          requiredCounts[prevGuess[i]] = (requiredCounts[prevGuess[i]] || 0) + 1;
        } else if (prevEval[i] === 'present') {
          requiredCounts[prevGuess[i]] = (requiredCounts[prevGuess[i]] || 0) + 1;
        }
      }

      // 2. All revealed letters (including duplicate counts) must appear in new guess
      const guessCounts = Object.create(null);
      for (const ch of guess) {
        guessCounts[ch] = (guessCounts[ch] || 0) + 1;
      }
      for (const [ch, minCount] of Object.entries(requiredCounts)) {
        if ((guessCounts[ch] || 0) < minCount) {
          return minCount > 1
            ? `Guess must contain at least ${minCount} "${ch}"s`
            : `Guess must contain ${ch}`;
        }
      }
    }
    return null;
  }

  /* ========================================================================
     4. Synthesized Sound & Haptics (Zero External Audio Files)
     ======================================================================== */

  function playTone(freq, duration = 0.045, type = 'square', volume = 0.035) {
    if (!settings.sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) audioCtx = new AudioCtx();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Ignore audio failures
    }
  }

  function vibrate(pattern) {
    if (settings.haptics && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  /* ========================================================================
     5. Rendering: Board, Keyboard, Status Strip, Stats
     ======================================================================== */

  function buildBoardDOM() {
    els.board.innerHTML = '';
    for (let r = 0; r < CONFIG.MAX_GUESSES; r++) {
      const rowEl = document.createElement('div');
      rowEl.className = 'board-row';
      rowEl.setAttribute('role', 'row');
      rowEl.dataset.row = r;

      for (let c = 0; c < CONFIG.WORD_LENGTH; c++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.setAttribute('role', 'gridcell');
        tile.dataset.row = r;
        tile.dataset.col = c;
        rowEl.appendChild(tile);
      }
      els.board.appendChild(rowEl);
    }
  }

  function buildKeyboardDOM() {
    els.keyboard.innerHTML = '';
    KEYBOARD_ROWS.forEach((keys) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'kb-row';
      keys.forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'key' + (key.length > 1 ? ' key-wide' : '');
        btn.dataset.key = key;
        btn.textContent = key;
        btn.setAttribute('aria-label', key === 'DEL' ? 'Delete letter' : key === 'ENTER' ? 'Submit guess' : key);
        btn.addEventListener('click', () => handleInput(key));
        rowEl.appendChild(btn);
      });
      els.keyboard.appendChild(rowEl);
    });
  }

  function tileAriaLabel(r, c, letter, state) {
    const pos = `row ${r + 1}, letter ${c + 1}`;
    if (!letter) return `${pos}, empty`;
    if (!state) return `${pos}, ${letter}`;
    return `${pos}, ${letter}, ${state}`;
  }

  function renderBoard() {
    const game = currentGame();
    const activeRow = game.guesses.length;

    for (let r = 0; r < CONFIG.MAX_GUESSES; r++) {
      const rowEl = els.board.children[r];
      const submitted = r < game.guesses.length;
      const isActiveRow = r === activeRow && game.status === 'playing';
      const word = submitted ? game.guesses[r] : isActiveRow ? game.currentGuess : '';

      for (let c = 0; c < CONFIG.WORD_LENGTH; c++) {
        const tile = rowEl.children[c];
        const letter = word[c] || '';
        const evalState = submitted ? game.evaluations[r][c] : null;

        tile.className = 'tile';
        tile.textContent = letter;

        if (evalState) {
          tile.classList.add(`tile-${evalState}`);
        } else if (letter) {
          tile.classList.add('tile-filled');
        } else if (isActiveRow && c === word.length && !isRevealing) {
          tile.classList.add('tile-active-cursor');
        }

        tile.setAttribute('aria-label', tileAriaLabel(r, c, letter, evalState));
      }
    }
  }

  function renderKeyboard() {
    const game = currentGame();
    const bestState = Object.create(null);

    game.guesses.forEach((guess, r) => {
      const evalRow = game.evaluations[r];
      for (let i = 0; i < CONFIG.WORD_LENGTH; i++) {
        const ch = guess[i];
        const st = evalRow[i];
        if (!bestState[ch] || STATE_RANK[st] > STATE_RANK[bestState[ch]]) {
          bestState[ch] = st;
        }
      }
    });

    els.keyboard.querySelectorAll('.key').forEach((btn) => {
      const k = btn.dataset.key;
      btn.classList.remove('key-correct', 'key-present', 'key-absent');
      if (bestState[k]) {
        btn.classList.add(`key-${bestState[k]}`);
      }
    });
  }

  function renderChrome() {
    const game = currentGame();
    if (mode === 'daily') {
      els.modeBadge.textContent = 'DAILY';
      els.modeBadge.className = 'badge';
      els.puzzleMeta.textContent = `#${game.dayIndex + 1}`;
      els.btnExitPractice.classList.add('hidden');
    } else {
      els.modeBadge.textContent = 'UNLIMITED';
      els.modeBadge.className = 'badge badge-blue';
      els.puzzleMeta.textContent = 'PRACTICE';
      els.btnExitPractice.classList.remove('hidden');
    }

    els.hardBadge.classList.toggle('hidden', !settings.hardMode);
    els.offlineBadge.textContent = navigator.onLine ? 'OFFLINE READY' : 'OFFLINE MODE';

    const dailyDone = dailyState.status !== 'playing';
    const showPostBar = mode === 'daily' ? dailyDone : game.status !== 'playing';
    els.postgameBar.classList.toggle('hidden', !showPostBar);
    els.btnUnlimited.innerHTML =
      mode === 'practice'
        ? 'NEXT WORD <span class="badge badge-inline">NEW</span>'
        : 'UNLIMITED PLAY <span class="badge badge-inline">NEW</span>';
    els.btnQuickStats.textContent = mode === 'practice' ? 'BACK TO DAILY' : 'STATS & SHARE';
  }

  function renderStatsModal() {
    const winPct = stats.played ? Math.round((stats.won / stats.played) * 100) : 0;
    els.statPlayed.textContent = stats.played;
    els.statWinPct.textContent = winPct;
    els.statStreak.textContent = stats.currentStreak;
    els.statMaxStreak.textContent = stats.maxStreak;

    const maxVal = Math.max(1, ...stats.distribution);
    els.distChart.innerHTML = '';
    stats.distribution.forEach((count, idx) => {
      const row = document.createElement('div');
      row.className = 'dist-row';

      const num = document.createElement('span');
      num.textContent = idx + 1;

      const track = document.createElement('div');
      track.className = 'dist-track';

      const bar = document.createElement('div');
      const isCurrentWin =
        dailyState.status === 'won' &&
        stats.lastCompletedDay === dailyState.dayIndex &&
        stats.lastWinGuesses === idx + 1;
      bar.className = 'dist-bar' + (isCurrentWin ? ' dist-current' : '');
      bar.style.width = `${Math.max(10, Math.round((count / maxVal) * 100))}%`;
      bar.textContent = count;

      track.appendChild(bar);
      row.append(num, track);
      els.distChart.appendChild(row);
    });

    const dailyDone = dailyState.status !== 'playing';
    els.statsUnlimitedCard.classList.toggle('hidden', !dailyDone);
    els.btnShare.disabled = !dailyDone;
    els.btnShare.style.opacity = dailyDone ? '1' : '0.45';
  }

  function applySettingsToDOM() {
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('scanlines-on', settings.scanlines);
    document.body.classList.toggle('theme-matrix', settings.matrixTheme);

    els.toggleHard.checked = settings.hardMode;
    els.toggleSound.checked = settings.sound;
    els.toggleHaptics.checked = settings.haptics;
    els.toggleContrast.checked = settings.highContrast;
    els.toggleScanlines.checked = settings.scanlines;
    els.toggleMatrix.checked = settings.matrixTheme;
    renderChrome();
  }

  /* ========================================================================
     6. Toast Helper
     ======================================================================== */

  function showToast(message, duration = 2200) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    els.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, duration);
  }

  /* ========================================================================
     7. Input Handling & Submission Flow
     ======================================================================== */

  function handleInput(rawKey) {
    if (activeModal || isRevealing) return;
    const game = currentGame();
    if (game.status !== 'playing') return;

    const key = rawKey.toUpperCase();

    if (key === 'DEL' || key === 'BACKSPACE') {
      if (game.currentGuess.length > 0) {
        game.currentGuess = game.currentGuess.slice(0, -1);
        playTone(220, 0.03, 'triangle', 0.03);
        if (mode === 'daily') saveDailyState();
        renderBoard();
      }
      return;
    }

    if (key === 'ENTER') {
      submitGuess();
      return;
    }

    if (/^[A-Z]$/.test(key) && game.currentGuess.length < CONFIG.WORD_LENGTH) {
      const col = game.currentGuess.length;
      const row = game.guesses.length;
      game.currentGuess += key;
      playTone(420, 0.03, 'square', 0.025);
      vibrate(8);
      if (mode === 'daily') saveDailyState();
      renderBoard();

      const tile = els.board.children[row].children[col];
      tile.classList.add('tile-pop');
    }
  }

  function shakeRow(rowIndex) {
    const rowEl = els.board.children[rowIndex];
    rowEl.classList.remove('row-shake');
    void rowEl.offsetWidth; // Force reflow
    rowEl.classList.add('row-shake');
    playTone(135, 0.14, 'sawtooth', 0.04);
    vibrate([30, 40, 30]);
  }

  function submitGuess() {
    const game = currentGame();
    const rowIndex = game.guesses.length;
    const guess = game.currentGuess;

    if (guess.length < CONFIG.WORD_LENGTH) {
      shakeRow(rowIndex);
      showToast('Not enough letters');
      return;
    }

    if (!VALID_GUESSES.has(guess)) {
      shakeRow(rowIndex);
      showToast('Not in word list');
      return;
    }

    if (settings.hardMode && game.guesses.length > 0) {
      const err = validateHardMode(guess, game);
      if (err) {
        shakeRow(rowIndex);
        showToast(err);
        return;
      }
    }

    const evaluation = evaluateGuess(guess, game.answer);
    game.guesses.push(guess);
    game.evaluations.push(evaluation);
    game.currentGuess = '';
    if (settings.hardMode) game.hardModeUsed = true;

    const won = evaluation.every((s) => s === 'correct');
    const lost = !won && game.guesses.length >= CONFIG.MAX_GUESSES;
    if (won) game.status = 'won';
    if (lost) game.status = 'lost';

    if (mode === 'daily') saveDailyState();

    revealRowAnimated(rowIndex, guess, evaluation, () => {
      renderKeyboard();
      renderChrome();

      if (won) {
        bounceRow(rowIndex);
        playTone(660, 0.12, 'triangle', 0.05);
        setTimeout(() => playTone(880, 0.18, 'triangle', 0.05), 130);
        vibrate([20, 40, 50]);
        showToast(WIN_MESSAGES[rowIndex] || 'DECRYPTED', 2600);
        if (mode === 'daily') recordDailyOutcome(true, game.guesses.length);
        setTimeout(() => {
          if (mode === 'daily') openModal(els.modalStats);
        }, 1200);
      } else if (lost) {
        playTone(160, 0.25, 'sawtooth', 0.045);
        showToast(`SIGNAL LOST: ${game.answer}`, 3600);
        if (mode === 'daily') recordDailyOutcome(false, null);
        setTimeout(() => {
          if (mode === 'daily') openModal(els.modalStats);
        }, 1400);
      }
    });
  }

  function revealRowAnimated(rowIndex, guess, evaluation, onDone) {
    isRevealing = true;
    const rowEl = els.board.children[rowIndex];
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = reduced ? 0 : CONFIG.FLIP_STAGGER_MS;

    // Clear active cursor immediately
    rowEl.querySelectorAll('.tile-active-cursor').forEach((t) => t.classList.remove('tile-active-cursor'));

    for (let c = 0; c < CONFIG.WORD_LENGTH; c++) {
      const tile = rowEl.children[c];
      setTimeout(() => {
        if (!reduced) tile.classList.add('tile-flip');
        setTimeout(() => {
          tile.classList.remove('tile-filled');
          tile.classList.add(`tile-${evaluation[c]}`);
          tile.setAttribute('aria-label', tileAriaLabel(rowIndex, c, guess[c], evaluation[c]));
          const toneMap = { correct: 580, present: 440, absent: 240 };
          playTone(toneMap[evaluation[c]], 0.05, 'sine', 0.035);
        }, reduced ? 0 : 240);
      }, c * step);
    }

    setTimeout(() => {
      isRevealing = false;
      renderBoard();
      onDone();
    }, (CONFIG.WORD_LENGTH - 1) * step + (reduced ? 20 : 520));
  }

  function bounceRow(rowIndex) {
    const rowEl = els.board.children[rowIndex];
    for (let c = 0; c < CONFIG.WORD_LENGTH; c++) {
      const tile = rowEl.children[c];
      setTimeout(() => tile.classList.add('tile-bounce'), c * 90);
    }
  }

  function recordDailyOutcome(won, guessCount) {
    const today = dailyState.dayIndex;
    if (stats.lastCompletedDay === today) return; // Prevent double-counting

    stats.played += 1;
    if (won) {
      stats.won += 1;
      stats.currentStreak =
        stats.lastCompletedDay === today - 1 ? stats.currentStreak + 1 : 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      stats.distribution[guessCount - 1] += 1;
      stats.lastWinGuesses = guessCount;
    } else {
      stats.currentStreak = 0;
      stats.lastWinGuesses = null;
    }
    stats.lastCompletedDay = today;
    saveStats();
    renderStatsModal();
  }

  /* ========================================================================
     8. Share Emoji Grid (Web Share API + Clipboard Fallback)
     ======================================================================== */

  function buildShareText() {
    const num = dailyState.dayIndex + 1;
    const score = dailyState.status === 'won' ? `${dailyState.guesses.length}/${CONFIG.MAX_GUESSES}` : `X/${CONFIG.MAX_GUESSES}`;
    const hardFlag = dailyState.hardModeUsed ? '*' : '';
    const greenSq = settings.highContrast ? '🟧' : '🟩';
    const blueSq = '🟦';
    const blackSq = '⬛';

    const grid = dailyState.evaluations
      .map((row) =>
        row.map((st) => (st === 'correct' ? greenSq : st === 'present' ? blueSq : blackSq)).join('')
      )
      .join('\n');

    return `${CONFIG.PROJECT_NAME} #${num} ${score}${hardFlag}\n\n${grid}`;
  }

  async function shareResult() {
    if (dailyState.status === 'playing') return;
    const text = buildShareText();

    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({ title: CONFIG.PROJECT_NAME, text });
        showToast('Result shared');
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied grid to clipboard');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied grid to clipboard');
    }
  }

  /* ========================================================================
     9. Practice / Unlimited Mode
     ======================================================================== */

  function startUnlimitedMode() {
    const exclude = new Set([dailyState.answer, practiceState ? practiceState.answer : '']);
    const pool = ANSWERS.filter((w) => !exclude.has(w));
    const randomWord = pool[Math.floor(Math.random() * pool.length)];

    mode = 'practice';
    practiceState = createFreshGameState(-1, randomWord);
    closeModal();
    renderBoard();
    renderKeyboard();
    renderChrome();
    showToast('Unlimited mode active');
  }

  function exitUnlimitedMode() {
    mode = 'daily';
    renderBoard();
    renderKeyboard();
    renderChrome();
    showToast('Returned to Daily puzzle');
  }

  /* ========================================================================
     10. Accessible Modals with Focus Trapping
     ======================================================================== */

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !el.closest('.hidden'));
  }

  function openModal(modalEl) {
    if (modalEl === els.modalStats) renderStatsModal();
    if (modalEl === els.modalSettings) els.resetConfirmBox.classList.add('hidden');

    lastFocusedEl = document.activeElement;
    activeModal = modalEl;
    modalEl.classList.remove('hidden');

    const focusables = getFocusable(modalEl);
    if (focusables.length) focusables[0].focus();
  }

  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.add('hidden');
    activeModal = null;
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  function handleModalKeydown(e) {
    if (!activeModal) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = getFocusable(activeModal);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ========================================================================
     11. Midnight Rollover & Live Countdown
     ======================================================================== */

  function startMidnightTicker() {
    function tick() {
      const now = new Date();
      els.countdown.textContent = formatDuration(msUntilLocalMidnight(now));

      const currentDay = getDayIndex(now);
      if (currentDay !== dailyState.dayIndex) {
        dailyState = createFreshGameState(currentDay, getDailyAnswer(currentDay));
        saveDailyState();
        if (mode === 'daily') {
          renderBoard();
          renderKeyboard();
          renderChrome();
          showToast(`New daily signal #${currentDay + 1} unlocked!`);
        }
        renderStatsModal();
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ========================================================================
     12. Event Listeners & Bootstrapping
     ======================================================================== */

  function bindEvents() {
    document.addEventListener('keydown', (e) => {
      if (activeModal) {
        handleModalKeydown(e);
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Backspace' || /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleInput(e.key);
      }
    });

    els.btnHelp.addEventListener('click', () => openModal(els.modalHelp));
    els.btnStats.addEventListener('click', () => openModal(els.modalStats));
    els.btnSettings.addEventListener('click', () => openModal(els.modalSettings));
    els.btnExitPractice.addEventListener('click', exitUnlimitedMode);

    els.btnQuickStats.addEventListener('click', () => {
      if (mode === 'practice') exitUnlimitedMode();
      else openModal(els.modalStats);
    });
    els.btnUnlimited.addEventListener('click', startUnlimitedMode);
    els.btnStatsUnlimited.addEventListener('click', startUnlimitedMode);
    els.btnShare.addEventListener('click', shareResult);

    // Close modals via close button or backdrop click
    [els.modalHelp, els.modalStats, els.modalSettings].forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('[data-close-modal]')) {
          closeModal();
        }
      });
    });

    // Settings toggles
    els.toggleHard.addEventListener('change', (e) => {
      const game = currentGame();
      if (e.target.checked && game.status === 'playing' && game.guesses.length > 0) {
        e.target.checked = false;
        showToast('Hard Mode can only be enabled at the start of a round');
        return;
      }
      settings.hardMode = e.target.checked;
      if (settings.hardMode && game.guesses.length === 0) {
        game.hardModeUsed = true;
      }
      saveSettings();
      applySettingsToDOM();
    });

    els.toggleSound.addEventListener('change', (e) => {
      settings.sound = e.target.checked;
      saveSettings();
      if (settings.sound) playTone(520, 0.05, 'sine', 0.03);
    });

    els.toggleHaptics.addEventListener('change', (e) => {
      settings.haptics = e.target.checked;
      saveSettings();
      vibrate(15);
    });

    els.toggleContrast.addEventListener('change', (e) => {
      settings.highContrast = e.target.checked;
      saveSettings();
      applySettingsToDOM();
    });

    els.toggleScanlines.addEventListener('change', (e) => {
      settings.scanlines = e.target.checked;
      saveSettings();
      applySettingsToDOM();
    });

    els.toggleMatrix.addEventListener('change', (e) => {
      settings.matrixTheme = e.target.checked;
      saveSettings();
      applySettingsToDOM();
    });

    // Reset stats with confirmation
    els.btnResetPrompt.addEventListener('click', () => {
      els.resetConfirmBox.classList.remove('hidden');
    });
    els.btnResetCancel.addEventListener('click', () => {
      els.resetConfirmBox.classList.add('hidden');
    });
    els.btnResetConfirm.addEventListener('click', () => {
      stats = defaultStats();
      saveStats();
      renderStatsModal();
      els.resetConfirmBox.classList.add('hidden');
      showToast('Statistics cleared');
    });

    window.addEventListener('online', renderChrome);
    window.addEventListener('offline', renderChrome);
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./service-worker.js').catch(() => {});
    }
  }

  function init() {
    document.title = `${CONFIG.PROJECT_NAME} — Daily 5-Letter Word Game`;
    els.title.textContent = CONFIG.PROJECT_NAME;

    buildBoardDOM();
    buildKeyboardDOM();
    applySettingsToDOM();
    renderBoard();
    renderKeyboard();
    renderChrome();
    bindEvents();
    startMidnightTicker();
    registerServiceWorker();

    // Show How To Play automatically on first-ever visit
    if (stats.played === 0 && dailyState.guesses.length === 0) {
      setTimeout(() => openModal(els.modalHelp), 450);
    }
  }

  init();
})();
