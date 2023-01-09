import * as assert from "node:assert";
import { describe, it } from "node:test";

import { html } from "./html.js";

describe("html", () => {
  it("should return an object with an __html property", () => {
    const result = html`<div></div>`;
    assert.strictEqual(result.__html, "<div></div>");
  });

  describe("values", () => {
    it("should allow string", () => {
      const result = html`<div>${"a"}</div>`;
      assert.strictEqual(result.__html, "<div>a</div>");
    });

    it("should allow integer", () => {
      const result = html`<div>${1}</div>`;
      assert.strictEqual(result.__html, "<div>1</div>");
    });

    it("should allow float", () => {
      const result = html`<div>${0.999999999}</div>`;
      assert.strictEqual(result.__html, "<div>0.999999999</div>");
    });

    it("should allow true", () => {
      const result = html`<div>${true}</div>`;
      assert.strictEqual(result.__html, "<div>true</div>");
    });

    it("should not print false", () => {
      const result = html`<div>${false}</div>`;
      assert.strictEqual(result.__html, "<div></div>");
    });

    it("should not print null", () => {
      const result = html`<div>${null}</div>`;
      assert.strictEqual(result.__html, "<div></div>");
    });

    it("should not print undefined", () => {
      const result = html`<div>${undefined}</div>`;
      assert.strictEqual(result.__html, "<div></div>");
    });

    it("should allow HTMLNode", () => {
      const result = html`<div>${html`<span></span>`}</div>`;
      assert.strictEqual(result.__html, "<div><span></span></div>");
    });
  });

  describe("custom-elements", () => {
    it("are found and parsed for expansion during render", () => {
      const result = html`<div>
        <custom-element name="value">a</custom-element>
      </div>`;
      assert.strictEqual(
        result.__html,
        '<div>\n        <custom-element name="value">a</custom-element>\n      </div>'
      );
      assert.deepStrictEqual(result.__chunks, [
        "<div>\n        ",
        { tagName: "custom-element", attrs: 'name="value"' },
        "a",
        { tagName: "custom-element", closeTag: true },
        "\n      </div>",
      ]);
    });

    it("nested are found and parsed for expansion during render", () => {
      const result = html`<div>
        <custom-element-a name="value">
          a
          <custom-element-b name="value">b</custom-element-b>
        </custom-element-a>
      </div>`;
      assert.strictEqual(
        result.__html,
        '<div>\n        <custom-element-a name="value">\n          a\n          <custom-element-b name="value">b</custom-element-b>\n        </custom-element-a>\n      </div>'
      );
      assert.deepStrictEqual(result.__chunks, [
        "<div>\n        ",
        { tagName: "custom-element-a", attrs: 'name="value"' },
        "\n          a\n          ",
        { tagName: "custom-element-b", attrs: 'name="value"' },
        "b",
        { tagName: "custom-element-b", closeTag: true },
        "\n        ",
        { tagName: "custom-element-a", closeTag: true },
        "\n      </div>",
      ]);
    });

    it("nested are found in nested HTMLNode", () => {
      const result = html`<div>
        <custom-element-a name="value">
          a ${html`<custom-element-b name="value">b</custom-element-b>`}
        </custom-element-a>
      </div>`;
      assert.strictEqual(
        result.__html,
        '<div>\n        <custom-element-a name="value">\n          a <custom-element-b name="value">b</custom-element-b>\n        </custom-element-a>\n      </div>'
      );
      assert.deepStrictEqual(result.__chunks, [
        "<div>\n        ",
        { tagName: "custom-element-a", attrs: 'name="value"' },
        "\n          a ",
        { tagName: "custom-element-b", attrs: 'name="value"' },
        "b",
        { tagName: "custom-element-b", closeTag: true },
        "\n        ",
        { tagName: "custom-element-a", closeTag: true },
        "\n      </div>",
      ]);
    });
  });
});
