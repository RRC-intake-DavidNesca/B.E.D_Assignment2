/**
 * Unit tests for TicketService urgency calculation.
 */

import { TicketService } from "../src/api/v1/services/ticketService";
import type { Ticket, TicketPriority } from "../src/api/v1/services/ticketTypes";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

describe("TicketService.calculateTicketUrgency", (): void => {
    const fixedNow: number = new Date("2025-01-15T10:00:00.000Z").getTime();
    let nowSpy: jest.SpyInstance<number, []>;

    beforeEach((): void => {
        nowSpy = jest.spyOn(Date, "now").mockReturnValue(fixedNow);
    });

    afterEach((): void => {
        nowSpy.mockRestore();
    });

    function makeTicket(
        priority: TicketPriority,
        status: Ticket["status"],
        daysAgo: number
    ): Ticket {
        return {
            id: 1,
            title: "Sample ticket",
            description: "For urgency tests",
            priority,
            status,
            createdAt: new Date(fixedNow - daysAgo * MS_PER_DAY).toISOString(),
        };
    }

    it("returns base score and low urgency for a new low-priority ticket", (): void => {
        const ticket: Ticket = makeTicket("low", "open", 0);

        const result = TicketService.calculateTicketUrgency(ticket);

        expect(result.ticketAge).toBe(0);
        expect(result.urgencyScore).toBe(10); // base 10, no age yet
        expect(result.urgencyLevel).toBe("Low urgency. Address when capacity allows.");
    });

    it("increases urgency score with ticket age and priority", (): void => {
        const ticket: Ticket = makeTicket("medium", "open", 4); // age 4 days

        const result = TicketService.calculateTicketUrgency(ticket);

        // base 20 + 4 * 5 = 40
        expect(result.ticketAge).toBe(4);
        expect(result.urgencyScore).toBe(40);
        expect(result.urgencyLevel).toBe("Moderate. Schedule for attention.");
    });

    it("returns critical urgency for high score tickets", (): void => {
        const ticket: Ticket = makeTicket("critical", "open", 7); // 50 + 7 * 5 = 85

        const result = TicketService.calculateTicketUrgency(ticket);

        expect(result.ticketAge).toBe(7);
        expect(result.urgencyScore).toBe(85);
        expect(result.urgencyLevel).toBe("Critical. Immediate attention required.");
    });

    it("returns zero score and minimal urgency for resolved tickets", (): void => {
        const ticket: Ticket = makeTicket("high", "resolved", 10);

        const result = TicketService.calculateTicketUrgency(ticket);

        expect(result.ticketAge).toBe(10);
        expect(result.urgencyScore).toBe(0);
        expect(result.urgencyLevel).toBe("Minimal. Ticket resolved.");
    });
});

