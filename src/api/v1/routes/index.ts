/**
 * Version 1 API router container. Mounts feature routers under /api/v1.
 */

import { Router } from "express";
import healthRouter from "./healthRoutes";
import ticketRouter from "./ticketRoutes";

const v1Router: Router = Router();

v1Router.use("/health", healthRouter);
v1Router.use("/tickets", ticketRouter);

export default v1Router;
