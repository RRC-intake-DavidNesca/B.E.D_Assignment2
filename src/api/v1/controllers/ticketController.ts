import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { getAllTickets, getTicketUrgency, TicketUrgency } from "../services/ticketService";
import { Ticket } from "../services/ticketTypes";

export const getTickets = (_req: Request, res: Response): void => {
    const data: Ticket[] = getAllTickets();
    res.status(HTTP_STATUS.OK).json({
        message: "Tickets retrieved",
        count: data.length,
        data,
    });
};

export const getUrgencyByTicketId = (req: Request, res: Response): void => {
    const id: number = Number(req.params.id);
    const urgency: TicketUrgency | undefined = getTicketUrgency(id);

    if (!urgency) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Ticket not found" });
        return;
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Ticket urgency calculated",
        data: urgency,
    });
};

