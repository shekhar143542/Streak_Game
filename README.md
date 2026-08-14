# ⚡ Streak — Daily Tech Trivia Game

> **One puzzle. One guess. Every day.** Build and protect your daily streak.

Streak is a full-stack, daily tech puzzle web application built with **React 19**, **Node.js/Express**, **TypeScript**, **PostgreSQL**, and **Drizzle ORM**. Players get one tech-related clue each calendar day. A correct answer increments their streak; a wrong answer or missed day resets it.

---

## 🌟 Features

- 🧩 **Daily Tech Puzzles**: A new tech trivia clue is unlocked each calendar day in UTC.
- 🔥 **Streak Progression & Logic**:
  - **Correct Answer**: Increments your current streak (+1) when played consecutively, or starts a streak of 1.
  - **Wrong Answer**: Resets your current streak to 0 and records your attempt for the day.
  - **Missed Day**: Automatically resets streak on your next played day if yesterday's puzzle was missed.
  - **One Guess Per Day**: Strictly enforced at the database level with a unique constraint on `(player_id, puzzle_id)`. Subsequent attempts return an HTTP 409 Conflict with an on-screen toast notification.
- 📅 **Streak Calendar Sidebar**:
  - Displays the active month grid with distinct day indicators.
  - **`✓` Gold Checkmark**: Persistently marks every day you answered correctly.
  - **`✕` Red Cross**: Persistently marks every day you answered incorrectly.
  - **Glowing Gold Ring**: Highlights today's active puzzle date.
  - **Muted Cells**: Indicates upcoming dates in the month.
- 🎨 **Modern Dark-Mode Aesthetic**:
  - Crafted with Vanilla CSS custom design tokens and glassmorphism.
  - Neon gold highlights, celebratory pop & shake animations, and responsive 2-column sidebar layout.
- 👤 **Persistent Player Profile**: Username-based session stored in browser `localStorage` with easy profile switching.

---

## 🏗️ Architecture & Tech Stack

```
streakgame/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Request handlers (game.controller, player.controller)
│   ├── db/                   # Drizzle ORM schema, client connection, and seed script
│   ├── errors/               # Custom HttpError classes and error middleware
│   ├── middleware/           # Express error-handling and CORS middleware
│   ├── routes/               # API route definitions (game, player)
│   ├── services/             # Core business logic (game, player)
│   └── server.ts             # Express server entry point
│
└── frontend/                 # React 19 + TypeScript + Vite SPA
    ├── src/
    │   ├── api/              # Fetch API clients (gameApi, playerApi, client)
    │   ├── components/       # UI components (StreakDisplay, PuzzleCard, GuessForm,
    │   │                     #   StreakCalendar, ResultMessage, Toast, etc.)
    │   ├── types/            # TypeScript domain types (PlayerStatus, TodayPuzzle, etc.)
    │   ├── App.tsx           # Main application state orchestrator
    │   └── style.css         # Complete Vanilla CSS design system
    └── index.html            # Web app entry point
```

### Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (CSS Variables, Grid, Flexbox, Keyframe Animations) |
| **Backend Framework** | [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/) (via [tsx](https://github.com/privatenumber/tsx)) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) (Local or [Neon](https://neon.tech/)) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) + [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |

---

## 🗄️ Database Schema

### `players` Table
Stores player identity and current streak count.
```sql
CREATE TABLE players (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) NOT NULL UNIQUE,
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
    last_played_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `daily_puzzles` Table
Stores daily trivia clues and answers indexed by calendar date.
```sql
CREATE TABLE daily_puzzles (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    puzzle_date DATE NOT NULL UNIQUE,
    clue TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### `guesses` Table
Tracks every player's daily submission and correctness.
```sql
CREATE TABLE guesses (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    player_id INTEGER NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    puzzle_id INTEGER NOT NULL REFERENCES daily_puzzles(id) ON DELETE CASCADE,
    submitted_guess TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT guesses_player_id_puzzle_id_unique UNIQUE (player_id, puzzle_id)
);
```

---

## 🔌 API Reference

### 1. Get Today's Puzzle
Retrieves the active clue for today's date.
- **Endpoint**: `GET /api/game/today`
- **Response `(200 OK)`**:
  ```json
  {
    "date": "2026-08-14",
    "question": "What markup language structures a web page?"
  }
  ```

---

### 2. Submit Daily Guess
Submits a guess for today's puzzle. Evaluates correctness case-insensitively and updates the player's streak.
- **Endpoint**: `POST /api/game/guess`
- **Request Body**:
  ```json
  {
    "username": "coder123",
    "guess": "HTML"
  }
  ```
- **Response `(200 OK)`**:
  ```json
  {
    "correct": true,
    "streak": 1,
    "message": "Correct!",
    "answer": "HTML"
  }
  ```
- **Duplicate Submission `(409 Conflict)`**:
  ```json
  {
    "error": "You have already played today."
  }
  ```

---

### 3. Get Player Status & History
Retrieves player streak and historical calendar results.
- **Endpoint**: `GET /api/player/:username`
- **Response `(200 OK)`**:
  ```json
  {
    "username": "coder123",
    "currentStreak": 1,
    "lastPlayedDate": "2026-08-14",
    "hasPlayedToday": true,
    "history": {
      "2026-08-14": true,
      "2026-08-15": false
    }
  }
  ```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20.x or higher recommended)
- **PostgreSQL** database (running locally or a cloud instance like Neon)

---

### 1. Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/`:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/streak_db
   NODE_ENV=development
   ```
4. Push database migrations and seed daily puzzles:
   ```bash
   # Push schema to PostgreSQL
   npx drizzle-kit push

   # Seed initial daily tech puzzles
   npm run db:seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend runs at `http://localhost:3000`.*

---

### 2. Frontend Setup

1. In a new terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `frontend/`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the frontend Vite dev server:
   ```bash
   npm run dev
   ```
   *Frontend runs at `http://localhost:5173`.*

5. Open [http://localhost:5173](http://localhost:5173) in your browser, enter a username, and start playing!

---

## 📜 Game Rules Summary

1. **One Puzzle Per Calendar Day**: Each puzzle is locked to a single calendar date in UTC.
2. **One Attempt**: Once a guess is submitted for today's puzzle, the answer is locked until tomorrow.
3. **Streak Continuity**:
   - Submitting a **correct** answer when your last played date was **yesterday** increments your streak (`streak = current + 1`).
   - Submitting a **correct** answer on your first day or after a break sets your streak to `1`.
   - Submitting a **wrong** answer sets your streak to `0`.
4. **Case Insensitive**: Answers such as `html`, `HTML`, or `  Html  ` are trimmed and matched accurately.

---

## 📄 License
MIT License. Free for educational and personal use.
