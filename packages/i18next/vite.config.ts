import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { peerDependencies } from "./package.json";
import { builtinModules } from "node:module";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      formats: ["cjs", "es"],
      entry: {
        index: "src/index.ts",
      },
    },
    rollupOptions: {
      external: [
        ...Object.keys(peerDependencies),
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
    },
    target: "esnext",
  },
  plugins: [dts(), tsconfigPaths()],
});
