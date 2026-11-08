// Injects a "Rules" modal + wiring, shared across index/question/rapidfire pages.
(function () {
  const RULES_HTML = `
    <div class="rules-overlay" id="rulesOverlay">
      <div class="question-card rules-card">
        <div class="modal-header">
          <span class="modal-cat">📜 How to Play</span>
          <button id="closeRulesBtn" class="ghost-btn small">✕ Close</button>
        </div>
        <div class="rules-body">
          <h3>The Board</h3>
          <ul>
            <li>4 categories × 5 difficulty levels (100–500 pts). 20 questions total.</li>
            <li>On your turn, pick <strong>any unused cell</strong> from the grid — no particular order, jump around freely.</li>
            <li>Once a cell is answered, it's locked (✓) and can't be picked again.</li>
          </ul>

          <h3>Timers</h3>
          <ul>
            <li>Levels 1, 2 &amp; 3: 30 seconds</li>
            <li>Level 4: 45 seconds</li>
            <li>Level 5: 60 seconds</li>
          </ul>

          <h3>Bonus Round (Timeout Hand-off)</h3>
          <ul>
            <li>If the answering team's timer runs out, the question passes to the <strong>next team</strong> for a flat <strong>20 points</strong>, with <strong>10 extra seconds</strong>.</li>
            <li>If the bonus team also misses it, no one scores and the correct answer is revealed.</li>
            <li>Turn order still advances normally afterward, regardless of who got the bonus shot.</li>
          </ul>

          <h3>Turns</h3>
          <ul>
            <li>Teams go in order: Team 1 → 2 → 3 → 4 → back to 1.</li>
            <li>Use <strong>Skip Turn</strong> to manually pass without answering.</li>
            <li>Double-click a team's name on the scoreboard to rename them.</li>
          </ul>

          <h3>Rapid Fire Round</h3>
          <ul>
            <li>Unlocked after all 20 questions are complete (or play it anytime via the ⚡ button).</li>
            <li>10 quick questions, no options — teams "buzz in" verbally and the host clicks whichever team buzzed first.</li>
            <li>Correct answer scores 50 points; a wrong answer passes it to the next team that buzzes.</li>
          </ul>

          <h3>Finishing Up</h3>
          <ul>
            <li>Once all 20 board questions are done, a popup announces the winner and the Rapid Fire surprise.</li>
            <li><strong>Reset Game</strong> clears all scores and progress to start fresh.</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  function ensureRulesModal() {
    if (document.getElementById("rulesOverlay")) return;
    document.body.insertAdjacentHTML("beforeend", RULES_HTML);
    document.getElementById("closeRulesBtn").addEventListener("click", closeRulesModal);
    document.getElementById("rulesOverlay").addEventListener("click", (e) => {
      if (e.target.id === "rulesOverlay") closeRulesModal();
    });
  }

  function openRulesModal() {
    ensureRulesModal();
    document.getElementById("rulesOverlay").classList.add("open");
  }

  function closeRulesModal() {
    const el = document.getElementById("rulesOverlay");
    if (el) el.classList.remove("open");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("rulesBtn");
    if (btn) btn.addEventListener("click", openRulesModal);
  });
})();
