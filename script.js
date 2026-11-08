let state = loadState();

// ---------- Rendering ----------

function renderScoreboard() {
  const el = document.getElementById("scoreboard");
  el.innerHTML = "";
  state.teams.forEach((team, idx) => {
    const card = document.createElement("div");
    card.className = "team-card" + (idx === state.currentTeam ? " active-turn" : "");
    card.innerHTML = `
      <div class="team-name">${team.name}</div>
      <div class="team-score">${team.score}</div>
    `;
    el.appendChild(card);
  });
  document.getElementById("currentTeamName").textContent = state.teams[state.currentTeam].name;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  board.style.gridTemplateColumns = `160px repeat(${CATEGORIES.length}, 1fr)`;

  // top-left blank corner
  const corner = document.createElement("div");
  board.appendChild(corner);

  // category headers across the top
  CATEGORIES.forEach(cat => {
    const h = document.createElement("div");
    h.className = "cat-header";
    h.textContent = cat;
    board.appendChild(h);
  });

  DIFFICULTIES.forEach(diff => {
    const label = document.createElement("div");
    label.className = "diff-label";
    label.textContent = `Lvl ${diff} (${diff * 100} pts)`;
    board.appendChild(label);

    CATEGORIES.forEach(cat => {
      const key = cellKey(cat, diff);
      const cell = document.createElement("div");
      const used = !!state.used[key];
      cell.className = "cell" + (used ? " used" : "");
      cell.textContent = used ? "✓" : `${diff * 100}`;
      if (!used) {
        cell.addEventListener("click", () => goToQuestion(cat, diff));
      }
      board.appendChild(cell);
    });
  });
}

function render() {
  renderScoreboard();
  renderBoard();
  checkBoardCompletion();
  saveState(state);
}

function checkBoardCompletion() {
  const totalCells = CATEGORIES.length * DIFFICULTIES.length;
  const usedCount = Object.keys(state.used).length;
  if (usedCount >= totalCells && !state.boardCompletionShown) {
    state.boardCompletionShown = true;
    showCompletionOverlay();
  }
}

function showCompletionOverlay() {
  const topScore = Math.max(...state.teams.map(t => t.score));
  const winners = state.teams.filter(t => t.score === topScore);
  const winnerText = winners.length > 1
    ? `It's a tie between ${winners.map(t => t.name).join(" & ")} with ${topScore} points!`
    : `${winners[0].name} wins with ${topScore} points!`;

  document.getElementById("completionMessage").textContent = winnerText;
  document.getElementById("completionOverlay").classList.add("open");
}

document.getElementById("dismissCompletionBtn").addEventListener("click", () => {
  document.getElementById("completionOverlay").classList.remove("open");
});

function goToQuestion(cat, diff) {
  const params = new URLSearchParams({ cat, diff });
  window.location.href = `question.html?${params.toString()}`;
}

// ---------- Controls ----------

document.getElementById("nextTurnBtn").addEventListener("click", () => {
  state.currentTeam = (state.currentTeam + 1) % state.teams.length;
  render();
});

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Reset the entire game? Scores and used cells will be cleared.")) {
    state = defaultState();
    render();
  }
});

// Allow renaming teams by double-clicking their score card
document.getElementById("scoreboard").addEventListener("dblclick", (e) => {
  const card = e.target.closest(".team-card");
  if (!card) return;
  const idx = Array.from(card.parentNode.children).indexOf(card);
  const newName = prompt("Enter new team name:", state.teams[idx].name);
  if (newName && newName.trim()) {
    state.teams[idx].name = newName.trim();
    render();
  }
});

render();
