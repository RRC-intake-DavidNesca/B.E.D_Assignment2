/**
 * Ticket domain types used across services/controllers/routes.
 * Provides strong typing for ticket CRUD and urgency calculations.
 */

export const TICKET_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

export const TICKET_STATUSES = ["open", "in-progress", "resolved"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string; // ISO-8601 timestamp string
}

export type CreateTicketBody = Pick<Ticket, "title" | "description" | "priority">;

export type UpdateTicketBody = Partial<
    Pick<Ticket, "title" | "description" | "priority" | "status">
>;

/**
 * Shape returned by the ticket urgency endpoint.
 * Matches the demo-style payload (no description included).
 */
export interface TicketUrgencyResult {
    id: number;
    title: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string;
    ticketAge: number;
    urgencyScore: number;
    urgencyLevel: string;
}

