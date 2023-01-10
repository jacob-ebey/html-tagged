import enhance from "@enhance/ssr";

const html = enhance({
  elements: {
    "custom-element": () => html`<div><slot></slot></div>`,
  },
});

let last;
performance.mark("start");
for (let i = 0; i < 100000; i++) {
  last = html`
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
  `;
}
performance.mark("end");
console.log(
  "@enhance/ssr",
  (
    (1000 * 100000) /
    performance.measure("start to end", "start", "end").duration
  ).toFixed(0),
  "ops/second"
);
