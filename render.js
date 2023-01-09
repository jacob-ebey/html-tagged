/** @type {import("./render").renderToString} */
export function renderToString(node, args) {
  args = args || {};
  const customElements = args.elements || {};

  let result = "";
  for (let i = 0; i < node.__chunks.length; i++) {
    const chunk = node.__chunks[i];

    switch (typeof chunk) {
      case "string":
        result += chunk;
        break;
      case "object":
        if (chunk.tagName === "slot") {
          if (chunk.closeTag) break;

          result += renderToString(
            { __chunks: args.__slot || [] },
            { ...args, __slot: undefined }
          );
          break;
        }

        if (chunk.closeTag) {
          result += `</${chunk.tagName}>`;
        } else {
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
            result += renderToString(customElementNode, {
              ...args,
              __slot: slotChunks,
            });
          }
        }
        break;
    }
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
