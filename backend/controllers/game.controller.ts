import type { NextFunction, Request, Response } from "express";

import { getTodayPuzzle, submitGuess } from "../services/game.service";

export function createGetTodayPuzzleController(puzzleService = getTodayPuzzle) {
	return async function getTodayPuzzleController(_request: Request, response: Response, next: NextFunction) {
		try {
			const puzzle = await puzzleService();
			return response.status(200).json(puzzle);
		} catch (error) {
			next(error);
		}
	};
}

export const getTodayPuzzleController = createGetTodayPuzzleController();

export function createSubmitGuessController(guessService = submitGuess) {
	return async function submitGuessController(request: Request, response: Response, next: NextFunction) {
		try {
			const result = await guessService(request.body?.username, request.body?.guess);
			return response.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}

export const submitGuessController = createSubmitGuessController();

