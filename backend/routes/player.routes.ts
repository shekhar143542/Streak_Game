import { Router } from "express";

import { getPlayerStatusController } from "../controllers/player.controller";

const playerRouter = Router();

playerRouter.get("/:username", getPlayerStatusController);

export { playerRouter };
