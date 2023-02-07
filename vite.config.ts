import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import dtsPlugin from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), dtsPlugin({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: resolve("./src/lib/createForm.ts"),
      name: "jotai-zod-form",
      fileName: "jotai-zod-form",
      formats: ["es", "cjs", "umd"],
    },
    rollupOptions: {
      external: ["react", "jotai", "zod", "react-dom"],
      output: {
        globals: {
          react: "React",
          jotai: "jotai",
          zod: "zod",
        },
      },
    },
  },
});
