import { html, renderToString } from "html-tagged";

let last;
performance.mark("start");
for (let i = 0; i < 100000; i++) {
  last = renderToString(
    html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>My App</title>
        </head>
        <body>
          <custom-element>
            <h1>Hello World</h1>
          </custom-element>
        </body>
      </html>
    `,
    {
      elements: {
        "custom-element": () => html`<div><slot></slot></div>`,
      },
    }
  );
}
performance.mark("end");
console.log(
  "html-tagged ",
  (
    (1000 * 100000) /
    performance.measure("start to end", "start", "end").duration
  ).toFixed(0),
  "ops/second"
);
