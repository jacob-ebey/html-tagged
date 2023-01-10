/** @type {import("./render").renderToString} */
export function renderToString(node, args) {
  args = args || {};
  const customElements = args.elements || {};

  let result = "";
  let headIndex = -1;
  let head = "";
  let foundBody = false;
  let body = "";
  // TODO: dedupe scripts and styles
  const scriptCache = new Set();
  const styleCache = new Set();
  for (let i = 0; i < node.__chunks.length; i++) {
    const chunk = node.__chunks[i];

    switch (typeof chunk) {
      case "string":
        result += chunk;
        break;
      case "object":
        if (
          !chunk.closeTag &&
          ((chunk.tagName === "script" && foundBody) ||
            (chunk.tagName === "style" && headIndex !== -1))
        ) {
          let collected = `<${chunk.tagName}`;
          if (chunk.attrs) collected += ` ${chunk.attrs}`;
          collected += ">";
          collected += node.__chunks[++i];
          collected += `</${chunk.tagName}>`;
          ++i;

          switch (chunk.tagName) {
            case "script":
              if (scriptCache.has(collected)) continue;
              scriptCache.add(collected);
              body += collected;
              break;
            case "style":
              if (styleCache.has(collected)) continue;
              styleCache.add(collected);
              head += collected;
              break;
          }
          continue;
        }

        if (chunk.tagName === "slot") {
          if (chunk.closeTag) break;

          result += renderToString(
            { __chunks: args.__slot || [] },
            { ...args, __slot: undefined }
          );
          break;
        }

        if (chunk.closeTag) {
          if (chunk.tagName === "head") {
            headIndex = result.length;
          } else if (chunk.tagName === "body") {
            foundBody = false;
            result += body;
          }
          result += `</${chunk.tagName}>`;
        } else {
          if (chunk.tagName === "body") {
            foundBody = true;
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
            result += renderToString(customElementNode, {
              ...args,
              __slot: slotChunks,
            });
          }
        }
        break;
    }
  }
  if (headIndex !== -1 && head) {
    result = result.slice(0, headIndex) + head + result.slice(headIndex);
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
