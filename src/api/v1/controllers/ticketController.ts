import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as ticketService from "../services/ticketService";
import type { UpdateTicketBody } from "../services/ticketTypes";
import { TICKET_PRIORITIES, TICKET_STATUSES } from "../services/ticketTypes";

const VALID_PRIORITIES = TICKET_PRIORITIES as readonly string[];
const VALID_STATUSES = TICKET_STATUSES as readonly string[];

export function getAllTickets(_req: Request, res: Response): Response {
    try {
        const tickets = ticketService.getAllTickets();
        return res.status(HTTP_STATUS.OK).json({
            message: "Tickets retrieved",
            count: tickets.length,
            data: tickets,
        });
    } catch (error) {
        console.error("Error retrieving tickets:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}

export function getTicketById(req: Request, res: Response): Response {
    try {
        const id = Number.parseInt(String(req.params.id), 10);
        if (Number.isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid ticket ID" });
        }
        const ticket = ticketService.getTicketById(id);
        if (!ticket) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
        }
        return res.status(HTTP_STATUS.OK).json({
            message: "Ticket retrieved",
            data: ticket,
        });
    } catch (error) {
        console.error("Error retrieving ticket:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}

export function createTicket(req: Request, res: Response): Response {
    try {
        const body = req.body;
        if (!body || typeof body !== "object") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }
        const title = body.title;
        const description = body.description;
        const priority = body.priority;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: title",
            });
        }
        if (typeof description !== "string" || !description.trim()) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required field: description",
            });
        }
        if (typeof priority !== "string" || !VALID_PRIORITIES.includes(priority)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: critical, high, medium, low",
            });
        }

        const created = ticketService.createTicket({
            title: title.trim(),
            description: description.trim(),
            priority: priority as "critical" | "high" | "medium" | "low",
        });
        return res.status(HTTP_STATUS.CREATED).json({
            message: "Ticket created",
            data: created,
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}

export function updateTicket(req: Request, res: Response): Response {
    try {
        const id = Number.parseInt(String(req.params.id), 10);
        if (Number.isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid ticket ID" });
        }
        const body = req.body;
        if (!body || typeof body !== "object") {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid request body",
            });
        }
        const updates: Record<string, unknown> = { ...body };
        if (
            typeof updates.priority !== "undefined" &&
            (typeof updates.priority !== "string" || !VALID_PRIORITIES.includes(updates.priority))
        ) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid priority. Must be one of: critical, high, medium, low",
            });
        }
        if (
            typeof updates.status !== "undefined" &&
            (typeof updates.status !== "string" || !VALID_STATUSES.includes(updates.status))
        ) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Invalid status. Must be one of: open, in-progress, resolved",
            });
        }

        const updated = ticketService.updateTicketById(id, updates as UpdateTicketBody);
        if (!updated) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
        }
        return res.status(HTTP_STATUS.OK).json({
            message: "Ticket updated successfully",
            data: updated,
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}

export function deleteTicket(req: Request, res: Response): Response {
    try {
        const id = Number.parseInt(String(req.params.id), 10);
        if (Number.isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid ticket ID" });
        }
        const deleted = ticketService.deleteTicketById(id);
        if (!deleted) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
        }
        return res.status(HTTP_STATUS.OK).json({ message: "Ticket deleted" });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}

export function getTicketUrgency(req: Request, res: Response): Response {
    try {
        const id = Number.parseInt(String(req.params.id), 10);
        if (Number.isNaN(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Invalid ticket ID" });
        }
        const urgency = ticketService.getTicketUrgencyById(id);
        if (!urgency) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
        }
        return res.status(HTTP_STATUS.OK).json({
            message: "Ticket urgency calculated",
            data: urgency,
        });
    } catch (error) {
        console.error("Error calculating ticket urgency:", error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
}
