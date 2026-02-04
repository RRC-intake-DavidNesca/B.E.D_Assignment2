/**
 * Integration tests for ticket routes under /api/v1/tickets.
 */

import request, { type Response } from "supertest";

import app from "../src/app";
import { TicketService } from "../src/api/v1/services/ticketService";

describe("Ticket routes - GET endpoints", (): void => {
    beforeEach((): void => {
        // Ensure each test starts from the same in-memory ticket data.
        TicketService.resetStore();
    });

    it("GET /api/v1/tickets returns all tickets with count and data", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/tickets");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Tickets retrieved");
        expect(typeof response.body.count).toBe("number");
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(response.body.count);
    });

    it("GET /api/v1/tickets/:id returns a single ticket when it exists", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/tickets/1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Ticket retrieved");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toHaveProperty("id", 1);
    });

    it("GET /api/v1/tickets/:id returns 404 when the ticket is not found", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/tickets/999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Ticket not found");
    });
});

