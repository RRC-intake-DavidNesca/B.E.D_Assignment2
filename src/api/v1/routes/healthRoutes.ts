/**
 * Health check routes mounted at /api/v1/health.
 */

import { Router } from "express";
import { getHealth } from "../controllers/healthController";

const healthRouter: Router = Router();

healthRouter.get("/", getHealth);

export default healthRouter;
