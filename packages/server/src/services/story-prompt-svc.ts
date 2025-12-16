import { Schema, model, Types } from "mongoose";
import { StoryPrompt } from "../models/story-prompt";

const StoryPromptSchema = new Schema<StoryPrompt>(
  {
    title: { type: String, required: true, trim: true },
    categories: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },

    // Make actions optional, default to empty array
    actions: {
      type: [
        {
          label: { type: String, trim: true },
          emoji: { type: String, trim: true },
        },
      ],
      default: [], // no actions required at create time
    },

    // Make comments optional and give sensible defaults
    comments: {
      icon: {
        type: String,
        trim: true,
        default: "/icons/responses.svg#icon-comment",
      },
      linkText: {
        type: String,
        trim: true,
        default: "View all comments",
      },
      linkHref: {
        type: String,
        trim: true,
      },
    },
  },
  { collection: "prompts" }
);


const StoryPromptModel = model<StoryPrompt>("StoryPrompt", StoryPromptSchema);

function index(): Promise<StoryPrompt[]> {
  return StoryPromptModel.find();
}

function get(id: Types.ObjectId): Promise<StoryPrompt> {
  console.log("Fetching story prompt with ID:", id);

  return StoryPromptModel.findById(id)
    .then((prompt) => {
      if (prompt) {
        console.log("Fetched story prompt:", prompt);
        return prompt;
      }
      throw new Error(`Prompt with ID ${id} not found`);
    })
    .catch((err) => {
      console.error("Error fetching story prompt:", err);
      throw err.message || "Error fetching story prompt";
    });
}

function create(json: StoryPrompt): Promise<StoryPrompt> {
  const t = new StoryPromptModel(json);
  return t.save();
}

function update(id: Types.ObjectId, prompt: StoryPrompt): Promise<StoryPrompt> {
  return StoryPromptModel.findOneAndUpdate({ _id: id }, prompt, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${id} not updated`;
    else return updated as StoryPrompt;
  });
}

function remove(id: string): Promise<void> {
  return StoryPromptModel.findOneAndDelete({ _id: id }).then((deleted) => {
    if (!deleted) throw `${id} not deleted`;
  });
}

export default { index, get, create, update, remove };
