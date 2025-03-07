import { css, html } from "@calpoly/mustang/server";
import { StoryPrompt } from "../models";
import renderPage from "./renderPage"; // generic page renderer

export class StoryPromptPage {
  data: StoryPrompt;

  constructor(data: StoryPrompt) {
    this.data = data;
  }

  render() {
    return renderPage({
      body: this.renderBody(),
      stylesheets: ["/styles/reset.css",
      "/styles/tokens.css",
      "/styles/page.css"],
      styles: [
        css`main.page {
            --page-grids: 8;
            @media screen and (max-width: 48rem) {
              --page-grids: 6;
          }
        }`
      ],
      scripts: [
        `import { define } from "@calpoly/mustang";
        import { StoryPromptElement } from "/scripts/story-prompt.js";

        define({
          "story-prompt": StoryPromptElement
        });`
      ]
    });
  }

  renderBody() {
    console.log(this.data);
    const {
      title,
      categories,
      prompt,
      actions,
      comments,
    } = this.data;

    const actionButtons = actions.map((action) => this.renderAction(action));
    console.log(actionButtons);

    return html`
      <body>
        <header class="header">
          <div class="logo">
            <h1>Story Prompt Platform</h1>
            <span>Create, like, and explore story prompts of all kinds!</span>
          </div>
          <nav class="nav">
            <ul>
              <li><a href="index.html">Browse Prompts</a></li>
              <li><a href="create-prompt.html">Make a Prompt</a></li>
              <li><a href="user-profile.html">My Profile</a></li>
            </ul>
          </nav>
          <div class="user-info">
            <h2>Welcome back, Jane!</h2>
            <img src="janedoe.jpg" alt="Profile Picture" class="profile-picture" />
          </div>

          <label>
            <input type="checkbox" id="dark-mode-toggle" autocomplete="off" />
            Dark mode
          </label>
          <script src="styles/dark-mode.js"></script>
        </header>

        <main class="page">
          <section class="story-prompt">
            
              <h2>${title}</h2>
              <p class="categories">${categories}</p>
            
            <article class="prompt">
              <p>${prompt}</p>
            </article>
            <footer>
              <div class="actions">${actionButtons}</div>
              <div class="comments">
                <a href="${comments.linkHref}">
                  <svg class="icon"><use href="${comments.icon}"></use></svg>
                  ${comments.linkText}
                </a>
              </div>
            </footer>
          </section>
        </main>
      </body>
    `;
  }

  renderAction(action: { label: string; emoji: string }) {
    return html`
      <button class="action">
        ${action.emoji} ${action.label}
      </button>
    `;
  }
}
