import type { ErrorRequestHandler } from "express";

import { HttpError } from "../errors/http-error";

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
	if (error instanceof HttpError) {
		return response.status(error.statusCode).json({ error: error.message });
	}

	console.error(error);
	return response.status(500).json({ error: "Unable to load today's puzzle." });
};
