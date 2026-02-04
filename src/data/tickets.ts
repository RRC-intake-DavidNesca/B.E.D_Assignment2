import type { Ticket } from "../api/v1/services/ticketTypes";

/**
 * Seed ticket data for the in-memory ticket store.
 * Uses dynamic dates based on the current date, matching the course note
 * about calculating dates instead of reusing the static sample timestamps.
 */

const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

function isoDaysAgo(daysAgo: number): string {
    return new Date(Date.now() - daysAgo * MS_PER_DAY).toISOString();
}

export const SEED_TICKETS: Ticket[] = [
    {
        id: 1,
        title: "Update footer copyright year",
        description: "Footer still shows 2024",
        priority: "low",
        status: "open",
        createdAt: isoDaysAgo(3),
    },
    {
        id: 2,
        title: "Profile picture upload slow",
        description: "Upload takes 30+ seconds",
        priority: "medium",
        status: "open",
        createdAt: isoDaysAgo(2),
    },
    {
        id: 3,
        title: "Dashboard loading slowly",
        description: "Dashboard takes 10+ seconds to load",
        priority: "medium",
        status: "open",
        createdAt: isoDaysAgo(6),
    },
    {
        id: 4,
        title: "Password reset email delayed",
        description: "Reset emails taking over 30 minutes",
        priority: "high",
        status: "open",
        createdAt: isoDaysAgo(5),
    },
    {
        id: 5,
        title: "Export to PDF not working",
        description: "PDF export fails silently",
        priority: "high",
        status: "open",
        createdAt: isoDaysAgo(9),
    },
    {
        id: 6,
        title: "Login page not loading",
        description: "Users report blank screen on login",
        priority: "critical",
        status: "open",
        createdAt: isoDaysAgo(6),
    },
    {
        id: 7,
        title: "Dark mode toggle broken",
        description: "Dark mode doesn't persist after refresh",
        priority: "medium",
        status: "resolved",
        createdAt: isoDaysAgo(10),
    },
];
