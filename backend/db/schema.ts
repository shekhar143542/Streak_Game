import {
  boolean,
  date,
  integer,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const players = pgTable(
  "players",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    username: varchar({ length: 50 }).notNull(),
    currentStreak: integer("current_streak").notNull().default(0),
    lastPlayedDate: date("last_played_date", { mode: "date" }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    usernameUnique: uniqueIndex("players_username_unique").on(table.username),
    currentStreakNonNegative: check(
      "players_current_streak_non_negative",
      sql`${table.currentStreak} >= 0`,
    ),
  }),
);

export const dailyPuzzles = pgTable(
  "daily_puzzles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    puzzleDate: date("puzzle_date", { mode: "date" }).notNull(),
    clue: text("clue").notNull(),
    answer: text("answer").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    puzzleDateUnique: uniqueIndex("daily_puzzles_puzzle_date_unique").on(table.puzzleDate),
  }),
);

export const guesses = pgTable(
  "guesses",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    playerId: integer("player_id")
      .notNull()
      .references(() => players.id, { onDelete: "cascade" }),
    puzzleId: integer("puzzle_id")
      .notNull()
      .references(() => dailyPuzzles.id, { onDelete: "cascade" }),
    submittedGuess: text("submitted_guess").notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    oneGuessPerPuzzle: uniqueIndex("guesses_player_id_puzzle_id_unique").on(table.playerId, table.puzzleId),
    playerHistoryIndex: index("guesses_player_id_idx").on(table.playerId),
  }),
);
