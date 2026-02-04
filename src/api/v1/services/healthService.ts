/**
 * Service responsible for building the health check payload.
 */

import packageJson from "../../../../package.json";

export interface HealthResponse {
    status: "OK";
    uptime: number;
    timestamp: string;
    version: string;
}

export class HealthService {
    public static getHealthStatus(): HealthResponse {
        return {
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            version: packageJson.version,
        };
    }
}
