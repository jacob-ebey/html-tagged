import { serve } from "https://deno.land/std@0.195.0/http/server.ts";
import { isHTMLTag } from "html-tagged";
import { renderToString } from "html-tagged/server";
import { createTrie, matchTrie } from "router-trie";

import elements from "./elements.ts";
import routes from "./routes.ts";

const routerTrie = createTrie(routes);

serve(async (request) => {
  try {
    const url = new URL(request.url);

    const matches = matchTrie(routerTrie, url.pathname);

    if (!matches) {
      return new Response("Not Found", { status: 404 });
    }

    const matchesData = new Map();
    for (const match of matches) {
      if (
        match.module &&
        "data" in match.module &&
        typeof match.module.data === "function"
      ) {
        const dataPromise = Promise.resolve(match.module.data({ request }));
        matchesData.set(match.id, dataPromise);
      }
    }

    /** @type {import("html-tagged").HTMLNode} */
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

      if (htmlNode[2] && lastNode?.[2]) {
        const slotIndex = htmlNode[2].findIndex(
          (n) => isHTMLTag(n) && n[2] === "slot"
        );
        if (slotIndex !== -1) {
          htmlNode[2].splice(slotIndex, 2, ...lastNode[2]);
        }
      }
      lastNode = htmlNode;
    }

    if (!lastNode) {
      throw new Error("One of the routes forgot to return a node.");
    }

    return new Response(renderToString(lastNode, { elements }), {
      headers: {
        "Content-Type": "text/html;charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
