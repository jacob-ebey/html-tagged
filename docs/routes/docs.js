import { html } from "html-tagged";

import a11yDarkStyles from "../styles/a11y-dark.css.js";
import * as markdown from "../helpers/markdown";

/**
 * @param {import("./index.js").Context} context
 */
export async function data(context) {
	const url = new URL(context.request.url);
	const assetURL = `https://.../markdown/${url.pathname.replace(
		/^\/docs\/?/,
		""
	)}.md`;
	const mdResponse = await context.env.ASSETS.fetch(assetURL);
	const readme = markdown.parse(await mdResponse.text());

	return { readme };
}

/**
 * @param {{ data: Awaited<ReturnType<typeof data>> }} args
 */
export default function Docs({ data }) {
	return html`
    </header>
		<main>
			<article>${data.readme.html}</article>
		</main>
		${data.readme.hasCodeBlocks ? a11yDarkStyles : null}
  `;
}
