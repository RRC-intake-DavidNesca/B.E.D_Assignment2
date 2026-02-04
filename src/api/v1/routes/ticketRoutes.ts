/**
 * Defines ticket endpoints and maps them to controller handlers.
 */

import { Router } from "express";
import { ticketController } from "../controllers/ticketController";

const ticketRoutes: Router = Router();

/**
 * CRUD routes for tickets
 * Base path is mounted by the v1 router: /api/v1/tickets
 */
ticketRoutes.get("/", ticketController.getAllTickets.bind(ticketController));
ticketRoutes.get("/:id", ticketController.getTicketById.bind(ticketController));
ticketRoutes.post("/", ticketController.createTicket.bind(ticketController));
ticketRoutes.put("/:id", ticketController.updateTicket.bind(ticketController));
ticketRoutes.delete("/:id", ticketController.deleteTicket.bind(ticketController));

/**
 * Special route: ticket urgency
 * GET /api/v1/tickets/:id/urgency
 */
ticketRoutes.get("/:id/urgency", ticketController.getTicketUrgency.bind(ticketController));

export default ticketRoutes;
