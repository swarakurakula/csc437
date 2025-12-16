// src/update.ts
import { Auth, Update } from "@calpoly/mustang";
import { Msg, NewStoryPrompt } from "./messages";
import { Model } from "./model";
import { StoryPrompt } from "server/models";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "prompts/selectAll":
      selectAllPrompts(user).then((prompts) => {
        if (!prompts) return;
        apply((model) => ({ ...model, prompts }));
      });
      break;

    case "prompt/save":
      savePrompt(message[1], user)
        .then((savedPrompt) => {
          if (!savedPrompt) return;

          apply((model) => {
            const prompts = model.prompts ?? [];
            const updated = prompts.map((p) =>
              p._id === savedPrompt._id ? savedPrompt : p
            );
            return { ...model, prompts: updated };
          });
        })
        .then(() => {
          const { onSuccess } = message[1];
          if (onSuccess) onSuccess();
        })
        .catch((error: Error) => {
          const { onFailure } = message[1];
          if (onFailure) onFailure(error);
        });
      break;

    case "prompt/create": {
      const payload = message[1];

      createPrompt(payload.prompt, user)
        .then((created) => {
          if (!created) return;

          // add the new prompt to the model
          apply((model) => {
            const prompts = model.prompts ?? [];
            return {
              ...model,
              prompts: [...prompts, created]
            };
          });

          // navigate or do whatever caller requested
          payload.onSuccess?.(created._id);
        })
        .catch((error: Error) => {
          payload.onFailure?.(error);
        });

      break;
    }

    default: {
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
    }
  }
}

/** GET /api/story-prompts */
function selectAllPrompts(
  user: Auth.User
): Promise<Array<StoryPrompt> | undefined> {
  return fetch("/api/story-prompts", {
    headers: Auth.headers(user)
  })
    .then((res: Response) => {
      if (res.status === 200) return res.json();
      console.warn("Failed to fetch story prompts:", res.status);
      return undefined;
    })
    .then((json: unknown) => {
      if (!json) return undefined;

      if (Array.isArray(json)) return json as Array<StoryPrompt>;

      const obj = json as any;
      if (Array.isArray(obj.prompts)) return obj.prompts as Array<StoryPrompt>;

      console.warn("Unknown JSON shape for /api/story-prompts:", json);
      return undefined;
    });
}

/** POST /api/story-prompts – create a brand new prompt (no _id yet) */
function createPrompt(
  newPrompt: NewStoryPrompt,
  user: Auth.User
): Promise<StoryPrompt | undefined> {
  return fetch("/api/story-prompts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(newPrompt)
  })
    .then((response: Response) => {
      if (response.status === 201 || response.status === 200) {
        return response.json();
      }
      throw new Error("Failed to create prompt");
    })
    .then((json: unknown) => {
      if (json) return json as StoryPrompt;
      return undefined;
    });
}

/** PUT /api/story-prompts/:id – update an existing prompt */
function savePrompt(
  msg: {
    id: string;
    prompt: StoryPrompt;
    onSuccess?: () => void;
    onFailure?: (err: Error) => void;
  },
  user: Auth.User
): Promise<StoryPrompt | undefined> {
  return fetch(`/api/story-prompts/${msg.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...Auth.headers(user)
    },
    body: JSON.stringify(msg.prompt)
  })
    .then((response: Response) => {
      if (response.status === 200) return response.json();
      throw new Error(`Failed to save prompt ${msg.id}`);
    })
    .then((json: unknown) => {
      if (json) return json as StoryPrompt;
      return undefined;
    });
}
