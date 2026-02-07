import packageJson from "../../../../package.json";

export interface HealthResponse {
    status: "OK";
    uptime: number;
    timestamp: string;
    version: string;
}

export function getHealthStatus(): HealthResponse {
    return {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: packageJson.version,
    };
}
