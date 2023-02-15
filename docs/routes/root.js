import { html } from "html-tagged";

import mvpcss from "../styles/mvp.css.js";

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
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/docs">Docs</a>
              </li>
            </ul>
          </nav>
          <slot></slot>
        

        <client-navigation></client-navigation>
      </body>
    </html>
  `;
}
