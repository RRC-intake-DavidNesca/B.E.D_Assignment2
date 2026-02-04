/**
 * Integration test for GET /api/v1/health.
 */

import request, { Response } from "supertest";
import app from "../src/app";
import packageJson from "../package.json";

interface HealthBody {
    status: "OK";
    uptime: number;
    timestamp: string;
    version: string;
}

describe("GET /api/v1/health", (): void => {
    it("returns status OK, uptime, timestamp, and version", async (): Promise<void> => {
        const response: Response = await request(app).get("/api/v1/health");

        expect(response.status).toBe(200);

        const body: HealthBody = response.body as HealthBody;

        expect(body.status).toBe("OK");
        expect(typeof body.uptime).toBe("number");
        expect(body.uptime).toBeGreaterThanOrEqual(0);

        const parsedTimestamp: Date = new Date(body.timestamp);
        expect(Number.isNaN(parsedTimestamp.getTime())).toBe(false);
        expect(parsedTimestamp.toISOString()).toBe(body.timestamp);

        expect(body.version).toBe(packageJson.version);
    });
});
