"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var story_prompt_exports = {};
__export(story_prompt_exports, {
  StoryPromptPage: () => StoryPromptPage
});
module.exports = __toCommonJS(story_prompt_exports);
var import_server = require("@calpoly/mustang/server");
var import_renderPage = __toESM(require("./renderPage"));
class StoryPromptPage {
  data;
  constructor(data) {
    this.data = data;
  }
  render() {
    return (0, import_renderPage.default)({
      body: this.renderBody(),
      stylesheets: [
        "/styles/reset.css",
        "/styles/tokens.css",
        "/styles/page.css"
      ],
      styles: [
        import_server.css`main.page {
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
      comments
    } = this.data;
    return import_server.html`
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
            <h2>Welcome back, Jpp!</h2>
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
              
           
                
              </div>
            </footer>
          </section>
        </main>
      </body>
    `;
  }
  renderAction(action) {
    return import_server.html`
      <button class="action">
        ${action.emoji} ${action.label}
      </button>
    `;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  StoryPromptPage
});
