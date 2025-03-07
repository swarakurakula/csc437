import { css, html, shadow } from "@calpoly/mustang";
import reset from "./styles/reset.css.js";

export class StoryPromptElement extends HTMLElement {
  static template = html`
    <template>
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
        <div class="prompt-actions">
          <slot name="actions"></slot>
        </div>
        <div class="comments">
          <slot name="comments"></slot>
        </div>
      </article>
    </template>
  `;

  static styles = css`
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
  `;

  constructor() {
    super();
    shadow(this)
      .template(StoryPromptElement.template)
      .styles(reset.styles, StoryPromptElement.styles);
  }
}

customElements.define("story-prompt", StoryPromptElement);
