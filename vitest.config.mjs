import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "lib/**/*.{ts,tsx}",
        "components/suporte/**/*.{ts,tsx}",
      ],
      exclude: [
        "node_modules/**",
        ".next/**",
        "prisma/**",
        "openspec/**",
        "scratch/**",
        "**/*.d.ts",
        "lib/db/seed.ts",
        "lib/data.ts",
        "lib/types.ts",
        "tests/**",
      ],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
