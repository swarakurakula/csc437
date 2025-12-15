import { css, html, shadow, Form, define } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class StoryPromptElement extends HTMLElement {
  get src() {
    return this.getAttribute("src");
  }
  static uses = define({
    "mu-form": Form.Element,
  });
  connectedCallback() {
    if (!this.mode) {
      this.mode = "view"; // 🔥 default mode on first connect
    }
    if (this.src) this.hydrate(this.src);
  }

  get form() {
    return this.shadowRoot.querySelector("mu-form.edit");
  }

  get mode() {
    return this.getAttribute("mode");
  }

  set mode(m) {
    this.setAttribute("mode", m);
  }

  get editButton() {
    return this.shadowRoot.getElementById("edit");
  }

  hydrate(url) {
    fetch(url)
      .then((res) => {
        if (res.status !== 200) throw `Status: ${res.status}`;
        return res.json();
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json; // populate mu-form
      })
      .catch((error) => console.log(`Failed to render data ${url}:`, error));
  }

  renderSlots(json_array) {
    console.log("fetched data response", json_array);
    const entries = Object.entries(json_array);
    const toSlot = ([key, value]) => html`<span slot="${key}">${value}</span>`;

    // const fragment = entries.map(toSlot);
    const fragment = entries.map(([key, value]) => {
      if (key === "comments") {
        // Special case for the comments slot, setting the anchor's href
        const link = document.createElement("a");
        link.href = value;
        link.textContent = "View all comments";
        link.setAttribute("slot", "comments");
        return link;
      }
      // Default behavior for other slots
      return html`<span slot="${key}">${value}</span>`;
    });
    this.replaceChildren(...fragment);
  }

  submit(url, data) {
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
        return res.json(); // server returns updated object
      })
      .then((json) => {
        this.renderSlots(json);
        this.form.init = json; // refresh the form with the saved data
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
      /* … */
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
      /* … */
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

    // Listen for mu-form submit and send PUT
    this.addEventListener("mu-form:submit", (event) => {
      this.submit(this.src, event.detail);
    });

    this.editButton.addEventListener("click", () => (this.mode = "edit"));
  }
}

customElements.define("story-prompt", StoryPromptElement);
