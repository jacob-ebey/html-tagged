import type { HTMLNode } from "html-tagged";
import type { RouteConfig } from "router-trie";
import type { EventContext } from "@cloudflare/workers-types";

export type Context = EventContext<{}, string, unknown>;

export type Route = RouteConfig & {
	children?: Route[];
	module: {
		data?: (context: Context) => unknown;
		default?: ({ data: unknown }) => HTMLNode;
	};
};

declare const routes: Route[];
export default routes;
