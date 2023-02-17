/**
 * @typedef {import("./html.js").HTMLNode} HTMLNode
 * @typedef {import("./html.js").HTMLTag} HTMLTag
 */

/** @type {import("./html.js").HTMLTagSymbol} */
export const HTMLTagSymbol = Symbol("HTMLTag");
/** @type {import("./html.js").HTMLNodeSymbol} */
export const HTMLNodeSymbol = Symbol("HTMLNode");

/** @type {import("./html.js").isHTMLTag} */
export function isHTMLTag(value) {
	return Array.isArray(value) && value[0] === HTMLTagSymbol;
}

/** @type {import("./html.js").isHTMLNode} */
export function isHTMLNode(value) {
	return Array.isArray(value) && value[0] === HTMLNodeSymbol;
}

const customElementRegex =
	/^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;

const domParserTokenizer =
	/(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:\-]*)(?:\s([^>]*?))?((?:\s*\/)?)>)/gm;

export function attr(s, preserveCR) {
	// https://stackoverflow.com/questions/7753448/how-do-i-escape-quotes-in-html-attribute-values
	preserveCR = preserveCR ? "&#13;" : "\n";
	return (
		'"' +
		("" + s) /* Forces the conversion to string. */
			.replace(/&/g, "&amp;") /* This MUST be the 1st replacement. */
			.replace(/'/g, "&apos;") /* The 4 other predefined entities, required. */
			.replace(/"/g, "&quot;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			/*
        You may add other replacements here for HTML only 
        (but it's not necessary).
        Or for XML, only if the named entities are defined in its DTD.
        */
			.replace(/\r\n/g, preserveCR) /* Must be before the next replacement. */
			.replace(/[\r\n]/g, preserveCR) +
		'"'
	);
}

export function value(unsafe) {
	return (unsafe || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 *
 * @param {boolean} closeTag
 * @param {string} tagName
 * @param {string} attributes
 * @returns {HTMLTag}
 */
function h(closeTag, tagName, attributes = null) {
	return [HTMLTagSymbol, closeTag, tagName, attributes];
}

/** @type {import("./html.js").html} */
export function html(template, ...args) {
	let result = "";
	const final = template.length - 1;
	for (let i = 0; i < final; i++) {
		result += template[i];
		let argArray = args[i];
		if (!Array.isArray(argArray) || isHTMLNode(argArray)) {
			argArray = [argArray];
		}

		for (const arg of argArray) {
			switch (typeof arg) {
				case "string":
					result += arg;
					break;
				case "number":
					result += String(arg);
					break;
				case "boolean":
					result += arg ? "true" : "";
					break;
				case "object":
					if (!arg) break;
					if (isHTMLNode(arg)) {
						result += arg[1];
					}
					break;
			}
		}
	}
	result += template[final];

	/** @type {Array<string | HTMLTag>} */
	const chunks = [];
	let token;
	let lastIndex = 0;
	let sub = "";
	while ((token = domParserTokenizer.exec(result))) {
		const closeTag = token[1] === "/";
		let tagName = token[2].toLocaleLowerCase();

		if (
			(isCustomElement(token[2]) && (tagName = token[2])) ||
			tagName === "html" ||
			tagName === "head" ||
			tagName === "body" ||
			tagName === "style" ||
			tagName === "script" ||
			tagName === "slot"
		) {
			sub = result.substring(lastIndex, token.index);
			sub && chunks.push(sub);
			if (closeTag) {
				chunks.push(h(true, tagName));
			} else {
				chunks.push(h(false, tagName, token[3]));
			}
			lastIndex = token.index + token[0].length;
		}
	}
	sub = result.substring(lastIndex);
	sub && chunks.push(sub);

	return [HTMLNodeSymbol, result, chunks];
}

/**
 * @param {string} tagName
 */
function notReservedTag(tagName) {
	return (
		tagName !== "annotation-xml" &&
		tagName !== "color-profile" &&
		tagName !== "font-face" &&
		tagName !== "font-face-src" &&
		tagName !== "font-face-uri" &&
		tagName !== "font-face-format" &&
		tagName !== "font-face-name" &&
		tagName !== "missing-glyph"
	);
}

/**
 * @param {string} tagName
 */
function isCustomElement(tagName) {
	return customElementRegex.test(tagName) && notReservedTag(tagName);
}
