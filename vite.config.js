import { defineConfig } from "vite";

export default defineConfig(({ command }) => {
  const base = command === "serve" ? "/" : "/kameka/";

  return {
    base,
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: false,
    },
    server: {
      port: 3000,
      open: true,
    },
  };
});
