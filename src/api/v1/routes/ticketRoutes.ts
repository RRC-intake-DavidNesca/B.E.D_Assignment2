import { Router } from "express";
import { getTickets, getUrgencyByTicketId } from "../controllers/ticketController";

const ticketRouter: Router = Router();

ticketRouter.get("/", getTickets);
ticketRouter.get("/:id/urgency", getUrgencyByTicketId);

export default ticketRouter;

