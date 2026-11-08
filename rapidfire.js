let state = loadState();
const card = document.getElementById("rfCard");
const TEAMS_IN_ROUND = Math.min(state.teams.length, RAPID_FIRE_SETS.length);

let timerInterval = null;
let teamTimeLeft = RAPID_FIRE_TEAM_TIME;
let timerForTeamIndex = null; // which team the running timer belongs to

render();

function render() {
  if (state.rapidFire.done) {
    stopTimer();
    renderComplete();
    return;
  }
  if (!state.rapidFire.introShown) {
    stopTimer();
    renderIntroRules();
    return;
  }
  if (state.rapidFire.awaitingStart) {
    stopTimer();
    renderReadyScreen();
    return;
  }
  renderTeamTurn();
}

// ---------- Pre-game rules dialog ----------

function renderIntroRules() {
  card.innerHTML = `
    <div class="modal-header">
      <span class="modal-cat">⚡ Rapid Fire Round</span>
      <span class="modal-points">Rules</span>
    </div>
    <ul class="rules-body" style="padding-left:20px;">
      <li>Each team gets their own set of questions.</li>
      <li>${RAPID_FIRE_TEAM_TIME} seconds total to answer all of them — no reset between questions.</li>
      <li>Host reveals the answer, then marks it ✅ Correct or ❌ Wrong.</li>
      <li><strong>${RAPID_FIRE_POINTS} points</strong> per correct answer, added straight to the main scoreboard.</li>
      <li>No passing, no Googling — answers must be given immediately.</li>
      <li>No negative marking for wrong answers.</li>
    </ul>
    <div class="modal-actions">
      <button class="primary-btn" id="rfIntroStartBtn">Let's Go! 🚀</button>
    </div>
  `;

  document.getElementById("rfIntroStartBtn").addEventListener("click", () => {
    state.rapidFire.introShown = true;
    saveState(state);
    render();
  });
}


// ---------- Break between teams ----------

function renderReadyScreen() {
  const { teamIndex } = state.rapidFire;

  if (teamIndex >= TEAMS_IN_ROUND) {
    state.rapidFire.done = true;
    saveState(state);
    render();
    return;
  }

  const team = state.teams[teamIndex];
  const set = RAPID_FIRE_SETS[teamIndex];

  card.innerHTML = `
    <div class="modal-header">
      <span class="modal-cat">${team.name}</span>
      <span class="modal-points">Get Ready!</span>
    </div>
    <p class="modal-question">It's ${team.name}'s turn! ${set.questions.length} questions, ${RAPID_FIRE_TEAM_TIME} seconds total. Take a breather, then start when ready.</p>
    <div class="modal-actions">
      <button class="primary-btn" id="rfStartTeamBtn">▶ Start ${team.name}'s Turn</button>
    </div>
  `;

  document.getElementById("rfStartTeamBtn").addEventListener("click", () => {
    state.rapidFire.awaitingStart = false;
    saveState(state);
    render();
  });
}

// ---------- Main per-team round ----------

function renderTeamTurn() {
  const { teamIndex, questionIndex } = state.rapidFire;

  if (teamIndex >= TEAMS_IN_ROUND) {
    state.rapidFire.done = true;
    saveState(state);
    render();
    return;
  }

  const set = RAPID_FIRE_SETS[teamIndex];

  if (questionIndex >= set.questions.length) {
    advanceToNextTeam();
    return;
  }

  ensureTimerForTeam(teamIndex);

  const qData = set.questions[questionIndex];
  const team = state.teams[teamIndex];

  card.innerHTML = `
    <div class="modal-header">
      <span class="modal-cat">${team.name}</span>
      <span class="modal-points">${RAPID_FIRE_POINTS} pts</span>
    </div>
    <p class="hint-text">Question ${questionIndex + 1} of ${set.questions.length} — ${team.name}'s turn</p>
    <p class="modal-question" id="rfTimerLine">⏱ ${teamTimeLeft}s remaining for all questions</p>
    <p class="modal-question">${qData.q}</p>
    <div id="rfAnswerArea">
      <div class="modal-actions">
        <button class="primary-btn" id="rfRevealBtn">Reveal Answer</button>
      </div>
    </div>
  `;

  document.getElementById("rfRevealBtn").addEventListener("click", () => {
    const rfAnswerArea = document.getElementById("rfAnswerArea");
    rfAnswerArea.innerHTML = `
      <p class="result-answer">Answer: ${qData.a}</p>
      <div class="modal-actions" style="gap:10px;">
        <button class="primary-btn" id="rfCorrectBtn">✅ Correct</button>
        <button class="ghost-btn" id="rfWrongBtn">❌ Wrong</button>
      </div>
    `;
    document.getElementById("rfCorrectBtn").addEventListener("click", () => answerTeamQuestion(true));
    document.getElementById("rfWrongBtn").addEventListener("click", () => answerTeamQuestion(false));
  });
}

function answerTeamQuestion(correct) {
  const { teamIndex } = state.rapidFire;
  if (correct) {
    state.teams[teamIndex].score += RAPID_FIRE_POINTS;
  }
  state.rapidFire.questionIndex += 1;
  saveState(state);
  render();
}

function advanceToNextTeam() {
  state.rapidFire.teamIndex += 1;
  state.rapidFire.questionIndex = 0;
  state.rapidFire.awaitingStart = true;
  saveState(state);
  render();
}

function ensureTimerForTeam(teamIndex) {
  if (timerForTeamIndex === teamIndex) return;
  timerForTeamIndex = teamIndex;
  teamTimeLeft = RAPID_FIRE_TEAM_TIME;
  startTimer();
}

function startTimer() {
  stopTimer();
  timerInterval = setInterval(() => {
    teamTimeLeft -= 1;
    const line = document.getElementById("rfTimerLine");
    if (line) line.textContent = `⏱ ${Math.max(teamTimeLeft, 0)}s remaining for all questions`;
    if (teamTimeLeft <= 0) {
      stopTimer();
      advanceToNextTeam();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// ---------- Completion ----------

function renderComplete() {
  const ranked = state.teams
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => b.score - a.score);

  const topScore = ranked[0].score;
  const winners = ranked.filter(t => t.score === topScore);
  const winnerText = winners.length > 1
    ? `It's a tie between ${winners.map(t => t.name).join(" & ")}!`
    : `${winners[0].name} wins!`;

  const medals = ["🥇", "🥈", "🥉"];
  const rows = ranked.map((t, i) =>
    `<li>${medals[i] || "🔹"} ${t.name}: <strong>${t.score}</strong> pts</li>`
  ).join("");

  card.innerHTML = `
    <div class="modal-header">
      <span class="modal-cat">Rapid Fire Round</span>
      <span class="modal-points">Complete 🎉</span>
    </div>
    <h2 style="text-align:center;margin:4px 0 16px;background:linear-gradient(90deg, var(--accent), var(--accent2));-webkit-background-clip:text;background-clip:text;color:transparent;font-size:1.8rem;">
      🏆 ${winnerText} 🏆
    </h2>
    <p class="modal-question" style="text-align:center;">Points earned have been added to the main scoreboard. Final rankings:</p>
    <ul class="rules-body" style="padding-left:20px;">${rows}</ul>
    <div class="modal-actions">
      <a href="index.html" class="primary-btn" style="text-decoration:none;display:inline-block;">← Back to Board</a>
    </div>
  `;

  showToast(`🏆 ${winnerText}`, "correct");
  spawnConfetti();
}

