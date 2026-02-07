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

    if (score >= 50) {
        return "High urgency. Prioritize resolution.";
    }

    if (score >= 30) {
        return "Moderate. Schedule for attention.";
    }

    return "Low urgency. Address when capacity allows.";
}

let tickets: Ticket[] = [...SEED_TICKETS];

let nextId: number =
    tickets.reduce((maxId: number, t: Ticket): number => (t.id > maxId ? t.id : maxId), 0) + 1;

export function resetStore(): void {
    tickets = [...SEED_TICKETS];
    nextId =
        tickets.reduce((maxId: number, t: Ticket): number => (t.id > maxId ? t.id : maxId), 0) + 1;
}

export function getAllTickets(): Ticket[] {
    return [...tickets];
}

export function getTicketById(id: number): Ticket | undefined {
    return tickets.find((t: Ticket): boolean => t.id === id);
}

export function createTicket(body: CreateTicketBody): Ticket {
    const newTicket: Ticket = {
        id: nextId,
        title: body.title,
        description: body.description,
        priority: body.priority,
        status: "open",
        createdAt: new Date().toISOString(),
    };

    nextId += 1;
    tickets.push(newTicket);

    return newTicket;
}

export function updateTicketById(id: number, updates: UpdateTicketBody): Ticket | undefined {
    const index = tickets.findIndex((t: Ticket): boolean => t.id === id);

    if (index === -1) {
        return undefined;
    }

    const current = tickets[index];
    const updated: Ticket = { ...current, ...updates };
    tickets[index] = updated;
    return updated;
}

export function deleteTicketById(id: number): boolean {
    const originalLength = tickets.length;
    tickets = tickets.filter((t: Ticket): boolean => t.id !== id);
    return tickets.length !== originalLength;
}

export function getTicketUrgencyById(id: number): TicketUrgencyResult | undefined {
    const ticket = getTicketById(id);
    if (!ticket) {
        return undefined;
    }
    return calculateTicketUrgency(ticket);
}

export function calculateTicketUrgency(ticket: Ticket): TicketUrgencyResult {
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

export type TicketUrgency = TicketUrgencyResult;
