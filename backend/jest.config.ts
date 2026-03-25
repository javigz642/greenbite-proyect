import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/test/**/*.spec.ts", "**/test/**/*.e2e-spec.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/src", "<rootDir>/test"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"]
};

export default config;
