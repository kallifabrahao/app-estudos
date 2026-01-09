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
      registerType: "autoUpdate",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Memora",
        short_name: "memora",
        description: "Aplicativo para estudo e memorização",
        theme_color: "#ffffff",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
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
