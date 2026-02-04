/**
 * Handles ticket HTTP requests, performs basic validation, and formats responses for the tickets endpoints.
 */

import { Request, Response } from "express";

import { HTTP_STATUS } from "../../../constants/httpConstants";
import { TicketService } from "../services/ticketService";
import {
    TICKET_PRIORITIES,
    TICKET_STATUSES,
    type CreateTicketBody,
    type UpdateTicketBody,
} from "../services/ticketTypes";

function parseTicketId(idParam: unknown): number {
    if (typeof idParam === "string") {
        return Number.parseInt(idParam, 10);
    }

    if (Array.isArray(idParam) && typeof idParam[0] === "string") {
        return Number.parseInt(idParam[0], 10);
    }

    return NaN;
}

function isValidPriority(value: unknown): value is (typeof TICKET_PRIORITIES)[number] {
    return typeof value === "string" && (TICKET_PRIORITIES as readonly string[]).includes(value);
}

function isValidStatus(value: unknown): value is (typeof TICKET_STATUSES)[number] {
    return typeof value === "string" && (TICKET_STATUSES as readonly string[]).includes(value);
}

export class TicketController {
    public getAllTickets(req: Request, res: Response): Response {
        try {
            const tickets = TicketService.getAllTickets();

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

    public getTicketById(req: Request, res: Response): Response {
        try {
            const id = parseTicketId(req.params.id);
            const ticket = TicketService.getTicketById(id);

            if (!ticket) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: "Ticket not found",
                });
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

    public createTicket(req: Request, res: Response): Response {
        try {
            const { title, description, priority } = req.body as Partial<CreateTicketBody>;

            if (!title) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Missing required field: title",
                });
            }

            if (!description) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Missing required field: description",
                });
            }

            if (!isValidPriority(priority)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid priority. Must be one of: critical, high, medium, low",
                });
            }

            const created = TicketService.createTicket({
                title,
                description,
                priority,
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

    public updateTicket(req: Request, res: Response): Response {
        try {
            const id = parseTicketId(req.params.id);

            const updates = req.body as UpdateTicketBody;

            if (typeof updates.priority !== "undefined" && !isValidPriority(updates.priority)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid priority. Must be one of: critical, high, medium, low",
                });
            }

            if (typeof updates.status !== "undefined" && !isValidStatus(updates.status)) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({
                    message: "Invalid status. Must be one of: open, in-progress, resolved",
                });
            }

            const updated = TicketService.updateTicketById(id, updates);

            if (!updated) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: "Ticket not found",
                });
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

    public deleteTicket(req: Request, res: Response): Response {
        try {
            const id = parseTicketId(req.params.id);
            const deleted = TicketService.deleteTicketById(id);

            if (!deleted) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: "Ticket not found",
                });
            }

            return res.status(HTTP_STATUS.OK).json({
                message: "Ticket deleted",
            });
        } catch (error) {
            console.error("Error deleting ticket:", error);
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: "Internal Server Error",
            });
        }
    }

    public getTicketUrgency(req: Request, res: Response): Response {
        try {
            const id = parseTicketId(req.params.id);
            const urgency = TicketService.getTicketUrgencyById(id);

            if (!urgency) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    message: "Ticket not found",
                });
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
}

export const ticketController: TicketController = new TicketController();
