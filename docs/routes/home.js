import { html } from "html-tagged";

export async function data() {
  const readme = await fetch(
    "https://github-md.com/jacob-ebey/html-tagged/main/README.md"
  ).then((res) => res.json());

  return { readme };
}

export default function Home({ data }) {
  return html`
    <main>
      <header>
        <h1>
          Minimal HTML templates with custom element expansion for the modern
          web.
        </h1>
        <p>
          <b>
            No custom composition models, no custom syntax, no reactive event
            system,
          </b>
          just semantic HTML and JavaScript.
        </p>
      </header>

      <section id="testimonials">
        <blockquote>
          <img alt="Quote" src="/img/icon-quote.svg" height="80" /><br />
          "Simple shit should remain simple, this helps me keep it that way."
          <footer>
            <i>- Jacob Ebey, author of things you probably use.</i>
          </footer>
        </blockquote>
      </section>

      <article>${data.readme.html}</article>
    </main>
  `;
}
