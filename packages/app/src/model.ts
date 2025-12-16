// src/model.ts
import { StoryPrompt } from "server/models";

/**
 * Global app model held in <mu-store>.
 * We'll add more fields (like profile) later if needed.
 */
export interface Model {
  prompts?: Array<StoryPrompt>;
  // profile?: UserProfile;  // you can add later if you have this type
}

/**
 * Initial value for the store.
 */
export const init: Model = {};
