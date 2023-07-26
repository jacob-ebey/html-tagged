import { html, value } from "html-tagged";

const codeExample = `import { attr, html, renderToString } from "html-tagged";

const elements = {
  "my-element": ({ attrs }) =>
    html\`
      <div class="my-element" data-name=\${attr(attrs.name)}>
        <slot></slot>
      </div>\`,
};

const template = html\`<my-element name="test">Hello World!</my-element>\`;

const htmlString = renderToString(template, { elements });
console.log(htmlString);`;

const codeExampleOutput = `<my-element name="test">
  <div class="my-element" data-name="test">
    Hello World!
  </div>
</my-element>`;

export default function Docs() {
  return html`
    <main>
      <article>
        <h1>html-tagged</h1>
        <p>
          A SSR template library that expands custom elements. Inspired by
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.npmjs.com/package/@enhance/ssr"
            >@enhance/ssr</a
          >.
        </p>

        <hr />

        <h2>Usage</h2>
        <code-highlighter lang="language-javascript"
          >${value(codeExample)}</code-highlighter
        >
        <p>Will output:</p>
        <code-highlighter lang="language-html"
          >${value(codeExampleOutput)}</code-highlighter
        >

        <hr />

        <h2>Performance</h2>
        <p>
          The performance mainly comes from the fact this library does not fully
          parse the input HTML, but instead parses just what's needed for the
          functionality this library provides.
        </p>
        <p>
          This means that the library is not a full HTML parser, and it will not
          be able to parse HTML that is not valid for the functionality this
          library provides.
        </p>
        <p>For a basic "hello world" page:</p>
        <table>
          <thead>
            <tr>
              <th>Library</th>
              <th>Ops/sec</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>@enhance/ssr</td>
              <td>64867</td>
            </tr>
            <tr>
              <td>html-tagged</td>
              <td>256122</td>
            </tr>
          </tbody>
        </table>
        <p>For the Oven-sh's Bun HUGE README (7630 lines):</p>
        <table>
          <thead>
            <tr>
              <th>Library</th>
              <th>Ops/sec</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>@enhance/ssr</td>
              <td>47</td>
            </tr>
            <tr>
              <td>html-tagged</td>
              <td>306</td>
            </tr>
          </tbody>
        </table>
      </article>
    </main>
  `;
}
