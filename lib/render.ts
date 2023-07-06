import { HTMLNodeSymbol, isHTMLTag } from "./html.ts";
import type { HTMLNode, HTMLTag } from "./html.ts";

export interface CustomElementArgs<
  Attrs extends Record<string, string> = Record<string, string>,
> {
  attrs: Attrs;
}

export interface CustomElement<
  Attrs extends Record<string, string> = Record<string, string>,
> {
  (args: CustomElementArgs<Attrs>): HTMLNode;
}

export interface RenderToStringArgs {
  elements?: Record<string, CustomElement>;
  __slot?: Array<string | HTMLTag>;
}

export interface RenderToStringContext {
  root: HTMLNode;
  headIndex: number;
  head: string;
  foundBody: boolean;
  body: string;
  scriptCache: Set<string>;
  styleCache: Set<string>;
}

export function renderToString(
  this: void | RenderToStringContext | undefined | null,
  node: HTMLNode,
  args?: RenderToStringArgs,
) {
  args = args || {};
  const customElements = args.elements || {};
  const chunks = node[2] || [];

  let result = "";
  /** @type {RenderToStringContext} */
  const ctx = (this as RenderToStringContext) || {
    root: node,
    headIndex: -1,
    head: "",
    foundBody: false,
    body: "",
    scriptCache: new Set(),
    styleCache: new Set(),
  };
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];

    switch (typeof chunk) {
      case "string":
        result += chunk;
        break;
      case "object":
        if (isHTMLTag(chunk)) {
          const closeTag = chunk[1];
          const tagName = chunk[2];
          const hasAttrs = chunk[3];

          if (
            !closeTag &&
            ((tagName === "script" && ctx.foundBody) ||
              (tagName === "style" && ctx.headIndex !== -1))
          ) {
            let collected = `<${tagName}`;
            if (hasAttrs) collected += ` ${hasAttrs}`;
            collected += ">";
            collected += chunks[++i];
            collected += `</${tagName}>`;
            ++i;

            switch (tagName) {
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

          if (tagName === "slot") {
            if (closeTag) break;

            result += renderToString.call(
              ctx,
              [HTMLNodeSymbol, "", args.__slot || []],
              { ...args, __slot: undefined },
            );
            break;
          }

          if (closeTag) {
            if (
              tagName === "head" &&
              ctx.headIndex === -1 &&
              ctx.root === node
            ) {
              ctx.headIndex = result.length;
            } else if (tagName === "body" && ctx.root === node) {
              ctx.foundBody = false;
              result += ctx.body;
            }
            result += `</${tagName}>`;
          } else {
            if (tagName === "body") {
              ctx.foundBody = true;
            }
            result += `<${tagName}`;
            if (hasAttrs) result += ` ${hasAttrs}`;
            result += ">";

            const CustomElement = customElements[tagName];
            if (!CustomElement) {
              break;
            }

            const start = i + 1;
            let depth = 1;
            while (depth > 0) {
              i++;
              const nextChunk = chunks[i];
              if (isHTMLTag(nextChunk)) {
                if (nextChunk[1]) depth--;
                else depth++;
              }
            }
            i--;
            const slotChunks = chunks.slice(start, i + 1);

            if (CustomElement) {
              const customElementNode = CustomElement({
                attrs: hasAttrs ? parseAttributes(hasAttrs) : {},
              });
              result += renderToString.call(ctx, customElementNode, {
                ...args,
                __slot: slotChunks,
              });
            }
          }
        }
        break;
    }
  }
  if (ctx.root === node && ctx.headIndex !== -1 && ctx.head) {
    result = result.slice(0, ctx.headIndex) + ctx.head +
      result.slice(ctx.headIndex);
  }
  return result;
}

function parseAttributes(str: string): Record<string, string> {
  const splitAttrsTokenizer = /([a-z0-9_\:\-]*)\s*?=\s*?(['"]?)(.*?)\2\s+/gim;
  const obj: Record<string, string> = {};
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
