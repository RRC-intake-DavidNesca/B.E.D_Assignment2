/**
 * Purpose: Jest configuration for TypeScript tests using ts-jest.
 */

import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/types/**/*.ts"],
};

export default config;
