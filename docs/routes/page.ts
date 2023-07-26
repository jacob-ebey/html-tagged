import { html } from "html-tagged";

export default function Home() {
  return html`
    <main>
      <article>
        <h1>
          Minimal HTML templates with custom element expansion for the modern
          web.
        </h1>
        <p>
          No custom composition models, no custom syntax, no reactive event
          system, just semantic HTML and JavaScript.
        </p>
        <blockquote>
          "Simple shit should remain simple, this helps me keep it that way."
          <footer>
            <i>- Jacob Ebey, author of things you probably use.</i>
          </footer>
        </blockquote
      </article>
    </main>
  `;
}
