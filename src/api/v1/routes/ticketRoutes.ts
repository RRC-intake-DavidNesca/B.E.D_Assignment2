import { Router } from "express";
import {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketUrgency,
} from "../controllers/ticketController";

const ticketRoutes: Router = Router();

ticketRoutes.get("/", getAllTickets);
ticketRoutes.get("/:id", getTicketById);
ticketRoutes.post("/", createTicket);
ticketRoutes.put("/:id", updateTicket);
ticketRoutes.delete("/:id", deleteTicket);
ticketRoutes.get("/:id/urgency", getTicketUrgency);

export default ticketRoutes;
