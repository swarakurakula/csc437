// src/messages.ts
import { StoryPrompt } from "server/models";

// A prompt being *created* does NOT have _id / actions / comments yet
export type NewStoryPrompt = Pick<StoryPrompt, "title" | "categories" | "prompt">;

export type Msg =
  | [
      "prompts/selectAll",
      {}
    ]
  | [
      "prompt/save",
      {
        id: string;
        prompt: StoryPrompt;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  | [
      "prompt/create",
      {
        prompt: NewStoryPrompt;
        onSuccess?: (newId: string) => void;
        onFailure?: (err: Error) => void;
      }
    ];
