/**
 * ticket store and business logic for CRUD and urgency calculation.
 */

import { SEED_TICKETS } from "../../../data/tickets";
import type {
    CreateTicketBody,
    Ticket,
    TicketPriority,
    TicketUrgencyResult,
    UpdateTicketBody,
} from "./ticketTypes";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const BASE_URGENCY_SCORE: Record<TicketPriority, number> = {
    critical: 50,
    high: 30,
    medium: 20,
    low: 10,
};

function calculateTicketAgeInDays(createdAtIso: string): number {
    const createdAtMs = new Date(createdAtIso).getTime();
    const ageMs = Date.now() - createdAtMs;

    if (Number.isNaN(createdAtMs) || ageMs < 0) {
        return 0;
    }

    return Math.floor(ageMs / MS_PER_DAY);
}

function getUrgencyLevelMessage(score: number): string {
    if (score >= 80) {
        return "Critical. Immediate attention required.";
    }

    if (score >= 51) {
        return "High urgency. Prioritize resolution.";
    }

    if (score >= 30) {
        return "Moderate. Schedule for attention.";
    }

    return "Low urgency. Address when capacity allows.";
}

export class TicketService {
    private static tickets: Ticket[] = [...SEED_TICKETS];

    private static nextId: number =
        TicketService.tickets.reduce((maxId: number, t: Ticket): number => {
            return t.id > maxId ? t.id : maxId;
        }, 0) + 1;

    /**
     * Resets the in-memory store back to the original seed data.
     * Useful for automated tests to keep data consistent between test cases.
     */
    public static resetStore(): void {
        TicketService.tickets = [...SEED_TICKETS];
        TicketService.nextId =
            TicketService.tickets.reduce((maxId: number, t: Ticket): number => {
                return t.id > maxId ? t.id : maxId;
            }, 0) + 1;
    }

    public static getAllTickets(): Ticket[] {
        return [...TicketService.tickets];
    }

    public static getTicketById(id: number): Ticket | undefined {
        return TicketService.tickets.find((t: Ticket): boolean => t.id === id);
    }

    public static createTicket(body: CreateTicketBody): Ticket {
        const newTicket: Ticket = {
            id: TicketService.nextId,
            title: body.title,
            description: body.description,
            priority: body.priority,
            status: "open",
            createdAt: new Date().toISOString(),
        };

        TicketService.nextId += 1;
        TicketService.tickets.push(newTicket);

        return newTicket;
    }

    public static updateTicketById(
        id: number,
        updates: UpdateTicketBody
    ): Ticket | undefined {
        const index = TicketService.tickets.findIndex(
            (t: Ticket): boolean => t.id === id
        );

        if (index === -1) {
            return undefined;
        }

        const current = TicketService.tickets[index];

        const updated: Ticket = {
            ...current,
            ...updates,
        };

        TicketService.tickets[index] = updated;
        return updated;
    }

    public static deleteTicketById(id: number): boolean {
        const originalLength = TicketService.tickets.length;

        TicketService.tickets = TicketService.tickets.filter(
            (t: Ticket): boolean => t.id !== id
        );

        return TicketService.tickets.length !== originalLength;
    }

    public static getTicketUrgencyById(id: number): TicketUrgencyResult | undefined {
        const ticket = TicketService.getTicketById(id);
        if (!ticket) {
            return undefined;
        }

        return TicketService.calculateTicketUrgency(ticket);
    }

    public static calculateTicketUrgency(ticket: Ticket): TicketUrgencyResult {
        const ticketAge = calculateTicketAgeInDays(ticket.createdAt);

        if (ticket.status === "resolved") {
            return {
                id: ticket.id,
                title: ticket.title,
                priority: ticket.priority,
                status: ticket.status,
                createdAt: ticket.createdAt,
                ticketAge,
                urgencyScore: 0,
                urgencyLevel: "Minimal. Ticket resolved.",
            };
        }

        const baseScore = BASE_URGENCY_SCORE[ticket.priority];
        const urgencyScore = baseScore + ticketAge * 5;
        const urgencyLevel = getUrgencyLevelMessage(urgencyScore);

        return {
            id: ticket.id,
            title: ticket.title,
            priority: ticket.priority,
            status: ticket.status,
            createdAt: ticket.createdAt,
            ticketAge,
            urgencyScore,
            urgencyLevel,
        };
    }
}

// Convenience exports for function-style service usage in controllers/tests
export type TicketUrgency = TicketUrgencyResult;

export const getAllTickets = (): Ticket[] => {
    return TicketService.getAllTickets();
};

export const getTicketUrgency = (id: number): TicketUrgency | undefined => {
    return TicketService.getTicketUrgencyById(id);
};
