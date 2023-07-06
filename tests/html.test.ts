import { assertSnapshot } from "snapshot";

import { html } from "../mod.ts";

Deno.test("should return an object with an __html property", async (t) => {
  const result = html`<div></div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow string", async (t) => {
  const result = html`<div>${"a"}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow integer", async (t) => {
  const result = html`<div>${1}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow float", async (t) => {
  const result = html`<div>${0.999999999}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow true", async (t) => {
  const result = html`<div>${true}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should not print false", async (t) => {
  const result = html`<div>${false}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should not print null", async (t) => {
  const result = html`<div>${null}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should not print undefined", async (t) => {
  const result = html`<div>${undefined}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow HTMLNode", async (t) => {
  const result = html`<div>${html`<span></span>`}</div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test("should allow array of mixed values", async (t) => {
  const result = html`<div>
    ${["a", 1, true, false, null, undefined, html`<span>2</span>`]}
  </div>`;
  await assertSnapshot(t, result[1]);
});

Deno.test(
  "scripts are found and parsed for bubbling during render",
  async (t) => {
    const result = html`<script>
      console.log("Hello, World!");
    </script>`;
    await assertSnapshot(t, result[2]);
  },
);

Deno.test(
  "nested scripts are found and parsed for bubbling during render",
  async (t) => {
    const result = html`<script>
        console.log("a");
      </script>
      ${html`<script>
        console.log("b");
      </script>`}`;

    await assertSnapshot(t, result[2]);
  },
);

Deno.test(
  "styles are found and parsed for bubbling during render",
  async (t) => {
    const result = html`<style>
      body {
        background-color: red;
      }
    </style>`;
    await assertSnapshot(t, result[2]);
  },
);

Deno.test(
  "nested styles are found and parsed for bubbling during render",
  async (t) => {
    const result = html`<style>
        body {
          background-color: red;
        }
      </style>
      ${html`<style>
        body {
          color: green;
        }
      </style>`}`;
    await assertSnapshot(t, result[2]);
  },
);

Deno.test(
  "custom-elements are found and parsed for expansion during render",
  async (t) => {
    const result = html`<div>
      <custom-element name="value">a</custom-element>
    </div>`;
    await assertSnapshot(t, result[1]);
    await assertSnapshot(t, result[2]);
  },
);

Deno.test(
  "nested custom-elements are found and parsed for expansion during render",
  async (t) => {
    const result = html`<div>
      <custom-element-a name="value">
        a
        <custom-element-b name="value">b</custom-element-b>
      </custom-element-a>
    </div>`;
    await assertSnapshot(t, result[1]);
    await assertSnapshot(t, result[2]);
  },
);

Deno.test("nested custom-elements are found in nested HTMLNode", async (t) => {
  const result = html`<div>
    <custom-element-a name="value">
      a ${html`<custom-element-b name="value">b</custom-element-b>`}
    </custom-element-a>
  </div>`;
  await assertSnapshot(t, result[1]);
  await assertSnapshot(t, result[2]);
});
