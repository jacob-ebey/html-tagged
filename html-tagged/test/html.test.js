import * as assert from "node:assert";
import { describe, it } from "node:test";

import { html } from "../lib/index.js";

import { inlineSnapshot } from "./assert.js";

describe("html", () => {
	it("should return an object with an __html property", () => {
		const result = html`<div></div>`;
		inlineSnapshot(result.__html, "<div></div>");
	});

	describe("values", () => {
		it("should allow string", () => {
			const result = html`<div>${"a"}</div>`;
			inlineSnapshot(result.__html, "<div>a</div>");
		});

		it("should allow integer", () => {
			const result = html`<div>${1}</div>`;
			inlineSnapshot(result.__html, "<div>1</div>");
		});

		it("should allow float", () => {
			const result = html`<div>${0.999999999}</div>`;
			inlineSnapshot(result.__html, "<div>0.999999999</div>");
		});

		it("should allow true", () => {
			const result = html`<div>${true}</div>`;
			inlineSnapshot(result.__html, "<div>true</div>");
		});

		it("should not print false", () => {
			const result = html`<div>${false}</div>`;
			inlineSnapshot(result.__html, "<div></div>");
		});

		it("should not print null", () => {
			const result = html`<div>${null}</div>`;
			inlineSnapshot(result.__html, "<div></div>");
		});

		it("should not print undefined", () => {
			const result = html`<div>${undefined}</div>`;
			inlineSnapshot(result.__html, "<div></div>");
		});

		it("should allow HTMLNode", () => {
			const result = html`<div>${html`<span></span>`}</div>`;
			inlineSnapshot(result.__html, "<div><span></span></div>");
		});

		it("should allow array of mixed values", () => {
			const result = html`<div>
				${["a", 1, true, false, null, undefined, html`<span>2</span>`]}
			</div>`;
			inlineSnapshot(result.__html, "<div>a1true<span>2</span></div>");
		});
	});

	describe("scripts", () => {
		it("are found and parsed for bubbling during render", () => {
			const result = html`<script>
				console.log("Hello, World!");
			</script>`;
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					{ tagName: "script" },
					'\n\t\t\t\tconsole.log("Hello, World!");\n\t\t\t',
					{ tagName: "script", closeTag: true },
				])
			);
		});

		it("nested are found and parsed for bubbling during render", () => {
			const result = html`<script>
					console.log("a");
				</script>
				${html`<script>
					console.log("b");
				</script>`}`;

			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					{ tagName: "script" },
					'\n\t\t\t\t\tconsole.log("a");\n\t\t\t\t',
					{ tagName: "script", closeTag: true },
					"\n\t\t\t\t",
					{ tagName: "script" },
					'\n\t\t\t\t\tconsole.log("b");\n\t\t\t\t',
					{ tagName: "script", closeTag: true },
				])
			);
		});
	});

	// duplicate of scripts tests for styles
	describe("styles", () => {
		it("are found and parsed for bubbling during render", () => {
			const result = html`<style>
				body {
					background-color: red;
				}
			</style>`;
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					{ tagName: "style" },
					"\n\t\t\t\tbody {\n\t\t\t\t\tbackground-color: red;\n\t\t\t\t}\n\t\t\t",
					{ tagName: "style", closeTag: true },
				])
			);
		});

		it("nested are found and parsed for bubbling during render", () => {
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
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					{ tagName: "style" },
					"\n\t\t\t\t\tbody {\n\t\t\t\t\t\tbackground-color: red;\n\t\t\t\t\t}\n\t\t\t\t",
					{ tagName: "style", closeTag: true },
					"\n\t\t\t\t",
					{ tagName: "style" },
					"\n\t\t\t\t\tbody {\n\t\t\t\t\t\tcolor: green;\n\t\t\t\t\t}\n\t\t\t\t",
					{ tagName: "style", closeTag: true },
				])
			);
		});
	});

	describe("custom-elements", () => {
		it("are found and parsed for expansion during render", () => {
			const result = html`<div>
				<custom-element name="value">a</custom-element>
			</div>`;
			inlineSnapshot(
				result.__html,
				`<div>
				<custom-element name="value">a</custom-element>
			</div>`
			);
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					"<div>\n\t\t\t\t",
					{ tagName: "custom-element", attrs: 'name="value"' },
					"a",
					{ tagName: "custom-element", closeTag: true },
					"\n\t\t\t</div>",
				])
			);
		});

		it("nested are found and parsed for expansion during render", () => {
			const result = html`<div>
				<custom-element-a name="value">
					a
					<custom-element-b name="value">b</custom-element-b>
				</custom-element-a>
			</div>`;
			inlineSnapshot(
				result.__html,
				`<div>
				<custom-element-a name="value">
					a
					<custom-element-b name="value">b</custom-element-b>
				</custom-element-a>
			</div>`
			);
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					"<div>\n\t\t\t\t",
					{ tagName: "custom-element-a", attrs: 'name="value"' },
					"\n\t\t\t\t\ta\n\t\t\t\t\t",
					{ tagName: "custom-element-b", attrs: 'name="value"' },
					"b",
					{ tagName: "custom-element-b", closeTag: true },
					"\n\t\t\t\t",
					{ tagName: "custom-element-a", closeTag: true },
					"\n\t\t\t</div>",
				])
			);
		});

		it("nested are found in nested HTMLNode", () => {
			const result = html`<div>
				<custom-element-a name="value">
					a ${html`<custom-element-b name="value">b</custom-element-b>`}
				</custom-element-a>
			</div>`;
			inlineSnapshot(
				result.__html,
				`<div>
				<custom-element-a name="value">
					a <custom-element-b name="value">b</custom-element-b>
				</custom-element-a>
			</div>`
			);
			inlineSnapshot(
				JSON.stringify(result.__chunks),
				JSON.stringify([
					"<div>\n\t\t\t\t",
					{ tagName: "custom-element-a", attrs: 'name="value"' },
					"\n\t\t\t\t\ta ",
					{ tagName: "custom-element-b", attrs: 'name="value"' },
					"b",
					{ tagName: "custom-element-b", closeTag: true },
					"\n\t\t\t\t",
					{ tagName: "custom-element-a", closeTag: true },
					"\n\t\t\t</div>",
				])
			);
		});
	});
});
