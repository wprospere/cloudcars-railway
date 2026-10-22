import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "client", "src"),
      "@shared": path.resolve(templateRoot, "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    // Dummy values so modules that read these at import time can load. Nothing connects to a real database.
    env: {
      DATABASE_URL: process.env.DATABASE_URL ?? "mysql://test:test@127.0.0.1:3306/test",
      JWT_SECRET: process.env.JWT_SECRET ?? "test-secret",
    },
    include: ["server/**/*.test.ts", "server/**/*.spec.ts"],
  },
});
