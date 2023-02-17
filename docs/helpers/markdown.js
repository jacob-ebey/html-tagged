import frontmatter from "front-matter";
import hljs from "highlight.js";
import { marked } from "marked";

/**
 * @param {string} markdown
 * @returns {{ html: string, hasCodeBlocks: boolean }}
 */
export function parse(markdown) {
	const {} = frontmatter(markdown);
	let hasCodeBlocks = false;
	const html = marked(markdown, {
		highlight: (code, language) => {
			if (language && hljs.getLanguage(language)) {
				try {
					const highlighted = hljs.highlight(code, { language }).value;
					hasCodeBlocks = true;
					return highlighted;
				} catch (__) {}
			}
			return code;
		},
		langPrefix: "hljs language-",
		gfm: true,
		headerIds: true,
		smartLists: true,
	});

	return {
		html,
		hasCodeBlocks,
	};
}
