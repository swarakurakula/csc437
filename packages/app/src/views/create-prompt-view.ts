// src/views/create-prompt-view.ts
import { View, Form, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { Model } from "../model";
import { Msg, NewStoryPrompt } from "../messages";

export class CreatePromptViewElement extends View<Model, Msg> {
  constructor() {
    // must match <mu-store provides="spp:model">
    super("spp:model");
  }

  render() {
    return html`
      <main class="page">
        <h2>Make a Prompt</h2>

        <mu-form
          class="create"
          @mu-form:submit=${this._handleSubmit}
        >
          <label>
            <span>Title</span>
            <input name="title" required />
          </label>

          <label>
            <span>Categories</span>
            <input name="categories" />
          </label>

          <label>
            <span>Prompt</span>
            <textarea name="prompt" required></textarea>
          </label>
          <!-- 🔥 No extra <button>; mu-form will add its own submit button -->
        </mu-form>
      </main>
    `;
  }

  private _handleSubmit(event: Form.SubmitEvent<NewStoryPrompt>) {
    const prompt = event.detail;

    this.dispatchMessage([
      "prompt/create",
      {
        prompt,
        onSuccess: (newId: string) =>
          History.dispatch(this, "history/navigate", {
            href: `/app/story-prompts/${newId}`
          }),
        onFailure: (err: Error) =>
          console.error("Failed to create prompt:", err)
      }
    ]);
  }

  static styles = css`
    .create {
      max-width: 600px;
      margin: 20px auto;
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      padding: 20px;
      border-radius: var(--border-radius-large);
      display: grid;
      gap: 1rem;
    }

    label {
      display: grid;
      gap: 0.25rem;
    }

    input,
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size);
      color: var(--text-color);
      font-family: var(--font-body);
    }

    /* Style the submit button that mu-form injects */
    .create button[type="submit"] {
      background-color: var(--button-background-color);
      color: var(--header-text-color);
      padding: 10px 15px;
      border: none;
      border-radius: var(--border-radius-small);
      cursor: pointer;
      font-size: var(--font-size);
      justify-self: start;
    }

    .create button[type="submit"]:hover {
      background-color: var(--button-hover-color);
    }
  `;
}
