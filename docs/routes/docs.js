import { html } from "html-tagged";
/**
 *
 * @param {{ data: Awaited<ReturnType<typeof data>> }} args
 * @returns
 */
export default function Docs({ data }) {
  return html`
      <div role="navigation" aria-label="Docs Navigation">
        <ul class="docs-nav">
          <li><a href="/docs">Docs Home</a></li>
          <li><a href="/docs">Docs Home</a></li>
        </ul>
      </div>
    </header>
    <main>
      <slot></slot>
    </main>

    <style>
      .docs-nav {
        list-style-type: none;
        border: 1px solid var(--color-secondary);
      }
    </style>
  `;
}
