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

describe("Ticket routes - POST /api/v1/tickets", (): void => {
    beforeEach((): void => {
        TicketService.resetStore();
    });

    it("creates a ticket when required fields are valid", async (): Promise<void> => {
        const newTicket = {
            title: "New ticket from test",
            description: "Created via POST /api/v1/tickets",
            priority: "high",
        };

        const response: Response = await request(app)
            .post("/api/v1/tickets")
            .send(newTicket);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Ticket created");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toMatchObject(newTicket);
        expect(typeof response.body.data.id).toBe("number");
        expect(typeof response.body.data.createdAt).toBe("string");
    });

    it("returns 400 when title is missing", async (): Promise<void> => {
        const response: Response = await request(app).post("/api/v1/tickets").send({
            description: "Missing title field",
            priority: "high",
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Missing required field: title");
    });

    it("returns 400 when priority is invalid", async (): Promise<void> => {
        const response: Response = await request(app).post("/api/v1/tickets").send({
            title: "Invalid priority ticket",
            description: "Should fail validation",
            priority: "urgent", // not one of critical|high|medium|low
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "message",
            "Invalid priority. Must be one of: critical, high, medium, low"
        );
    });
});

describe("Ticket routes - PUT /api/v1/tickets/:id", (): void => {
    beforeEach((): void => {
        TicketService.resetStore();
    });

    it("updates ticket priority and status when values are valid", async (): Promise<void> => {
        const response: Response = await request(app)
            .put("/api/v1/tickets/1")
            .send({
                priority: "high",
                status: "in-progress",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Ticket updated successfully");
        expect(response.body).toHaveProperty("data");
        expect(response.body.data).toMatchObject({
            id: 1,
            priority: "high",
            status: "in-progress",
        });
    });

    it("returns 400 when status is invalid", async (): Promise<void> => {
        const response: Response = await request(app)
            .put("/api/v1/tickets/1")
            .send({
                status: "closed", // not one of open|in-progress|resolved
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty(
            "message",
            "Invalid status. Must be one of: open, in-progress, resolved"
        );
    });
});

describe("Ticket routes - DELETE /api/v1/tickets/:id", (): void => {
    beforeEach((): void => {
        TicketService.resetStore();
    });

    it("deletes an existing ticket and returns a success message", async (): Promise<void> => {
        const response: Response = await request(app).delete("/api/v1/tickets/1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Ticket deleted");

        // Confirm it is actually gone
        const getResponse: Response = await request(app).get("/api/v1/tickets/1");
        expect(getResponse.status).toBe(404);
    });

    it("returns 404 when the ticket does not exist", async (): Promise<void> => {
        const response: Response = await request(app).delete("/api/v1/tickets/999");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("message", "Ticket not found");
    });
});



