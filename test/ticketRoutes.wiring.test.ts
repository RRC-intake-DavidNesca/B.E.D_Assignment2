import request from "supertest";
import express from "express";

import ticketRoutes from "../src/api/v1/routes/ticketRoutes";
import * as ticketController from "../src/api/v1/controllers/ticketController";

jest.mock("../src/api/v1/controllers/ticketController");

const app = express();
app.use(express.json());
app.use("/api/v1/tickets", ticketRoutes);

describe("Ticket routes (wiring)", (): void => {
    afterEach((): void => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/tickets", (): void => {
        it("should call getAllTickets controller", async (): Promise<void> => {
            (ticketController.getAllTickets as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(200).json({})
            );

            await request(app).get("/api/v1/tickets");

            expect(ticketController.getAllTickets).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/tickets/:id", (): void => {
        it("should call getTicketById controller with the right id", async (): Promise<void> => {
            (ticketController.getTicketById as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(200).json({})
            );

            await request(app).get("/api/v1/tickets/1");

            expect(ticketController.getTicketById).toHaveBeenCalled();
            const reqArg = (ticketController.getTicketById as jest.Mock).mock.calls[0][0];
            expect(reqArg.params.id).toBe("1");
        });
    });

    describe("POST /api/v1/tickets", (): void => {
        it("should call createTicket controller", async (): Promise<void> => {
            (ticketController.createTicket as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(201).json({})
            );

            await request(app).post("/api/v1/tickets").send({
                title: "Test Ticket",
                description: "Test description",
                priority: "low",
            });

            expect(ticketController.createTicket).toHaveBeenCalled();
            const reqArg = (ticketController.createTicket as jest.Mock).mock.calls[0][0];
            expect(reqArg.body).toMatchObject({
                title: "Test Ticket",
                description: "Test description",
                priority: "low",
            });
        });
    });

    describe("PUT /api/v1/tickets/:id", (): void => {
        it("should call updateTicket controller with the right id", async (): Promise<void> => {
            (ticketController.updateTicket as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(200).json({})
            );

            await request(app).put("/api/v1/tickets/1").send({
                title: "Updated Ticket",
                description: "Updated description",
                priority: "high",
                status: "resolved",
            });

            expect(ticketController.updateTicket).toHaveBeenCalled();
            const reqArg = (ticketController.updateTicket as jest.Mock).mock.calls[0][0];
            expect(reqArg.params.id).toBe("1");
            expect(reqArg.body).toMatchObject({
                title: "Updated Ticket",
                description: "Updated description",
                priority: "high",
                status: "resolved",
            });
        });
    });

    describe("DELETE /api/v1/tickets/:id", (): void => {
        it("should call deleteTicket controller with the right id", async (): Promise<void> => {
            (ticketController.deleteTicket as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(200).json({})
            );

            await request(app).delete("/api/v1/tickets/1");

            expect(ticketController.deleteTicket).toHaveBeenCalled();
            const reqArg = (ticketController.deleteTicket as jest.Mock).mock.calls[0][0];
            expect(reqArg.params.id).toBe("1");
        });
    });

    describe("GET /api/v1/tickets/:id/urgency", (): void => {
        it("should call getTicketUrgency controller with the right id", async (): Promise<void> => {
            (ticketController.getTicketUrgency as jest.Mock).mockImplementation(
                (_req: unknown, res: { status: (n: number) => { json: (o: object) => void } }) =>
                    res.status(200).json({})
            );

            await request(app).get("/api/v1/tickets/1/urgency");

            expect(ticketController.getTicketUrgency).toHaveBeenCalled();
            const reqArg = (ticketController.getTicketUrgency as jest.Mock).mock.calls[0][0];
            expect(reqArg.params.id).toBe("1");
        });
    });
});
