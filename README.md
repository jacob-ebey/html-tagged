# html-tagged

A SSR template library that expands custom elements. Inspired by [@enhance/ssr](https://npmjs.com/package/@enhance/ssr).

## Usage

```js
import { attr, html, renderToString } from "html-tagged";

const elements = {
  "my-element": ({ attrs }) =>
    html`<div class="my-element" data-name=${attr(attrs.name)}>
      <slot></slot>
    </div>`,
};

const template = html`<my-element name="test">Hello World!</my-element>`;
const htmlString = renderToString(template, { elements });
console.log(htmlString);
```

will output:

```html
<my-element name="test">
  <div class="my-element" data-name="test">Hello World!</div>
</my-element>
```

## Performance

The performance mainly comes from the fact this library does not fully parse the input HTML, but instead parses just what's needed for the functionality this library provides. This means that the library is not a full HTML parser, and it will not be able to parse HTML that is not valid for the functionality this library provides.

| Library      | Ops/sec |
| ------------ | ------- |
| @enhance/ssr | 64867   |
| html-tagged  | 233418  |
