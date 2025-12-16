// src/main.ts
import {
  Auth,
  History,
  Switch,
  define,
  Events
} from "@calpoly/mustang";
import { html } from "lit";

import { StoryHeaderElement } from "./components/story-header";
import { HomeViewElement } from "./views/home-view";
import { StoryPromptElement } from "./components/story-prompt";
import { UserProfileViewElement } from "./views/user-profile-view";
import { CreatePromptViewElement } from "./views/create-prompt-view";

// ----------------------
// Router configuration
// ----------------------

const routes: Switch.Route[] = [
  {
    // Detail view for a single story prompt
    path: "/app/story-prompts/:id",
    view: (params: Switch.Params) => html`
      <story-prompt src=${`/api/story-prompts/${params.id}`}></story-prompt>
    `
  },
  {
    // Profile page
    path: "/app/profile",
    view: () => html`<user-profile-view></user-profile-view>`
  },
  {
    // Create prompt page
    path: "/app/create",
    view: () => html`<create-prompt-view></create-prompt-view>`
  },
  {
    // Home / browse prompts
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  {
    // Redirect root to /app
    path: "/",
    redirect: "/app"
  }
];

// ----------------------
// Custom element definitions
// ----------------------

define({
  // Context providers
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,

  // Router
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "spp:history", "spp:auth");
    }
  },

  // App components
  "story-header": StoryHeaderElement,
  "home-view": HomeViewElement,
  "story-prompt": StoryPromptElement,
  "user-profile-view": UserProfileViewElement,
  "create-prompt-view": CreatePromptViewElement
});

// ----------------------
// Global helpers / dark mode
// ----------------------

(window as any).relayEvent = Events.relay;

window.addEventListener("dark-mode", (ev: Event) => {
  const { checked } = (ev as CustomEvent<{ checked: boolean }>).detail;
  document.body.classList.toggle("dark-mode", checked);
});
