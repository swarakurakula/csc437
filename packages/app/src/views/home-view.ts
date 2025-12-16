// src/views/home-view.ts
import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { StoryPrompt } from "server/models";
import { Model } from "../model";
import { Msg } from "../messages";

export class HomeViewElement extends View<Model, Msg> {
  constructor() {
    // "spp:model" must match <mu-store provides="spp:model">
    super("spp:model");
  }

  // reactive getter that reads from the global model
  @state()
  get prompts(): Array<StoryPrompt> {
    return this.model.prompts ?? [];
  }

  connectedCallback() {
    super.connectedCallback();

    // Ask the store to load all prompts
    this.dispatchMessage(["prompts/selectAll", {}]);
  }

  render() {
    const promptList = this.prompts.map((prompt) =>
      this.renderItem(prompt)
    );

    return html`
      <main class="page">
        <h2>Browse Prompts</h2>
        <section class="section">
          ${promptList}
        </section>
      </main>
    `;
  }

  // Render a single prompt summary
  private renderItem(prompt: StoryPrompt) {
  return html`
    <article class="prompt">
      <h3>${prompt.title}</h3>
      <p>
        <strong>Categories:</strong>
        ${prompt.categories}
      </p>
      <p>
        <strong>Prompt:</strong>
        ${prompt.prompt}
      </p>

      <!-- SPA navigation: mu-history will intercept this -->
      <p>
        <a href=${`/app/story-prompts/${prompt._id}/edit`}>Edit</a>
      </p>
    </article>
  `;
}


  static styles = css`
    .section {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .prompt {
      background-color: var(--form-background-color);
      border: 2px solid var(--border-color);
      border-radius: var(--border-radius-large);
      padding: 20px;
    }

    h2 {
      margin-top: 20px;
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
  `;
}
