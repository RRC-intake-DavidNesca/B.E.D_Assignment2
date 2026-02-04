/**
 * Jest configuration for TypeScript tests using ts-jest.
 */

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: ["src/**/*.ts", "!src/server.ts", "!src/types/**/*.ts"],
};
