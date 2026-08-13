import type { NextFunction, Request, Response } from "express";

import { getTodayPuzzle } from "../services/game.service";

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

