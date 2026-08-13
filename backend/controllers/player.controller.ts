import type { NextFunction, Request, Response } from "express";

import { getPlayerStatus } from "../services/player.service";

export function createGetPlayerStatusController(playerService = getPlayerStatus) {
	return async function getPlayerStatusController(request: Request, response: Response, next: NextFunction) {
		try {
			const username = typeof request.params.username === "string" ? request.params.username : undefined;
			const playerStatus = await playerService(username);
			return response.status(200).json(playerStatus);
		} catch (error) {
			next(error);
		}
	};
}

export const getPlayerStatusController = createGetPlayerStatusController();
