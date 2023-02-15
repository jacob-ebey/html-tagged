/**
 * @typedef {{
 *  root: import("./html").HtmlNode;
 *  headIndex: number;
 *  head: string;
 *  foundBody: boolean;
 *  body: string;
 *  scriptCache: Set<string>;
 *  styleCache: Set<string>;
 * }} RenderToStringContext
 */

/** @type {import("./render").renderToString} */
export function renderToString(node, args) {
	args = args || {};
	const customElements = args.elements || {};

	let result = "";
	/** @type {RenderToStringContext} */
	const ctx = this || {
		root: node,
		headIndex: -1,
		head: "",
		foundBody: false,
		body: "",
		scriptCache: new Set(),
		styleCache: new Set(),
	};
	for (let i = 0; i < node.__chunks.length; i++) {
		const chunk = node.__chunks[i];

		switch (typeof chunk) {
			case "string":
				result += chunk;
				break;
			case "object":
				if (
					!chunk.closeTag &&
					((chunk.tagName === "script" && ctx.foundBody) ||
						(chunk.tagName === "style" && ctx.headIndex !== -1))
				) {
					let collected = `<${chunk.tagName}`;
					if (chunk.attrs) collected += ` ${chunk.attrs}`;
					collected += ">";
					collected += node.__chunks[++i];
					collected += `</${chunk.tagName}>`;
					++i;

					switch (chunk.tagName) {
						case "script":
							if (ctx.scriptCache.has(collected)) continue;
							ctx.scriptCache.add(collected);
							ctx.body += collected;
							break;
						case "style":
							if (ctx.styleCache.has(collected)) continue;
							ctx.styleCache.add(collected);
							ctx.head += collected;
							break;
					}
					continue;
				}

				if (chunk.tagName === "slot") {
					if (chunk.closeTag) break;

					result += renderToString.call(
						ctx,
						{ __chunks: args.__slot || [] },
						{ ...args, __slot: undefined }
					);
					break;
				}

				if (chunk.closeTag) {
					if (
						chunk.tagName === "head" &&
						ctx.headIndex === -1 &&
						ctx.root === node
					) {
						ctx.headIndex = result.length;
					} else if (chunk.tagName === "body" && ctx.root === node) {
						ctx.foundBody = false;
						result += ctx.body;
					}
					result += `</${chunk.tagName}>`;
				} else {
					if (chunk.tagName === "body") {
						ctx.foundBody = true;
					}
					result += `<${chunk.tagName}`;
					if (chunk.attrs) result += ` ${chunk.attrs}`;
					result += ">";

					const CustomElement = customElements[chunk.tagName];
					if (!CustomElement) {
						break;
					}

					let start = i + 1;
					let depth = 1;
					while (depth > 0) {
						i++;
						const nextChunk = node.__chunks[i];
						if (typeof nextChunk === "object") {
							if (nextChunk.closeTag) depth--;
							else depth++;
						}
					}
					i--;
					const slotChunks = node.__chunks.slice(start, i + 1);

					if (CustomElement) {
						const customElementNode = CustomElement({
							attrs: parseAttributes(chunk.attrs),
						});
						result += renderToString.call(ctx, customElementNode, {
							...args,
							__slot: slotChunks,
						});
					}
				}
				break;
		}
	}
	if (ctx.root === node && ctx.headIndex !== -1 && ctx.head) {
		result =
			result.slice(0, ctx.headIndex) + ctx.head + result.slice(ctx.headIndex);
	}
	return result;
}

/**
 * @param {string | undefined} str
 * @returns {Record<string, string>}
 */
function parseAttributes(str) {
	const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
	const obj = {};
	let token;
	if (str) {
		splitAttrsTokenizer.lastIndex = 0;
		str = " " + (str || "") + " ";
		while ((token = splitAttrsTokenizer.exec(str))) {
			obj[token[1]] = token[3];
		}
	}
	return obj;
}
