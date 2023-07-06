# html-tagged

A SSR template library that expands custom elements. Inspired by
[@enhance/ssr](https://npmjs.com/package/@enhance/ssr).

## Usage

```js
import { attr, html } from "html-tagged";
import { renderToString } from "html-tagged/server";

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

The performance mainly comes from the fact this library does not fully parse the
input HTML, but instead parses just what's needed for the functionality this
library provides. This means that the library is not a full HTML parser, and it
will not be able to parse HTML that is not valid for the functionality this
library provides.

For a basic "hello world" page:

| Library      | Ops/sec |
| ------------ | ------- |
| @enhance/ssr | 64867   |
| html-tagged  | 256122  |

For the Oven-sh's Bun HUGE README (7630 lines):

| Library      | Ops/sec |
| ------------ | ------- |
| @enhance/ssr | 47      |
| html-tagged  | 306     |

## Development

Testing in Deno can be ran in a single pass with:

```sh
deno test -A
```

Or in watch mode with:

```sh
deno test -A --watch
```

Format code with:

```sh
deno task format
```

Typecheck / lint code with:

```sh
deno task check
```

## Contributing Changes

Install CLI:

```sh
npm i -g @changesets/cli
```

Generate changeset:

```sh
npx changeset
```
