/**
 * File: src/api/v1/routes/index.ts
 * Purpose: Combines v1 routes and mounts feature routers under /api/v1.
 */

import { Router } from "express";

import healthRoutes from "./healthRoutes";
import ticketRoutes from "./ticketRoutes";

const v1Routes: Router = Router();

v1Routes.use("/health", healthRoutes);
v1Routes.use("/tickets", ticketRoutes);

export default v1Routes;
