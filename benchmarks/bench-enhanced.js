import * as fs from "node:fs";
import * as path from "node:path";
import enhance from "@enhance/ssr";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const bunreadme = fs.readFileSync(
  path.join(__dirname, "bun-readme.html"),
  "utf8"
);

const html = enhance({
  elements: {
    "custom-element": () => html`<div><slot></slot></div>`,
  },
});

const runs = 100;
let last;
performance.mark("start");
for (let i = 0; i < runs; i++) {
  last = html([bunreadme]);
}
performance.mark("end");
console.log(
  "@enhance/ssr",
  (
    (1000 * runs) /
    performance.measure("start to end", "start", "end").duration
  ).toFixed(0),
  "ops/second"
);
