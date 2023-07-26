import { html } from "html-tagged";

export default function DocumentLayout() {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>My App</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/prismjs@1.29.0/themes/prism-okaidia.min.css"
        />
        <style>
          :root {
            /* Light theme colors */
            --background-color: #f8f8f8;
            --text-color: #333;
            --header-bg-color: #ffa500;
            --header-text-color: #fff;
            --link-color: #007bff;
            --link-hover-color: #0044cc;
            --blockquote-bg-color: #f1f1f1;
            --blockquote-border-color: #ffa500;

            /* Dark theme colors - will be redefined by JavaScript */
          }

          /* Reset some default styles to achieve a clean slate */
          body,
          h1,
          h2,
          h3,
          p,
          blockquote,
          ul,
          li {
            margin: 0;
            padding: 0;
          }

          body {
            font-family: "Comic Sans MS", cursive, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background-color: var(--background-color);
          }

          header {
            background-color: var(--header-bg-color);
            color: var(--header-text-color);
            padding: 1rem;
            text-align: center;
            border-radius: 10px;
            margin: 1rem;
          }

          h1 {
            font-size: 3rem;
            text-shadow: 2px 2px 4px #ff4161;
          }

          ul {
            list-style: none;
            display: flex;
            justify-content: center;
            margin-top: 1rem;
          }

          li {
            margin-right: 1rem;
          }

          a {
            color: var(--link-color);
            text-decoration: none;
            transition: color 0.3s ease;
          }

          a:hover {
            color: var(--link-hover-color);
          }

          main {
            padding: 2rem;
          }

          h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #ff4161;
          }

          p {
            margin-bottom: 1rem;
            font-size: 1.2rem;
          }

          hr {
            margin: 2rem 0;
            border: 2px solid #ff4161;
          }

          table {
            border-collapse: collapse;
            margin-bottom: 2rem;
            width: 100%;
          }
          th {
            text-align: left;
            color: var(--header-text-color);
            background-color: var(--header-bg-color);
            padding: 1rem;
          }
          th,
          td {
            padding: 0.5rem;
            border: 2px solid var(--blockquote-border-color);
          }

          blockquote {
            margin: 2rem 0;
            padding: 1rem;
            background-color: var(--blockquote-bg-color);
            border-left: 6px solid var(--blockquote-border-color);
            font-size: 1.2rem;
          }

          blockquote i {
            display: block;
            font-size: 1.6rem;
            margin-top: 1rem;
            color: #ff4161;
            text-align: center;
          }

          article,
          nav {
            max-width: 900px;
            margin: 0 auto;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --background-color: #1c1c1c;
              --text-color: #f8f8f8;
              --header-bg-color: #ff69b4;
              --header-text-color: #fff;
              --link-color: #0076ff;
              --link-hover-color: #339eff;
              --blockquote-bg-color: #222;
              --blockquote-border-color: #ff69b4;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <nav>
            <h1>html-tagged</h1>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/docs">Docs</a></li>
            </ul>
          </nav>
        </header>
        <slot></slot>

        <client-navigation></client-navigation>
      </body>
    </html>
  `;
}
