import { Request, Response } from "express";
import { getTicketById, getAllTickets } from "../src/api/v1/controllers/ticketController";
import * as ticketService from "../src/api/v1/services/ticketService";

jest.mock("../src/api/v1/services/ticketService");

const mockGetTicketById = ticketService.getTicketById as jest.MockedFunction<
    typeof ticketService.getTicketById
>;
const mockGetAllTickets = ticketService.getAllTickets as jest.MockedFunction<
    typeof ticketService.getAllTickets
>;

function mockRequest(overrides: Partial<Request> = {}): Request {
    return { params: {}, body: {}, ...overrides } as Request;
}

function mockResponse(): Response {
    const res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    return res;
}

describe("ticketController (unit)", (): void => {
    beforeEach((): void => {
        jest.clearAllMocks();
    });

    describe("getTicketById", (): void => {
        it("returns 404 when service returns undefined", (): void => {
            mockGetTicketById.mockReturnValue(undefined);
            const req = mockRequest({ params: { id: "999" } });
            const res = mockResponse();

            getTicketById(req, res);

            expect(mockGetTicketById).toHaveBeenCalledWith(999);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Ticket not found" });
        });

        it("returns 200 and ticket data when service returns a ticket", (): void => {
            const ticket = {
                id: 1,
                title: "Test",
                description: "Desc",
                priority: "high" as const,
                status: "open" as const,
                createdAt: "2025-01-01T00:00:00.000Z",
            };
            mockGetTicketById.mockReturnValue(ticket);
            const req = mockRequest({ params: { id: "1" } });
            const res = mockResponse();

            getTicketById(req, res);

            expect(mockGetTicketById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Ticket retrieved",
                data: ticket,
            });
        });
    });

    describe("getAllTickets", (): void => {
        it("returns 200 with count and data when service returns tickets", (): void => {
            const tickets = [
                {
                    id: 1,
                    title: "A",
                    description: "D",
                    priority: "low" as const,
                    status: "open" as const,
                    createdAt: "2025-01-01T00:00:00.000Z",
                },
            ];
            mockGetAllTickets.mockReturnValue(tickets);
            const req = mockRequest();
            const res = mockResponse();

            getAllTickets(req, res);

            expect(mockGetAllTickets).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Tickets retrieved",
                count: 1,
                data: tickets,
            });
        });
    });
});
