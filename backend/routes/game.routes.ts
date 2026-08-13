import { Router } from 'express';

import { getTodayPuzzleController, submitGuessController } from "../controllers/game.controller";

const gameRouter = Router();

gameRouter.get("/today", getTodayPuzzleController);
gameRouter.post("/guess", submitGuessController);

export { gameRouter };
