import { html } from "html-tagged";

export default function ClientNavigation() {
  return html`
    <script type="module">
      import { DiffDOM } from "https://esm.sh/diff-dom@5.0.3";

      if (typeof navigation !== "undefined") {
        let lastAbortController;
        navigation.addEventListener("navigate", (event) => {
          if (!event.canIntercept) return;

          if (lastAbortController) {
            lastAbortController.abort();
          }
          lastAbortController = new AbortController();
          const signal = lastAbortController.signal;

          event.intercept({
            async handler() {
              if (signal.aborted) return;
              const response = await fetch(event.destination.url, {
                signal,
              });
              if (signal.aborted) return;
              const newHTML = await response.text();
              if (signal.aborted) return;

              if (!document.startViewTransition) {
                updateDOM(newHTML);
                return;
              } else {
                const transition = document.startViewTransition(() => {
                  updateDOM(newHTML);
                });
                signal.addEventListener("abort", () => {
                  transition.skipTransition();
                });
                await transition.finished;
              }
            },
          });
        });
      }

      const dd = new DiffDOM();
      function updateDOM(newHTML) {
        const parser = new DOMParser();
        const newDOM = parser.parseFromString(newHTML, "text/html");

        const currentScripts = new Set();
        const scripts = [];
        document.querySelectorAll("script").forEach((script) => {
          currentScripts.add(script.src || script.textContent);
          script.parentElement.removeChild(script);
          scripts.push(script);
        });

        newDOM.querySelectorAll("script").forEach((script) => {
          if (!currentScripts.has(script.src || script.textContent)) {
            const newScript = document.createElement("script");
            newScript.async = script.async;
            newScript.defer = script.defer;
            newScript.type = script.type;
            if (script.src) {
              newScript.src = script.src;
            } else {
              newScript.innerHTML = script.innerHTML;
            }
            scripts.push(newScript);
          }
          script.parentElement.removeChild(script);
        });

        const diff = dd.diff(document.documentElement, newDOM.documentElement);
        dd.apply(document.documentElement, diff);

        for (const script of scripts) {
          document.body.appendChild(script);
        }

        scrollTo(0, 0);
      }
    </script>
  `;
}
