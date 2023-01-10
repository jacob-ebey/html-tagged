import * as assert from "node:assert";
import { describe, it } from "node:test";

import { html, renderToString } from "../lib/index.js";

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

  describe("styles", () => {
    it("should render style in place if no body in tree", () => {
      const result = renderToString(
        html`<p>a</p>
          <style>
            html {
              color: green;
            }
          </style>`
      );
      assert.strictEqual(
        result,
        "<p>a</p>\n          <style>\n            html {\n              color: green;\n            }\n          </style>"
      );
    });

    it("should lift styles to head", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n                  html {\n                    color: green;\n                  }\n                </style></head>\n            <body>\n              <div>\n                \n                \n              </div>\n            <script>\n                  console.log("hello");\n                </script></body>\n          </html>'
      );
    });

    it("should lift styles to head for sub HTMLNode", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n                  html {\n                    color: green;\n                  }\n                </style></head>\n            <body>\n              <div>\n                \n                \n              </div>\n            <script>\n                  console.log("hello");\n                </script></body>\n          </html>'
      );
    });

    it("should lift styles to head and dedupe", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n        html {\n          color: green;\n        }\n      </style></head>\n            <body>\n              <div>\n                 \n                \n              </div>\n            <script>\n                  console.log("hello");\n                </script></body>\n          </html>'
      );
    });
  });

  describe("scripts", () => {
    it("should render scripts in place if no body in tree", () => {
      const result = renderToString(
        html`<p>a</p>
          <script>
            console.log("hello");
          </script>`
      );
      assert.strictEqual(
        result,
        '<p>a</p>\n          <script>\n            console.log("hello");\n          </script>'
      );
    });

    it("should render nested scripts in place if no body in tree", () => {
      const result = renderToString(
        html`<script>
            console.log("a");
          </script>
          ${html`<script>
            console.log("b");
          </script>`}`
      );
      assert.strictEqual(
        result,
        '<script>\n            console.log("a");\n          </script>\n          <script>\n            console.log("b");\n          </script>'
      );
    });

    it("should put scripts at end of body", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n                  html {\n                    color: green;\n                  }\n                </style></head>\n            <body>\n              <div>\n                \n                \n              </div>\n            <script>\n                  console.log("hello");\n                </script></body>\n          </html>'
      );
    });

    it("should put scripts at end of body for sub HTMLNode", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n                  html {\n                    color: green;\n                  }\n                </style></head>\n            <body>\n              <div>\n                \n                \n              </div>\n            <script>\n                  console.log("hello");\n                </script></body>\n          </html>'
      );
    });

    it("should put scripts at end of body and dedupe", () => {
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
          </html>`
      );
      assert.strictEqual(
        result,
        '<!DOCTYPE html>\n          <html>\n            <head><style>\n                  html {\n                    color: green;\n                  }\n                </style></head>\n            <body>\n              <div>\n                 \n                \n              </div>\n            <script>\n        console.log("hello");\n      </script></body>\n          </html>'
      );
    });
  });
});
