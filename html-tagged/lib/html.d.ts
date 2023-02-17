export const HTMLTagSymbol: symbol;
export type HTMLTagName = string & {};
export type HTMLTagCloseTag = boolean & {};
export type HTMLTagAttributes = string & {};
export type HTMLTag = [
	typeof HTMLTagSymbol,
	HTMLTagCloseTag,
	HTMLTagName,
	HTMLTagAttributes | null
] & {};

export const HTMLNodeSymbol: symbol;
export type HTMLNodeHTML = string & {};
export type HTMLNodeChunks = Array<string | HTMLTag> & {};
export type HTMLNode = [
	typeof HTMLNodeSymbol,
	HTMLNodeHTML,
	HTMLNodeChunks | null
] & {};

type ValueType = string | number | boolean | HTMLNode;

export function html(
	strings: TemplateStringsArray,
	...values: Array<ValueType | ValueType[]>
): HTMLNode;

export function attr(value: string | number, preserveCR?: boolean): string;

export function value(unsafe: string): string;

export function isHTMLTag(value: any): value is HTMLTag;
export function isHTMLNode(value: any): value is HTMLNode;
