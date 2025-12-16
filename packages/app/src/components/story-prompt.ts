import { css, html, shadow, Form, define } from "@calpoly/mustang";
import reset from "../../public/styles/reset.css.ts";

export class StoryPromptElement extends HTMLElement {
  get src(): string | null {
    return this.getAttribute("src");
  }

  static uses = define({
    "mu-form": Form.Element
  });

  connectedCallback() {
    // default mode the first time we connect
    if (!this.mode) {
      this.mode = "view";
    }

    // wire up events now that shadow DOM is attached
    const edit = this.editButton;
    if (edit) {
      edit.addEventListener("click", () => {
        this.mode = "edit";
      });
    }

    this.addEventListener("mu-form:submit", (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      this.submit(this.src, detail);
    });

    if (this.src) this.hydrate(this.src);
  }

  get form(): any {
    // mu-form has an .init property but TS doesn't know its type
    return this.shadowRoot?.querySelector("mu-form.edit") as any;
  }

  get mode(): string | null {
    return this.getAttribute("mode");
  }

  set mode(m: string | null) {
    if (m === null) this.removeAttribute("mode");
    else this.setAttribute("mode", m);
  }

  get editButton(): HTMLButtonElement | null {
    return this.shadowRoot?.getElementById("edit") as HTMLButtonElement | null;
  }

  hydrate(url: string) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json: unknown) => {
        this.renderSlots(json);
        if (this.form) {
          this.form.init = json; // populate mu-form
        }
      })
      .catch((error) =>
        console.log(`Failed to render data ${url}:`, error)
      );
  }

  renderSlots(json: unknown) {
    console.log("fetched data response", json);
    if (!json || typeof json !== "object") return;

    const entries = Object.entries(json as Record<string, unknown>);

    const fragment = entries.map(([key, value]) => {
      if (key === "comments") {
        // Special case for the comments slot, setting the anchor's href
        const link = document.createElement("a");
        link.href = String(value ?? "#");
        link.textContent = "View all comments";
        link.setAttribute("slot", "comments");
        return link;
      }

      // Default behavior for other slots
      return html`<span slot="${key}">${String(value ?? "")}</span>`;
    });

    this.replaceChildren(...fragment);
  }

  submit(url: string | null, data: unknown) {
    if (!url) {
      console.error("No src URL on <story-prompt>, cannot submit");
      return;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
        return res.json(); // server returns updated object
      })
      .then((json: unknown) => {
        this.renderSlots(json);
        if (this.form) {
          this.form.init = json; // refresh the form with the saved data
        }
        this.mode = "view";
      })
      .catch((err) => console.error("PUT error:", err));
  }

  static template = html`
    <template>
      <section class="view">
        <button id="edit">Edit</button>
        <article class="prompt">
          <h3><slot name="title">Default Title</slot></h3>
          <p>
            <strong>Categories:</strong>
            <slot name="categories">No categories</slot>
          </p>
          <p>
            <strong>Prompt:</strong>
            <slot name="prompt">Default prompt text</slot>
          </p>
          <div class="actions">
            <slot name="actions"></slot>
          </div>
          <div class="comments">
            <slot name="comments">
              <a href="#" class="comment-link">View all comments</a>
            </slot>
          </div>
        </article>
      </section>

      <mu-form class="edit">
        <label>
          <span>Title</span>
          <input name="title" />
        </label>

        <label>
          <span>Categories</span>
          <input name="categories" />
        </label>

        <label>
          <span>Prompt</span>
          <textarea name="prompt"></textarea>
        </label>

        <!-- make sure there is a submit button so mu-form can submit -->
        <button type="submit">Save</button>
      </mu-form>
    </template>
  `;

  static styles = css`
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }

    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }

    .prompt {
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-large);
      padding: 20px;
    }

    h3 {
      margin-top: 10px;
    }

    p {
      color: var(--text-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
      margin: 10px 0;
    }

    time {
      font-style: italic;
      color: var(--text-secondary-color);
    }

    .prompt-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    button {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
    }

    button:hover {
      background-color: var(--button-hover-color);
    }

    svg.icon {
      width: 35px;
      height: 35px;
      vertical-align: middle;
      margin-right: 2px;
    }

    a {
      color: var(--link-color);
    }
  `;

  constructor() {
    super();
    shadow(this)
      .template(StoryPromptElement.template)
      .styles(reset.styles, StoryPromptElement.styles);
    // event listeners are set up in connectedCallback()
  }
}

customElements.define("story-prompt", StoryPromptElement);
