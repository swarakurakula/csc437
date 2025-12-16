// src/main.ts
import { Auth, History, Switch, Store, define, Events } from "@calpoly/mustang";
import { html } from "lit";

import { StoryHeaderElement } from "./components/story-header";
import { HomeViewElement } from "./views/home-view";
import { StoryPromptElement } from "./components/story-prompt";
import { UserProfileViewElement } from "./views/user-profile-view";
import { CreatePromptViewElement } from "./views/create-prompt-view";
import { StoryPromptEditElement } from "./views/story-prompt-edit-view";


import { Model, init } from "./model";
import { Msg } from "./messages";
import update from "./update";

// ----------------------
// Router configuration
// ----------------------

const routes: Switch.Route[] = [
  {
    path: "/app/story-prompts/:id/edit",
    view: (params: Switch.Params) => html`
      <story-prompt-edit promptid=${params.id}></story-prompt-edit>
    `,
  },
  {
    path: "/app/story-prompts/:id",
    view: (params: Switch.Params) => html`
      <story-prompt src=${`/api/story-prompts/${params.id}`}></story-prompt>
    `,
  },
  {
    path: "/app/profile",
    view: () => html`<user-profile-view></user-profile-view>`,
  },
  {
    path: "/app/create",
    view: () => html`<create-prompt-view></create-prompt-view>`,
  },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

// ----------------------
// Custom element definitions
// ----------------------

define({
  // Context providers
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,

  // Store: <mu-store provides="spp:model">
  "mu-store": class AppStore extends Store.Provider<Model, Msg> {
    constructor() {
      // update function, init model, auth context name
      super(update, init, "spp:auth");
    }
  },

  // Router for views
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "spp:history", "spp:auth");
    }
  },

  // App components
  "story-header": StoryHeaderElement,
  "home-view": HomeViewElement,
  "story-prompt": StoryPromptElement,
  "story-prompt-edit": StoryPromptEditElement,
  "user-profile-view": UserProfileViewElement,
  "create-prompt-view": CreatePromptViewElement,
});

// ----------------------
// Global helpers / dark mode
// ----------------------

(window as any).relayEvent = Events.relay;

window.addEventListener("dark-mode", (ev: Event) => {
  const { checked } = (ev as CustomEvent<{ checked: boolean }>).detail;
  document.body.classList.toggle("dark-mode", checked);
});
