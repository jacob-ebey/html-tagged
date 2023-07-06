import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";

await emptyDir("./npm");

const {
  dependencies: _,
  devDependencies: __,
  ...pkg
} = JSON.parse(Deno.readTextFileSync("package.json").trim());

await build({
  entryPoints: [
    "./mod.ts",
    {
      name: "./server",
      path: "./server.ts",
    },
  ],
  outDir: "./npm",
  importMap: "deno.json",
  test: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  // package.json properties
  package: pkg,
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
