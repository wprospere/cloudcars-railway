import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },

    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    publicDir: path.resolve(import.meta.dirname, "client", "public"),

    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("/node_modules/react/") || id.includes("/node_modules/react-dom/")) {
              return "vendor-react";
            }
            if (
              id.includes("/node_modules/@tanstack/") ||
              id.includes("/node_modules/@trpc/") ||
              id.includes("/node_modules/superjson/")
            ) {
              return "vendor-query";
            }
            if (id.includes("/node_modules/lucide-react/")) {
              return "vendor-icons";
            }
          },
        },
      },
    },

    server: {
      host: true,
      port: 3000,
      fs: { strict: false },
    },
  };
});
