import type { HTMLNode } from "html-tagged";
import type { IndexRouteConfig, NonIndexRouteConfig } from "router-trie";

import * as documentLayout from "./routes/layout.ts";
import * as index from "./routes/page.ts";
import * as docs from "./routes/docs/page.ts";

export type RouteModule<T> = {
  loader?: () => Promise<T> | T;
  default: (props: { data: T }) => HTMLNode;
};

type RouteConfig = (
  | IndexRouteConfig
  | (Omit<NonIndexRouteConfig, "children"> & { children?: RouteConfig[] })
) & { module: RouteModule<unknown> };

const routes: RouteConfig[] = [
  {
    id: "root",
    module: documentLayout,
    children: [
      { id: "home", index: true, module: index },
      { id: "docs", path: "docs", module: docs },
    ],
  },
];

export default routes;
