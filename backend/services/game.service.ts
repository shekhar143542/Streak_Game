import { eq } from "drizzle-orm";

import { db } from "../db/index";
import { dailyPuzzles } from "../db/schema";
import { HttpError } from "../errors/http-error";

export interface TodayPuzzleResponse {
	date: string;
	question: string;
}

function getTodayCalendarDate(): Date {
	const now = new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function formatDate(value: Date): string {
	return value.toISOString().slice(0, 10);
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

