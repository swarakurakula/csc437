// src/views/story-prompt-edit-view.ts
import { View, Form, History } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { StoryPrompt } from "server/models";
import { Model } from "../model";
import { Msg } from "../messages";

export class StoryPromptEditElement extends View<Model, Msg> {
  // `/app/story-prompts/:id/edit` will pass this
  @property()
  promptid?: string;

  constructor() {
    // Must match <mu-store provides="spp:model">
    super("spp:model");
  }

  // reactive getter: find the prompt from the global model
  @state()
  get prompt(): StoryPrompt | undefined {
    const prompts = this.model.prompts ?? [];
    return prompts.find((p) => p._id === this.promptid);
  }

  connectedCallback() {
    super.connectedCallback();

    // If prompts aren't loaded yet, request them
    if (!this.model.prompts) {
      this.dispatchMessage(["prompts/selectAll", {}]);
    }
  }

  render() {
  if (!this.prompt) {
    return html`<main class="page"><p>Loading prompt...</p></main>`;
  }

  return html`
    <main class="page">
      <h2>Edit Prompt</h2>

      <mu-form
        class="edit"
        .init=${this.prompt}
        @mu-form:submit=${this._handleSubmit}
      >
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
    </main>
  `;
}


  // Event handler for mu-form:submit
  private _handleSubmit(event: Form.SubmitEvent<StoryPrompt>) {
    if (!this.promptid) {
      console.error("No promptid set for StoryPromptEditElement");
      return;
    }

    this.dispatchMessage([
      "prompt/save",
      {
        id: this.promptid,
        prompt: event.detail,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: "/app" // back to list, or `/app/story-prompts/${this.promptid}`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR saving prompt:", error)
      }
    ]);
  }

  static styles = css`
    main.page {
      padding: 20px;
    }

    .edit {
      display: grid;
      gap: 1rem;
      max-width: 600px;
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-large);
      padding: 20px;
    }

    label {
      display: grid;
      gap: 0.25rem;
    }

    input,
    textarea {
      width: 100%;
      padding: 8px;
      border-radius: var(--border-radius-medium);
      border: 1px solid var(--border-color);
      font-family: var(--font-body);
      font-size: var(--font-size);
    }

    button {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
      justify-self: start;
    }

    button:hover {
      background-color: var(--button-hover-color);
    }
  `;
}
