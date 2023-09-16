import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
  },
  resolve: {
    alias: [
      { find: "src", replacement: "/src" },
      { find: "pages", replacement: "/src/pages" },
      { find: "components", replacement: "/src/components" },
    ],
  },
});
