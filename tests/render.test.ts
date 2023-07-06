import { assertSnapshot } from "snapshot";

import { html, value } from "../mod.ts";
import { renderToString } from "../server.ts";

Deno.test("should render a simple string", async (t) => {
  const result = renderToString(html`<div></div>`);
  await assertSnapshot(t, result);
});

Deno.test(
  "should render custom element without implementation to string",
  async (t) => {
    const result = renderToString(
      html`<div><custom-element></custom-element></div>`,
    );
    await assertSnapshot(t, result);
  },
);

Deno.test(
  "should render nested custom elements without implementation to string",
  async (t) => {
    const result = renderToString(
      html`<div>
        <custom-element-a>
          a
          <custom-element-b>b</custom-element-b>
        </custom-element-a>
      </div>`,
    );
    await assertSnapshot(t, result);
  },
);

Deno.test("should expand custom element with implementation", async (t) => {
  const result = renderToString(
    html`<div><custom-element></custom-element></div>`,
    {
      elements: {
        "custom-element": () => html`<div>custom element</div>`,
      },
    },
  );
  await assertSnapshot(t, result);
});

Deno.test("should expand custom element with slot", async (t) => {
  const result = renderToString(
    html`<div>
      <custom-element><span>a</span></custom-element>
    </div>`,
    {
      elements: {
        "custom-element": () => html`<div>custom element <slot></slot></div>`,
      },
    },
  );
  await assertSnapshot(t, result);
});

Deno.test("should pass attrs to custom-element", async (t) => {
  const result = renderToString(
    html`<div>
      <custom-element name="test"><span>a</span></custom-element>
    </div>`,
    {
      elements: {
        "custom-element": ({ attrs }) =>
          html`<div>custom element ${value(attrs.name)} <slot></slot></div>`,
      },
    },
  );
  await assertSnapshot(t, result);
});

Deno.test("should expand nested custom element with slot", async (t) => {
  const result = renderToString(
    html`<div>
      <custom-element>
        <span>a</span>
        <custom-element>
          <span>b</span>
        </custom-element>
      </custom-element>
    </div>`,
    {
      elements: {
        "custom-element": () => html`<div>custom element <slot></slot></div>`,
      },
    },
  );
  await assertSnapshot(t, result);
});

// TODO: Allow expansion of custom elements within a custom elements template.
// it.skip("should expand custom element in another custom element implementation", async (t) => {
//   const result = renderToString(
//     html`<div>
//       <custom-element-a><span>outer</span></custom-element-a>
//     </div>`,
//     {
//       elements: {
//         "custom-element-a": () =>
//           html`a<custom-element-b><slot></slot></custom-element-b>`,
//         "custom-element-b": () => html`<div>b <slot></slot></div>`,
//       },
//     }
//   );
//   inlineSnapshot(
//     result,
//     "<div>\n        <custom-element-a>a<custom-element-b><div>b <span>outer</span></div></custom-element-b></custom-element-a>\n      </div>"
//   );
// });

Deno.test("should render style in place if no body in tree", async (t) => {
  const result = renderToString(
    html`<p>a</p>
      <style>
        html {
          color: green;
        }
      </style>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should lift styles to head", async (t) => {
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            <style>
              html {
                color: green;
              }
            </style>
            <script>
              console.log("hello");
            </script>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should lift styles to head for sub HTMLNode", async (t) => {
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            ${html`<style>
              html {
                color: green;
              }
            </style>`}
            <script>
              console.log("hello");
            </script>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should lift styles to head and dedupe", async (t) => {
  const sub = html`<style>
    html {
      color: green;
    }
  </style>`;
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            ${sub} ${sub}
            <script>
              console.log("hello");
            </script>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should render scripts in place if no body in tree", async (t) => {
  const result = renderToString(
    html`<p>a</p>
      <script>
        console.log("hello");
      </script>`,
  );
  await assertSnapshot(t, result);
});

Deno.test(
  "should render nested scripts in place if no body in tree",
  async (t) => {
    const result = renderToString(
      html`<script>
          console.log("a");
        </script>
        ${html`<script>
          console.log("b");
        </script>`}`,
    );
    await assertSnapshot(t, result);
  },
);

Deno.test("should put scripts at end of body", async (t) => {
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            <style>
              html {
                color: green;
              }
            </style>
            <script>
              console.log("hello");
            </script>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should put scripts at end of body for sub HTMLNode", async (t) => {
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            ${html`<script>
              console.log("hello");
            </script>`}
            <style>
              html {
                color: green;
              }
            </style>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});

Deno.test("should put scripts at end of body and dedupe", async (t) => {
  const sub = html`<script>
    console.log("hello");
  </script>`;
  const result = renderToString(
    html`<!DOCTYPE html>
      <html>
        <head></head>
        <body>
          <div>
            ${sub} ${sub}
            <style>
              html {
                color: green;
              }
            </style>
          </div>
        </body>
      </html>`,
  );
  await assertSnapshot(t, result);
});
