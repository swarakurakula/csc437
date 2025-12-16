// src/views/home-view.ts
import { Auth, Observer } from "@calpoly/mustang";
import { css, html, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { StoryPrompt } from "server/models"; // <- your interface from server

export class HomeViewElement extends LitElement {
  // REST endpoint for your story prompts index
  src = "/api/story-prompts";

  // Lit @state = reactive field; when it changes, render() runs again
  @state()
  prompts: Array<StoryPrompt> = [];

  render() {
    console.log("prompts =", this.prompts);

    const prompts = this.prompts ?? []; // 👈 use [] if undefined
    const promptList = prompts.map((prompt) =>
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

  // Render a single StoryPrompt as HTML
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
  `;

  // --- Auth + hydrate code from lab, adapted ---

  // observe auth state from <mu-auth provides="spp:auth">
  private _authObserver = new Observer<Auth.Model>(this, "spp:auth");
  private _user = new Auth.User();

  connectedCallback() {
    super.connectedCallback(); // important for Lit!

    this._authObserver.observe(({ user }) => {
      if (user) {
        this._user = user;
      }
      this.hydrate(this.src);
    });
  }

  hydrate(url: string) {
    fetch(url, {
      headers: Auth.headers(this._user)
    })
      .then((res: Response) => {
        if (res.status === 200) return res.json();
        throw `Server responded with status ${res.status}`;
      })
      .then((json: unknown) => {
        console.log("story-prompts JSON from server:", json);

        if (!json) {
          this.prompts = [];
          return;
        }

        // Case 1: backend returns a plain array: [ { ... }, { ... } ]
        if (Array.isArray(json)) {
          this.prompts = json as Array<StoryPrompt>;
          return;
        }

        // Case 2: backend returns an object; try common keys
        const obj = json as any;

        if (Array.isArray(obj.prompts)) {
          this.prompts = obj.prompts as Array<StoryPrompt>;
        } else if (Array.isArray(obj.data)) {
          this.prompts = obj.data as Array<StoryPrompt>;
        } else {
          console.warn("Unknown JSON shape for story-prompts:", json);
          this.prompts = [];
        }
      })
      .catch((err) =>
        console.log("Failed to load story prompts:", err)
      );
  }
}
