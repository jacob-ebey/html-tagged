import { html } from "html-tagged";

export default function Home({ data }) {
  return html`
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
    <main>
      <section id="testimonials">
        <blockquote>
          <img alt="Quote" src="/img/icon-quote.svg" height="80" /><br />
          "Simple shit should remain simple, this helps me keep it that way."
          <footer>
            <i>- Jacob Ebey, author of things you probably use.</i>
          </footer>
        </blockquote>
      </section>
    </main>
  `;
}
