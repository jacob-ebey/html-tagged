import { html } from "html-tagged";

import mvpcss from "./mvp.css.js";

export default function Root() {
  return html`
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>html-tagged</title>
        ${mvpcss}
      </head>
      <body>
        <header>
          <nav>
            <h1>html-tagged</h1>
            <ul>
              <li>Home</li>
            </ul>
          </nav>
        </header>
        <slot></slot>
      </body>
    </html>
  `;
}
