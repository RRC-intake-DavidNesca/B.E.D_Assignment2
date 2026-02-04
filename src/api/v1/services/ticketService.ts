import { tickets } from "../../../data/tickets";
import { Ticket, TicketPriority } from "./ticketTypes";

export interface TicketUrgency {
    id: number;
    title: string;
    priority: TicketPriority;
    status: Ticket["status"];
    createdAt: string;
    ticketAge: number;
    urgencyScore: number;
    urgencyLevel: string;
}

/** 
 */
const REFERENCE_NOW: Date = new Date("2025-12-17T15:00:00.000Z");
const MS_PER_DAY: number = 24 * 60 * 60 * 1000;
const AGE_MULTIPLIER: number = 5;

const BASE_SCORES: Record<TicketPriority, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
};

export const getAllTickets = (): Ticket[] => {
    return tickets;
};

export const getTicketById = (id: number): Ticket | undefined => {
    return tickets.find((t: Ticket): boolean => t.id === id);
};

function calculateTicketAgeDays(createdAtIso: string): number {
    const createdAt: Date = new Date(createdAtIso);
    const ageMs: number = REFERENCE_NOW.getTime() - createdAt.getTime();
    return Math.max(0, Math.floor(ageMs / MS_PER_DAY));
}

function getUrgencyLevel(status: Ticket["status"], urgencyScore: number): string {
    if (status === "resolved") {
        return "Minimal. Ticket resolved.";
    }

    if (urgencyScore >= 80) {
        return "Critical. Immediate attention required.";
    }
    if (urgencyScore >= 55) {
        return "High urgency. Prioritize resolution.";
    }
    if (urgencyScore >= 30) {
        return "Moderate. Schedule for attention.";
    }
    return "Low urgency. Address when capacity allows.";
}

export const getTicketUrgency = (id: number): TicketUrgency | undefined => {
    const ticket: Ticket | undefined = getTicketById(id);
    if (!ticket) {
        return undefined;
    }

    const ticketAge: number = calculateTicketAgeDays(ticket.createdAt);

    const urgencyScore: number =
        ticket.status === "resolved"
            ? 0
            : BASE_SCORES[ticket.priority] + ticketAge * AGE_MULTIPLIER;

    return {
        id: ticket.id,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
        ticketAge,
        urgencyScore,
        urgencyLevel: getUrgencyLevel(ticket.status, urgencyScore),
    };
};

