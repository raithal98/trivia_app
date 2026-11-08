const params = new URLSearchParams(window.location.search);
const cat = params.get("cat");
const diff = Number(params.get("diff"));

let state = loadState();

if (!cat || !diff || !QUESTION_BANK[cat] || !QUESTION_BANK[cat][diff - 1]) {
  window.location.href = "index.html";
}

const qData = QUESTION_BANK[cat][diff - 1];
const points = diff * 100;
const BONUS_POINTS = 20;
const BONUS_SECONDS = 10;
const answeringTeamIdx = state.currentTeam;
let activeTeamIdx = answeringTeamIdx;
let bonusRoundActive = false;

document.getElementById("qCategory").textContent = cat;
document.getElementById("qPoints").textContent = `${points} pts`;
document.getElementById("qTeamName").textContent = state.teams[answeringTeamIdx].name;
document.getElementById("qQuestion").textContent = qData.q;

const answerArea = document.getElementById("answerArea");
const submitBtn = document.getElementById("submitBtn");
const resultArea = document.getElementById("resultArea");

renderAnswerArea();

function renderAnswerArea() {
  answerArea.innerHTML = "";

  if (qData.type === "mcq" || qData.type === "picture") {
    if (qData.type === "picture") {
      const imageWrap = document.createElement("div");
      imageWrap.className = "clue-image";
      if (qData.imageSrc) {
        imageWrap.innerHTML = `<img src="${qData.imageSrc}" alt="Clue image">`;
      } else {
        imageWrap.innerHTML = qData.image;
      }
      answerArea.appendChild(imageWrap);
    }

    const list = document.createElement("div");
    list.className = "options-list";
    qData.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "option-row";
      label.innerHTML = `
        <input type="radio" name="mcq" value="${idx}">
        <span>${opt}</span>
      `;
      list.appendChild(label);
    });
    answerArea.appendChild(list);
  }

  if (qData.type === "multi") {
    const hint = document.createElement("p");
    hint.className = "hint-text";
    hint.textContent = "Select ALL correct options.";
    answerArea.appendChild(hint);

    const list = document.createElement("div");
    list.className = "options-list";
    qData.options.forEach((opt, idx) => {
      const label = document.createElement("label");
      label.className = "option-row";
      label.innerHTML = `
        <input type="checkbox" name="multi" value="${idx}">
        <span>${opt}</span>
      `;
      list.appendChild(label);
    });
    answerArea.appendChild(list);
  }

  if (qData.type === "match") {
    const table = document.createElement("div");
    table.className = "match-table";
    qData.left.forEach((leftLabel, idx) => {
      const row = document.createElement("div");
      row.className = "match-row";

      const leftEl = document.createElement("div");
      leftEl.className = "match-left";
      leftEl.textContent = leftLabel;

      const select = document.createElement("select");
      select.className = "match-select";
      select.dataset.leftIndex = idx;
      select.innerHTML = `<option value="">-- choose match --</option>` +
        qData.right.map((r, rIdx) => `<option value="${rIdx}">${r}</option>`).join("");

      row.appendChild(leftEl);
      row.appendChild(select);
      table.appendChild(row);
    });
    answerArea.appendChild(table);
  }
}

function getSelectedAnswer() {
  if (qData.type === "mcq" || qData.type === "picture") {
    const checked = answerArea.querySelector('input[name="mcq"]:checked');
    return checked ? Number(checked.value) : null;
  }
  if (qData.type === "multi") {
    const checked = Array.from(answerArea.querySelectorAll('input[name="multi"]:checked'));
    return checked.map(c => Number(c.value));
  }
  if (qData.type === "match") {
    const selects = Array.from(answerArea.querySelectorAll(".match-select"));
    return selects.map(s => s.value === "" ? null : Number(s.value));
  }
  return null;
}

function isCorrect(given) {
  if (qData.type === "mcq" || qData.type === "picture") {
    return given === qData.answer;
  }
  if (qData.type === "multi") {
    const a = [...qData.answer].sort();
    const g = [...given].sort();
    return a.length === g.length && a.every((v, i) => v === g[i]);
  }
  if (qData.type === "match") {
    return qData.answer.every((v, i) => given[i] === v);
  }
  return false;
}

function formatCorrectAnswer() {
  if (qData.type === "mcq" || qData.type === "picture") {
    return qData.options[qData.answer];
  }
  if (qData.type === "multi") {
    return qData.answer.map(i => qData.options[i]).join(", ");
  }
  if (qData.type === "match") {
    return qData.left.map((l, i) => `${l} → ${qData.right[qData.answer[i]]}`).join(" | ");
  }
  return "";
}

submitBtn.addEventListener("click", () => {
  if (submitBtn.textContent === "Continue") {
    window.location.href = "index.html";
    return;
  }

  const given = getSelectedAnswer();
  if (given === null || (Array.isArray(given) && given.length === 0) ||
      (qData.type === "match" && given.some(v => v === null))) {
    alert("Please answer before submitting.");
    return;
  }

  stopTimer();
  finalizeAnswer(given, false);
});

// ---------- Timer ----------

const TIME_LIMITS = { 1: 30, 2: 30, 3: 30, 4: 45, 5: 60 };
let timeLeft = TIME_LIMITS[diff] || 30;
let timerInterval = null;

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const el = document.getElementById("timerDisplay");
  if (!el) return;
  el.textContent = `⏱ ${timeLeft}s`;
  el.classList.toggle("timer-warning", timeLeft <= 5);
}

function handleTimeout() {
  if (submitBtn.textContent === "Continue") return;

  if (!bonusRoundActive) {
    startBonusRound();
    return;
  }

  const given = getSelectedAnswer();
  const hasAnswer = given !== null && !(Array.isArray(given) && given.length === 0) &&
    !(qData.type === "match" && given.some(v => v === null));
  finalizeAnswer(hasAnswer ? given : null, true);
}

function startBonusRound() {
  bonusRoundActive = true;
  activeTeamIdx = (activeTeamIdx + 1) % state.teams.length;
  resetInputs();

  document.getElementById("qTeamName").textContent = state.teams[activeTeamIdx].name;
  document.getElementById("qPoints").textContent = `${BONUS_POINTS} pts (bonus)`;

  resultArea.classList.remove("hidden");
  resultArea.innerHTML = `<p class="hint-text">⚡ Bonus chance! ${state.teams[activeTeamIdx].name} has ${BONUS_SECONDS} extra seconds to answer for ${BONUS_POINTS} points.</p>`;

  showToast("⏰ Time's up! Passing to the next team...", "timeout");

  timeLeft = BONUS_SECONDS;
  startTimer();
}

function resetInputs() {
  if (qData.type === "mcq" || qData.type === "picture") {
    answerArea.querySelectorAll('input[name="mcq"]').forEach(el => { el.checked = false; el.disabled = false; });
  }
  if (qData.type === "multi") {
    answerArea.querySelectorAll('input[name="multi"]').forEach(el => { el.checked = false; el.disabled = false; });
  }
  if (qData.type === "match") {
    answerArea.querySelectorAll(".match-select").forEach(el => { el.value = ""; el.disabled = false; });
  }
}

function finalizeAnswer(given, isTimeout) {
  const correct = given !== null && isCorrect(given);
  const pointsAwarded = bonusRoundActive ? BONUS_POINTS : points;

  // lock inputs
  answerArea.querySelectorAll("input, select").forEach(el => el.disabled = true);

  if (correct) {
    state.teams[activeTeamIdx].score += pointsAwarded;
  }

  state.used[cellKey(cat, diff)] = true;
  state.currentTeam = (answeringTeamIdx + 1) % state.teams.length;
  saveState(state);

  resultArea.classList.remove("hidden");
  const heading = correct
    ? `✅ Correct! ${state.teams[activeTeamIdx].name} earns ${pointsAwarded} points.`
    : (isTimeout ? "⏰ Time's up!" : "❌ Not quite.");
  resultArea.innerHTML = `
    <p class="result-heading ${correct ? "correct" : "incorrect"}">${heading}</p>
    ${correct ? "" : `<p class="result-answer">Correct answer: ${formatCorrectAnswer()}</p>`}
  `;

  if (correct) {
    showToast(`🎉 Correct! ${state.teams[activeTeamIdx].name} earns ${pointsAwarded} points!`, "correct");
    spawnConfetti();
  } else if (isTimeout) {
    showToast("⏰ Time's up!", "timeout");
  } else {
    showToast("💩 You got it wrong!", "timeout");
  }

  submitBtn.textContent = "Continue";
}

startTimer();
