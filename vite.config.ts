import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { qrcode } from "vite-plugin-qrcode";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), qrcode()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: [
      { find: "@/", replacement: "/src/" },
      { find: "custom/", replacement: "/src/hooks/custom/" },
      { find: "reducers/", replacement: "/src/store/reducers/" },
    ],
  },
});
