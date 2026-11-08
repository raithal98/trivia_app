# Trivia Showdown

A local, browser-based trivia game for 4 teams. Plain HTML/CSS/JavaScript — no build tools, no backend, no database. Game progress is saved in your browser's `localStorage`.

## Running it on your laptop

You just need Python (already on macOS/Linux; on Windows install from python.org).

1. Open a terminal in this folder.
2. Start a local server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open your browser to:
   ```
   http://localhost:8080/index.html
   ```
4. To stop the server, go back to the terminal and press `Ctrl+C`.

> Opening `index.html` directly as a `file://` won't work reliably — always use the local server.

## How the game works

- **Board**: 4 categories x 5 difficulty levels. Each cell is worth `level x 100` points.
- **Teams**: 4 teams take turns picking a cell and answering a question.
- **Rapid Fire**: a bonus round (linked from the board) where each team answers a set of quick questions against a shared timer.
- Click the **Rules** button in-game for the full breakdown of scoring and timers.

### Resetting the game
Click **Reset Game** on the board page. This clears saved progress (scores, used cells, rapid fire state) from `localStorage`.

## Editing the questions

All question content lives in [questions.js](questions.js) — you don't need to touch any other file to change questions.

### Main board questions

The board questions are in the `QUESTION_BANK` object, organized by category, with one question per difficulty level (1-5, in order):

```js
const QUESTION_BANK = {
  "Category Name": [
    { /* level 1 question */ },
    { /* level 2 question */ },
    { /* level 3 question */ },
    { /* level 4 question */ },
    { /* level 5 question */ }
  ],
  ...
};
```

Each question is an object with a `type` field. Supported types:

- **`mcq`** — single correct answer.
  ```js
  {
    type: "mcq",
    q: "Question text?",
    options: ["A", "B", "C", "D"],
    answer: 2 // index of the correct option
  }
  ```

- **`picture`** — same as `mcq`, plus an image shown with the question.
  ```js
  {
    type: "picture",
    q: "Question text?",
    imageSrc: "images/your-image.png",
    options: ["A", "B", "C", "D"],
    answer: 1
  }
  ```

- **`multi`** — select-all-that-apply.
  ```js
  {
    type: "multi",
    q: "Question text? (select all that apply)",
    options: ["A", "B", "C", "D", "E"],
    answer: [0, 2, 3] // indices of ALL correct options
  }
  ```

- **`match`** — match items on the left to items on the right.
  ```js
  {
    type: "match",
    q: "Match the X to the Y.",
    left: ["Item 1", "Item 2", "Item 3"],
    right: ["Match C", "Match A", "Match B"], // can be shuffled relative to left
    answer: [1, 2, 0] // answer[i] = index into right[] that matches left[i]
  }
  ```

To add a new category, add a new key to `QUESTION_BANK` with an array of exactly 5 questions. To change a question, just edit its text, `options`/`left`/`right`, and make sure `answer` still points to the correct index/indices after any edits.

Adding an image for a `picture` question: drop the image file in the [images/](images/) folder and reference it as `images/your-filename.png` in `imageSrc`.

### Rapid Fire questions

Below `QUESTION_BANK` in the same file:

```js
const RAPID_FIRE_POINTS = 100;      // points per correct rapid-fire answer
const RAPID_FIRE_TEAM_TIME = 30;    // seconds each team gets for their whole set
const RAPID_FIRE_SETS = [
  { questions: [ { q: "...", a: "..." }, ... ] }, // Team 1's questions
  { questions: [ ... ] }, // Team 2's questions
  { questions: [ ... ] }, // Team 3's questions
  { questions: [ ... ] }  // Team 4's questions
];
```

Each entry is a simple `{ q, a }` pair (no multiple choice) — the host reads the question aloud and marks it correct/wrong. Add, remove, or reorder questions freely within each team's `questions` array; teams don't need to have the same number of questions.

## After editing

Just save `questions.js` and refresh the browser tab — no restart or rebuild needed. If something looks broken, open the browser's DevTools console (right-click → Inspect → Console) to check for JavaScript syntax errors (e.g. a missing comma).
