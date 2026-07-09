import { defineConfig, loadEnv, type PluginOption, type UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const createPublicSiteUrlPlugin = (publicSiteUrl: string): PluginOption => ({
  name: "public-site-url-html",
  transformIndexHtml(html) {
    return html.replaceAll("__PUBLIC_SITE_URL__", publicSiteUrl);
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicSiteUrl = (env.VITE_PUBLIC_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

  const config = {
    plugins: [createPublicSiteUrlPlugin(publicSiteUrl), react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@app": path.resolve(__dirname, "src/app"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@widgets": path.resolve(__dirname, "src/widgets"),
        "@features": path.resolve(__dirname, "src/features"),
        "@entities": path.resolve(__dirname, "src/entities"),
        "@shared": path.resolve(__dirname, "src/shared"),
      },
    },
  } satisfies UserConfig;

  return config;
});
