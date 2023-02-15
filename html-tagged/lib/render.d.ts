import { type HTMLNode } from "./html";

export interface CustomElementArgs<
	Attrs extends Record<string, string> = Record<string, string>
> {
	attrs: Attrs;
}

export interface CustomElement<
	Attrs extends Record<string, string> = Record<string, string>
> {
	(args: CustomElementArgs<Attrs>): HTMLNode;
}

export interface RenderToStringArgs {
	elements?: Record<string, CustomElement>;
	__slot?: Array<string | HTMLTag>;
}

export function renderToString(
	node: HTMLNode,
	args?: RenderToStringArgs
): string;
