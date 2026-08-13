import { eq } from "drizzle-orm";

import { db } from "../db/index";
import { players } from "../db/schema";
import { HttpError } from "../errors/http-error";

export interface PlayerStatusResponse {
	username: string;
	currentStreak: number;
	lastPlayedDate: string | null;
	hasPlayedToday: boolean;
}

function getTodayCalendarDate(): Date {
	const now = new Date();
	return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function formatDate(value: Date): string {
	return value.toISOString().slice(0, 10);
}

function isSameCalendarDay(left: Date, right: Date): boolean {
	return left.getUTCFullYear() === right.getUTCFullYear()
		&& left.getUTCMonth() === right.getUTCMonth()
		&& left.getUTCDate() === right.getUTCDate();
}

function normalizeUsername(value: string | undefined): string {
	const trimmed = value?.trim();

	if (!trimmed || trimmed.length === 0) {
		throw new HttpError(400, "Invalid username.");
	}

	if (trimmed.length > 50) {
		throw new HttpError(400, "Invalid username.");
	}

	return trimmed;
}

export async function getPlayerStatus(rawUsername: string | undefined, database = db): Promise<PlayerStatusResponse> {
	const username = normalizeUsername(rawUsername);
	const today = getTodayCalendarDate();

	try {
		const [player] = await database
			.select({
				username: players.username,
				currentStreak: players.currentStreak,
				lastPlayedDate: players.lastPlayedDate,
			})
			.from(players)
			.where(eq(players.username, username))
			.limit(1);

		if (!player) {
			throw new HttpError(404, "Player not found.");
		}

		const lastPlayedDate = player.lastPlayedDate ? formatDate(player.lastPlayedDate) : null;

		return {
			username: player.username,
			currentStreak: player.currentStreak,
			lastPlayedDate,
			hasPlayedToday: Boolean(player.lastPlayedDate && isSameCalendarDay(player.lastPlayedDate, today)),
		};
	} catch (error) {
		if (error instanceof HttpError) {
			throw error;
		}

		throw new HttpError(500, "Unable to load player status.");
	}
}
