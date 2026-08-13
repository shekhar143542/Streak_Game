import { getApiResponse, postApiResponse } from "./client";
import type { GuessRequest, GuessResponse, TodayPuzzle } from "../types/game";

export function getTodayPuzzle(): Promise<TodayPuzzle> {
	return getApiResponse<TodayPuzzle>("/api/game/today");
}

export function submitGuess(username: string, guess: string): Promise<GuessResponse> {
	const request: GuessRequest = { username, guess };
	return postApiResponse<GuessResponse>("/api/game/guess", request);
}
