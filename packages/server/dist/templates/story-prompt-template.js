"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var story_prompt_template_exports = {};
__export(story_prompt_template_exports, {
  storyPromptPage: () => storyPromptPage
});
module.exports = __toCommonJS(story_prompt_template_exports);
var import_mustang = require("@calpoly/mustang");
function storyPromptPage(data) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title}</title>
      <link rel="stylesheet" href="/styles/main.css">
    </head>
    <body>
      <header>
        <h1>${data.title}</h1>
        <p class="categories">Categories: ${data.categories}</p>
      </header>
      <main>
        <section class="prompt">
          <p>${data.prompt}</p>
        </section>
        <section class="actions">
          <h2>React to this prompt:</h2>
          <ul>
            ${data.actions.map(
    (action) => import_mustang.html`
                  <li>
                    <button>
                      ${action.emoji} ${action.label}
                    </button>
                  </li>
                `
  ).join("")}
          </ul>
        </section>
        <section class="comments">
          <h2>Comments</h2>
          <a href="${data.comments.linkHref}">
            <svg>
              <use xlink:href="${data.comments.icon}"></use>
            </svg>
            ${data.comments.linkText}
          </a>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Story Prompt Platform</p>
      </footer>
    </body>
    </html>
  `;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  storyPromptPage
});
