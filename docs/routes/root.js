import { html } from "html-tagged";

export default function Root() {
  return html`
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" />
        <title>html-tagged</title>
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
