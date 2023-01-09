import * as assert from "node:assert";
import { describe, it } from "node:test";

import { html } from "./html.js";
import { renderToString } from "./render.js";

describe("renderToString", () => {
  it("should render a simple string", () => {
    const result = renderToString(html`<div></div>`);
    assert.strictEqual(result, "<div></div>");
  });

  it("should render custom element without implementation to string", () => {
    const result = renderToString(
      html`<div><custom-element></custom-element></div>`
    );
    assert.strictEqual(result, "<div><custom-element></custom-element></div>");
  });

  it("should render nested custom elements without implementation to string", () => {
    const result = renderToString(
      html`<div>
        <custom-element-a>
          a
          <custom-element-b>b</custom-element-b>
        </custom-element-a>
      </div>`
    );
    console.log(JSON.stringify(result));
    assert.strictEqual(
      result,
      "<div>\n        <custom-element-a>\n          a\n          <custom-element-b>b</custom-element-b>\n        </custom-element-a>\n      </div>"
    );
  });

  it("should expand custom element with implementation", () => {
    const result = renderToString(
      html`<div><custom-element></custom-element></div>`,
      {
        elements: {
          "custom-element": () => html`<div>custom element</div>`,
        },
      }
    );
    assert.strictEqual(
      result,
      "<div><custom-element><div>custom element</div></custom-element></div>"
    );
  });

  it("should expand custom element with slot", () => {
    const result = renderToString(
      html`<div>
        <custom-element><span>a</span></custom-element>
      </div>`,
      {
        elements: {
          "custom-element": () => html`<div>custom element <slot></slot></div>`,
        },
      }
    );
    assert.strictEqual(
      result,
      "<div>\n        <custom-element><div>custom element <span>a</span></div></custom-element>\n      </div>"
    );
  });

  it("should expand nested custom element with slot", () => {
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
      }
    );
    assert.strictEqual(
      result,
      "<div>\n        <custom-element><div>custom element \n          <span>a</span>\n          <custom-element><div>custom element \n            <span>b</span>\n          </div></custom-element>\n        </div></custom-element>\n      </div>"
    );
  });

  // TODO: Allow expansion of custom elements within a custom elements template.
  it.skip("should expand custom element in another custom element implementation", () => {
    const result = renderToString(
      html`<div>
        <custom-element-a><span>outer</span></custom-element-a>
      </div>`,
      {
        elements: {
          "custom-element-a": () =>
            html`a<custom-element-b><slot></slot></custom-element-b>`,
          "custom-element-b": () => html`<div>b <slot></slot></div>`,
        },
      }
    );
    assert.strictEqual(
      result,
      "<div>\n        <custom-element-a>a<custom-element-b><div>b <span>outer</span></div></custom-element-b></custom-element-a>\n      </div>"
    );
  });
});
