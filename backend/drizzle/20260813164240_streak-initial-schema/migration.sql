CREATE TABLE "daily_puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "daily_puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"puzzle_date" date NOT NULL,
	"clue" text NOT NULL,
	"answer" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guesses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "guesses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"player_id" integer NOT NULL,
	"puzzle_id" integer NOT NULL,
	"submitted_guess" text NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "players_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(50) NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"last_played_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_current_streak_non_negative" CHECK ("current_streak" >= 0)
);
--> statement-breakpoint
CREATE UNIQUE INDEX "daily_puzzles_puzzle_date_unique" ON "daily_puzzles" ("puzzle_date");--> statement-breakpoint
CREATE UNIQUE INDEX "guesses_player_id_puzzle_id_unique" ON "guesses" ("player_id","puzzle_id");--> statement-breakpoint
CREATE INDEX "guesses_player_id_idx" ON "guesses" ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "players_username_unique" ON "players" ("username");--> statement-breakpoint
ALTER TABLE "guesses" ADD CONSTRAINT "guesses_player_id_players_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "guesses" ADD CONSTRAINT "guesses_puzzle_id_daily_puzzles_id_fkey" FOREIGN KEY ("puzzle_id") REFERENCES "daily_puzzles"("id") ON DELETE CASCADE;