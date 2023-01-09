/**
 * @typedef {import("./html").HTMLNode} HTMLNode
 * @typedef {import("./html").HTMLTag} HTMLTag
 */

const customElementRegex =
  /^[a-z](?:[\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*-(?:[\x2D\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
const reservedTags = [
  "annotation-xml",
  "color-profile",
  "font-face",
  "font-face-src",
  "font-face-uri",
  "font-face-format",
  "font-face-name",
  "missing-glyph",
];

/** @type {import("./html").html} */
export function html(template, ...args) {
  const domParserTokenizer =
    /(?:<(\/?)([a-zA-Z][a-zA-Z0-9\:\-]*)(?:\s([^>]*?))?((?:\s*\/)?)>)/gm;

  let result = "";
  const final = template.length - 1;
  for (let i = 0; i < final; i++) {
    let arg = args[i];
    result += template[i];
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
        if (typeof arg.__html === "string") {
          result += arg.__html;
        }
        break;
    }
  }
  result += template[final];

  /** @type {Array<string | HTMLNode>} */
  const chunks = [];
  let token;
  let lastIndex = 0;
  while ((token = domParserTokenizer.exec(result))) {
    const closeTag = token[1] === "/";
    const tagName = token[2];
    if (tagName === "slot" || isCustomElement(tagName)) {
      if (closeTag) {
        chunks.push(result.substring(lastIndex, token.index));
        chunks.push({ tagName, closeTag: true });
        lastIndex = token.index + token[0].length;
      } else {
        chunks.push(result.substring(lastIndex, token.index));
        chunks.push({
          tagName,
          attrs: token[3],
        });
        lastIndex = token.index + token[0].length;
      }
    }
  }
  chunks.push(result.substring(lastIndex));

  return { __html: result, __chunks: chunks };
}

/**
 * @param {string} tagName
 */
function notReservedTag(tagName) {
  return reservedTags.indexOf(tagName) === -1;
}

/**
 * @param {string} tagName
 */
function isCustomElement(tagName) {
  return customElementRegex.test(tagName) && notReservedTag(tagName);
}
