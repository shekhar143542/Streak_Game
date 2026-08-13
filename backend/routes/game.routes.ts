import { Router } from 'express';

import { getTodayPuzzleController } from "../controllers/game.controller";

const gameRouter = Router();

gameRouter.get("/today", getTodayPuzzleController);

export { gameRouter };
