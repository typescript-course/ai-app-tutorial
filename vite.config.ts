/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./setupTests.ts",
    // https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/vite.config.ts#L14-L16
    css: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});
