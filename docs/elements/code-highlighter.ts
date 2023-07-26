import type { CustomElementArgs } from "html-tagged/server";
import { attr, html } from "html-tagged";

export default function CodeHighlighter({ attrs }: CustomElementArgs) {
  return html`
    <pre><code class=${attr(attrs.lang)}><slot></slot></code></pre>
    <script type="module">
      import Prism from "https://esm.sh/prismjs@1.29.0";

      let defined = false;
      if (!defined) {
        defined = true;
        customElements.define(
          "code-highlighter",
          class extends HTMLElement {
            constructor() {
              super();
              this.observer = new MutationObserver(() => {
                const pre = this.querySelector("pre");
                if (pre.className) {
                  return;
                }

                const code = this.querySelector("code");
                if (!code) return;

                Prism.highlightElement(code);
                this.observer.observe(this, {
                  attributes: true,
                  childList: true,
                  subtree: true,
                });
              });
            }

            connectedCallback() {
              const code = this.querySelector("code");
              if (!code) return;

              Prism.highlightElement(code);
              this.observer.observe(this, {
                attributes: true,
                childList: true,
                subtree: true,
              });
            }

            disconnectedCallback() {
              this.observer.disconnect();
            }
          }
        );
      }
    </script>
  `;
}
