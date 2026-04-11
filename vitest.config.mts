import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom", // Simula um navegador no terminal
    globals: true, // Permite usar describe/test/expect sem importar toda hora
    setupFiles: ["./vitest.setup.ts"],
  },
});
