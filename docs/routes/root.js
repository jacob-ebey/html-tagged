import { html } from "html-tagged";

export default function Root() {
  return html`
    <!DOCTYPE html>
    <html lang="en-us">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>html-tagged</title>
      </head>
      <body>
        <h1>Root</h1>
        <slot></slot>
      </body>
    </html>
  `;
}
