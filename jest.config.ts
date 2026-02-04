/**
 * Jest configuration (TypeScript).
 *
 * This project is CommonJS (`package.json` has `"type": "commonjs"`).
 * We export with `export =` (CommonJS style) so Jest can `require()` this config.
 */

import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/types/**/*.ts"],
};

export = config;

