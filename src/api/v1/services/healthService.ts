/**
 * Builds the health check payload returned by GET /api/v1/health.
 */

import packageJson from "../../../../package.json";

export interface HealthResponse {
    status: "OK";
    uptime: number;
    timestamp: string;
    version: string;
}

export const getHealthInfo = (): HealthResponse => {
    return {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: packageJson.version,
    };
};
