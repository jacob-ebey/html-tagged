import { renderToString } from "html-tagged";
import { createTrie, matchTrie } from "router-trie";

import * as rootModule from "../routes/root.js";
import * as homeModule from "../routes/home.js";

const routerTrie = createTrie([
  {
    id: "root",
    module: rootModule,
    children: [
      {
        id: "home",
        index: true,
        module: homeModule,
      },
    ],
  },
]);

export async function onRequest(context) {
  /** @type {Request} */
  const request = context.request;
  const url = new URL(request.url);

  const matches = matchTrie(routerTrie, url.pathname);

  if (!matches) {
    return await context.next();
  }

  /** @type {import("html-tagged/lib/html").HTMLNode} */
  let lastRendered = null;
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];

    if (!match.module) continue;
    const RouteComponent = match.module.default;
    if (!RouteComponent) continue;

    const htmlNode = RouteComponent();

    if (lastRendered) {
      let slotStart = -1;
      let slotEnd = -1;
      for (let i = 0; i < htmlNode.__chunks.length; i++) {
        const chunk = htmlNode.__chunks[i];
        if (typeof chunk === "object" && chunk.tagName === "slot") {
          if (chunk.closeTag) {
            slotEnd = i;
            break;
          } else {
            slotStart = i;
          }
        }
      }
      if (slotStart !== -1 && slotEnd !== -1) {
        htmlNode.__chunks.splice(
          slotStart,
          slotEnd - slotStart + 1,
          lastRendered
        );
      }
    }
    lastRendered = renderToString(htmlNode);
  }

  return new Response(lastRendered, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
