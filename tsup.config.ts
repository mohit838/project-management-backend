import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  outDir: "dist",
  format: ["esm"],
  sourcemap: true,
  clean: true,
  target: "es2022",
  platform: "node",
  splitting: false,
  dts: false
});
