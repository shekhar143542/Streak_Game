import { ApiError, getApiResponse } from "./client";
import type { PlayerStatus } from "../types/game";

export function getPlayer(username: string): Promise<PlayerStatus | null> {
	return getApiResponse<PlayerStatus>(`/api/player/${encodeURIComponent(username)}`).catch((error: unknown) => {
		if (error instanceof ApiError && error.status === 404) {
			return null;
		}

		throw error;
	});
}
