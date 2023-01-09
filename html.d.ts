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

export function html(
  strings: TemplateStringsArray,
  ...values: string | number | boolean | HTMLNode[]
): HTMLNode;
