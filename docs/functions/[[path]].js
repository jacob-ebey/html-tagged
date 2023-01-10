import { renderToString } from "html-tagged";
import { createTrie, matchTrie } from "router-trie";

import elements from "../elements/index.js";
import routes from "../routes/index.js";

const routerTrie = createTrie(routes);

export async function onRequest(context) {
  /** @type {Request} */
  const request = context.request;
  const url = new URL(request.url);

  const matches = matchTrie(routerTrie, url.pathname);

  if (!matches) {
    return await context.next();
  }

  const matchesData = new Map();
  for (const match of matches) {
    if (match.module && match.module.data) {
      const dataPromise = Promise.resolve(match.module.data({ request }));
      matchesData.set(match.id, dataPromise);
    }
  }

  /** @type {import("html-tagged/lib/html").HTMLNode} */
  let lastNode = null;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];

    if (!match.module) continue;
    const RouteComponent = match.module.default;
    if (!RouteComponent) continue;

    const dataPromise = matchesData.get(match.id);
    let data = undefined;
    if (dataPromise) {
      data = await dataPromise;
    }

    const htmlNode = RouteComponent({ data });

    if (lastNode) {
      let slotIndex = htmlNode.__chunks.findIndex(
        (n) => typeof n === "object" && n.tagName === "slot"
      );
      if (slotIndex !== -1) {
        htmlNode.__chunks.splice(slotIndex, 2, ...lastNode.__chunks);
      }
    }
    lastNode = htmlNode;
  }

  return new Response(renderToString(lastNode, { elements }), {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
