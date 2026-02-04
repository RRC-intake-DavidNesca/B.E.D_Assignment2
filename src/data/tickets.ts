/**
 * Types and data for support tickets.
 */

export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "resolved";

export interface Ticket {
    id: number;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    createdAt: string; // ISO 8601
}

/** Returns an ISO date string for a given number of days ago at 10:00:00.000Z */
function daysAgo(days: number): string {
    const d: Date = new Date();
    d.setUTCDate(d.getUTCDate() - days);
    d.setUTCHours(10, 0, 0, 0);
    return d.toISOString();
}

export const tickets: Ticket[] = [
    {
        id: 1,
        title: "Update footer copyright year",
        description: "Footer still shows 2024",
        priority: "low",
        status: "open",
        createdAt: daysAgo(3),
    },
    {
        id: 2,
        title: "Profile picture upload slow",
        description: "Upload takes 30+ seconds",
        priority: "medium",
        status: "open",
        createdAt: daysAgo(2),
    },
    {
        id: 3,
        title: "Dashboard loading slowly",
        description: "Dashboard takes 10+ seconds to load",
        priority: "medium",
        status: "open",
        createdAt: daysAgo(6),
    },
    {
        id: 4,
        title: "Password reset email delayed",
        description: "Reset emails taking over 30 minutes",
        priority: "high",
        status: "open",
        createdAt: daysAgo(5),
    },
    {
        id: 5,
        title: "Export to PDF not working",
        description: "PDF export fails silently",
        priority: "high",
        status: "open",
        createdAt: daysAgo(9),
    },
    {
        id: 6,
        title: "Login page not loading",
        description: "Users report blank screen on login",
        priority: "critical",
        status: "open",
        createdAt: daysAgo(6),
    },
    {
        id: 7,
        title: "Dark mode toggle broken",
        description: "Dark mode doesn't persist after refresh",
        priority: "medium",
        status: "resolved",
        createdAt: daysAgo(10),
    },
];
