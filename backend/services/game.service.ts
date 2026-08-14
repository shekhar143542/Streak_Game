import { eq, sql } from "drizzle-orm";

import { db } from "../db/index";
import { dailyPuzzles } from "../db/schema";
import { HttpError } from "../errors/http-error";

export interface TodayPuzzleResponse {
	date: string;
	question: string;
}

export interface SubmitGuessResponse {
	correct: boolean;
	streak: number;
	message: "Correct!" | "Wrong!";
	answer: string;
}

function getTodayCalendarDate(): Date {
	const now = new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function formatDate(value: Date): string {
	return value.toISOString().slice(0, 10);
}

function getYesterdayCalendarDate(today: Date): Date {
	const yesterday = new Date(today);
	yesterday.setUTCDate(yesterday.getUTCDate() - 1);
	return yesterday;
}

function normalizeRequiredString(value: unknown, fieldName: "username" | "guess"): string {
	if (typeof value !== "string") {
		throw new HttpError(400, `Invalid ${fieldName}.`);
	}

	const trimmed = value.trim();
	if (!trimmed || (fieldName === "username" && trimmed.length > 50)) {
		throw new HttpError(400, `Invalid ${fieldName}.`);
	}

	return trimmed;
}

function isUniqueConstraintError(error: unknown): boolean {
	return typeof error === "object"
		&& error !== null
		&& "code" in error
		&& (error as { code?: unknown }).code === "23505";
}

export async function getTodayPuzzle(database = db): Promise<TodayPuzzleResponse> {
	const today = getTodayCalendarDate();

	try {
		const [puzzle] = await database
			.select({
				puzzleDate: dailyPuzzles.puzzleDate,
				clue: dailyPuzzles.clue,
			})
			.from(dailyPuzzles)
			.where(eq(dailyPuzzles.puzzleDate, today))
			.limit(1);

		if (!puzzle) {
			throw new HttpError(404, "Today's puzzle is not available.");
		}

		return {
			date: formatDate(puzzle.puzzleDate),
			question: puzzle.clue,
		};
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		throw new HttpError(500, "Unable to load today's puzzle.");
	}
}

export async function submitGuess(
	rawUsername: unknown,
	rawGuess: unknown,
	database = db,
): Promise<SubmitGuessResponse> {
	const username = normalizeRequiredString(rawUsername, "username");
	const guess = normalizeRequiredString(rawGuess, "guess");
	const today = getTodayCalendarDate();
	const yesterday = getYesterdayCalendarDate(today);

	try {
		const [puzzle] = await database
			.select({
				id: dailyPuzzles.id,
				answer: dailyPuzzles.answer,
			})
			.from(dailyPuzzles)
			.where(eq(dailyPuzzles.puzzleDate, today))
			.limit(1);

		if (!puzzle) {
			throw new HttpError(404, "Today's puzzle is not available.");
		}

		const correct = guess.toLowerCase() === puzzle.answer.trim().toLowerCase();

		const playerQueryResult = await database.execute<{ id: number }>(sql`
			INSERT INTO players (username)
			VALUES (${username})
			ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
			RETURNING id
		`);
		const playerId = playerQueryResult.rows[0]?.id;

		if (!playerId) {
			throw new HttpError(500, "Unable to find player.");
		}

		const guessQueryResult = await database.execute<{ id: number }>(sql`
			INSERT INTO guesses (player_id, puzzle_id, submitted_guess, is_correct)
			VALUES (${playerId}, ${puzzle.id}, ${guess}, ${correct})
			ON CONFLICT (player_id, puzzle_id) DO NOTHING
			RETURNING id
		`);
		const insertedGuess = guessQueryResult.rows[0];

		if (!insertedGuess) {
			throw new HttpError(409, "You have already played today.");
		}

		const updateResult = await database.execute<{ streak: number }>(sql`
			UPDATE players
			SET
				current_streak = CASE
					WHEN ${correct} THEN CASE
						WHEN last_played_date = ${yesterday} THEN current_streak + 1
						ELSE 1
					END
					ELSE 0
				END,
				last_played_date = ${today}
			WHERE players.id = ${playerId}
			RETURNING players.current_streak AS streak
		`);
		const [result] = updateResult.rows;

		if (!result) {
			throw new HttpError(500, "Unable to update player streak.");
		}

		return {
			correct,
			streak: result.streak,
			message: correct ? "Correct!" : "Wrong!",
			answer: puzzle.answer,
		};
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		if (isUniqueConstraintError(error)) {
			throw new HttpError(409, "You have already played today.");
		}

		throw new HttpError(500, "Unable to submit guess.");
	}
}

