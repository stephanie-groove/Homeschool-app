import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Three pages: the landing page at /, the app at /app/ and the Bug Lab science page at /science/.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        app: resolve(__dirname, "app/index.html"),
        science: resolve(__dirname, "science/index.html"),
      },
    },
  },
});
