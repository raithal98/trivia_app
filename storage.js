// Shared game state persisted in localStorage, used by both index and question pages.
const CATEGORIES = Object.keys(QUESTION_BANK);
const DIFFICULTIES = [1, 2, 3, 4, 5];
const TEAM_COUNT = 4;
const STORAGE_KEY = "trivia-showdown-state";

function defaultState() {
  return {
    teams: Array.from({ length: TEAM_COUNT }, (_, i) => ({
      name: `Team ${i + 1}`,
      score: 0
    })),
    currentTeam: 0,
    used: {}, // key: `${category}-${difficulty}` -> true
    rapidFire: { teamIndex: 0, questionIndex: 0, done: false, awaitingStart: true, introShown: false },
    boardCompletionShown: false
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!parsed.rapidFire || typeof parsed.rapidFire.teamIndex !== "number") {
        parsed.rapidFire = { teamIndex: 0, questionIndex: 0, done: false, awaitingStart: true, introShown: false };
      }
      if (typeof parsed.rapidFire.introShown !== "boolean") parsed.rapidFire.introShown = false;
      if (typeof parsed.boardCompletionShown !== "boolean") parsed.boardCompletionShown = false;
      return parsed;
    }
  } catch (e) { /* ignore corrupt state */ }
  return defaultState();
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cellKey(cat, diff) {
  return `${cat}-${diff}`;
}
