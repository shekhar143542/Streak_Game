const apiUrl = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
	readonly status: number;

	constructor(
		status: number,
		message: string,
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

async function requestApiResponse<T>(path: string, init?: RequestInit): Promise<T> {
	if (!apiUrl) {
		throw new Error("The game server is not configured.");
	}

	let response: Response;
	try {
		response = await fetch(`${apiUrl}${path}`, init);
	} catch {
		throw new Error("Unable to connect to the game server.");
	}

	const payload = await response.json().catch(() => ({})) as { error?: string };
	if (!response.ok) {
		throw new ApiError(response.status, payload.error ?? "Unable to load game data.");
	}

	return payload as T;
}

export function getApiResponse<T>(path: string): Promise<T> {
	return requestApiResponse<T>(path);
}

export function postApiResponse<T>(path: string, body: unknown): Promise<T> {
	return requestApiResponse<T>(path, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}
