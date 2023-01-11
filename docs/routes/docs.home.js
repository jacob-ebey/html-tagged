import { html } from "html-tagged";

export async function data() {
  /**
   * @type {{
   *  attributes: Record<string, unknown>;
   *  html: string
   * }}
   **/
  const readme = await fetch(
    "https://github-md.com/jacob-ebey/html-tagged/main/README.md",
    {
      cf: {
        cacheTtlByStatus: {
          // 5 minutes
          200: 1 * 60 * 5,
        },
      },
    }
  ).then((res) => res.json());

  return { readme };
}

/**
 *
 * @param {{ data: Awaited<ReturnType<typeof data>> }} args
 * @returns
 */
export default function DocsHome({ data }) {
  return html` <article>${data.readme.html}</article> `;
}
