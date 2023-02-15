import { html } from "html-tagged";

export default function ClientNavigation() {
	return html`
		<script type="module">
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

			function updateDOM(newHTML) {
				const htmlElement = document.createElement("html");
				htmlElement.innerHTML = newHTML;

				const existingScripts = new Set();
				let childNodesLength = document.body.childNodes.length;
				for (let i = childNodesLength - 1; i >= 0; i--) {
					if (document.body.childNodes[i].tagName === "SCRIPT") {
						existingScripts.add(document.body.childNodes[i].innerHTML);
						continue;
					}
					document.body.removeChild(document.body.childNodes[i]);
				}

				const bodyChildren = htmlElement.querySelector("body").childNodes;
				childNodesLength = bodyChildren.length;
				for (let i = childNodesLength - 1; i >= 0; i--) {
					if (
						bodyChildren[i].tagName === "SCRIPT" &&
						existingScripts.has(bodyChildren[i].innerHTML)
					) {
						continue;
					}
					document.body.prepend(bodyChildren[i]);
				}

				scrollTo(0, 0);
			}
		</script>
	`;
}
