import * as assert from "node:assert";
import { describe, it } from "node:test";

import { html, renderToString, value } from "../lib/index.js";

import { inlineSnapshot } from "./assert.js";

describe("renderToString", () => {
	it("should render a simple string", () => {
		const result = renderToString(html`<div></div>`);
		inlineSnapshot(result, "<div></div>");
	});

	it("should render custom element without implementation to string", () => {
		const result = renderToString(
			html`<div><custom-element></custom-element></div>`
		);
		inlineSnapshot(result, "<div><custom-element></custom-element></div>");
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
		inlineSnapshot(
			result,
			`<div>
				<custom-element-a>
					a
					<custom-element-b>b</custom-element-b>
				</custom-element-a>
			</div>`
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
		inlineSnapshot(
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
		inlineSnapshot(
			result,
			`<div>
				<custom-element><div>custom element <span>a</span></div></custom-element>
			</div>`
		);
	});

	it("should pass attrs to custom-element", () => {
		const result = renderToString(
			html`<div>
				<custom-element name="test"><span>a</span></custom-element>
			</div>`,
			{
				elements: {
					"custom-element": ({ attrs }) =>
						html`<div>custom element ${value(attrs.name)} <slot></slot></div>`,
				},
			}
		);
		inlineSnapshot(
			result,
			`<div>
				<custom-element name="test"><div>custom element test <span>a</span></div></custom-element>
			</div>`
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
		inlineSnapshot(
			result,
			`<div>
				<custom-element><div>custom element 
					<span>a</span>
					<custom-element><div>custom element 
						<span>b</span>
					</div></custom-element>
				</div></custom-element>
			</div>`
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
		inlineSnapshot(
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
			inlineSnapshot(
				result,
				`<p>a</p>
					<style>
						html {
							color: green;
						}
					</style>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
									html {
										color: green;
									}
								</style></head>
						<body>
							<div>
								
								
							</div>
						<script>
									console.log("hello");
								</script></body>
					</html>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
									html {
										color: green;
									}
								</style></head>
						<body>
							<div>
								
								
							</div>
						<script>
									console.log("hello");
								</script></body>
					</html>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
				html {
					color: green;
				}
			</style></head>
						<body>
							<div>
								 
								
							</div>
						<script>
									console.log("hello");
								</script></body>
					</html>`
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
			inlineSnapshot(
				result,
				`<p>a</p>
					<script>
						console.log("hello");
					</script>`
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
			inlineSnapshot(
				result,
				`<script>
						console.log("a");
					</script>
					<script>
						console.log("b");
					</script>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
									html {
										color: green;
									}
								</style></head>
						<body>
							<div>
								
								
							</div>
						<script>
									console.log("hello");
								</script></body>
					</html>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
									html {
										color: green;
									}
								</style></head>
						<body>
							<div>
								
								
							</div>
						<script>
									console.log("hello");
								</script></body>
					</html>`
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
			inlineSnapshot(
				result,
				`<!DOCTYPE html>
					<html>
						<head><style>
									html {
										color: green;
									}
								</style></head>
						<body>
							<div>
								 
								
							</div>
						<script>
				console.log("hello");
			</script></body>
					</html>`
			);
		});
	});
});
