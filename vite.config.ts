import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { ClientSideLayout } from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";
import path from "path";

const isDev =
  process.env.NODE_ENV === "development" || process.env.VITE_DEV === "true";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    open: true,
  },

  plugins: [
    vue(),
    isDev && vueDevTools(),
    Pages({
      dirs: "src/pages",
      extensions: ["vue"],
      exclude: isDev
        ? ["**/__errors/*.vue"]
        : ["**/__dev/*.vue", "**/__errors/*.vue"],
    }),
    ClientSideLayout({
      layoutDir: "src/layouts",
      defaultLayout: "Default",
      importMode: "sync",
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Memora",
        short_name: "memora",
        description: "Aplicativo para estudo e memorização",
        theme_color: "#020617",
        icons: [
          {
            src: "memoraFundo.jpg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => {
              const isApiRequest = /\/api\/.*\/*.json/.test(url.pathname);
              const isTargetMethod = ["POST", "PUT", "DELETE"].includes(
                request.method
              );
              return isApiRequest && isTargetMethod;
            },
            handler: "NetworkOnly",
            options: {
              backgroundSync: {
                name: "myQueueName",
                options: {
                  maxRetentionTime: 24 * 60, // 24 horas
                },
              },
            },
          },
        ],
      },

      devOptions: {
        navigateFallback: "index.html",
        suppressWarnings: true,
        enabled: true,
        type: "module",
      },
    }),
  ],
});
