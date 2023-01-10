import * as fs from "node:fs";
import * as path from "node:path";
import { html, renderToString } from "html-tagged";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const bunreadme = fs.readFileSync(
  path.join(__dirname, "bun-readme.html"),
  "utf8"
);

const runs = 100;
let last;
performance.mark("start");
for (let i = 0; i < runs; i++) {
  last = renderToString(html([bunreadme]), {
    elements: {
      "custom-element": () => html`<div><slot></slot></div>`,
    },
  });
}
performance.mark("end");
console.log(
  "html-tagged ",
  (
    (1000 * runs) /
    performance.measure("start to end", "start", "end").duration
  ).toFixed(0),
  "ops/second"
);
