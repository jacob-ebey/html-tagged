export type HTMLTag =
	| {
			tagName: string;
			closeTag: true;
	  }
	| {
			tagName: string;
			attrs: string | undefined;
	  };

export interface HTMLNode {
	__html: string;
	__chunks: Array<string | HTMLTag>;
}

type ValueType = string | number | boolean | HTMLNode;

export function html(
	strings: TemplateStringsArray,
	...values: ValueType | HTMLNode[]
): HTMLNode;

export function attr(value: string | number, preserveCR?: boolean): string;

export function value(unsafe: string): string;
