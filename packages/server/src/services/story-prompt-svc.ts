import { Schema, model, Types } from "mongoose";
import { StoryPrompt } from "../models/story-prompt";

const StoryPromptSchema = new Schema<StoryPrompt>(
  {
    title: { type: String, required: true, trim: true },
    categories: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    actions: [
      {
        label: { type: String, required: true, trim: true },
        emoji: { type: String, required: true, trim: true },
      },
    ],
    comments: {
      icon: { type: String, required: true, trim: true },
      linkText: { type: String, required: true, trim: true },
      linkHref: { type: String, trim: true }, // Optional
    },
  },
  { collection: "prompts" } // Specify the MongoDB collection name
);

const StoryPromptModel = model<StoryPrompt>("StoryPrompt", StoryPromptSchema);

function index(): Promise<StoryPrompt[]> {
  return StoryPromptModel.find();
}

function get(id: Types.ObjectId): Promise<StoryPrompt> {
  console.log("Fetching story prompt with ID:", id); // Log the ID being fetched

  return StoryPromptModel.findById(id)
    .then((prompt) => {
      if (prompt) {
        console.log("Fetched story prompt:", prompt); // Log the fetched document
        return prompt;
      }
      throw new Error(`Prompt with ID ${id} not found`);
    })
    .catch((err) => {
      console.error("Error fetching story prompt:", err); // Log the error
      throw err.message || "Error fetching story prompt";
    });
}

function create(json: StoryPrompt): Promise<StoryPrompt> {
  const t = new StoryPromptModel(json);
  return t.save();
}

function update(userid: Types.ObjectId, prompt: StoryPrompt): Promise<StoryPrompt> {
  return StoryPromptModel.findOneAndUpdate({ _id: userid }, prompt, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${userid} not updated`;
    else return updated as StoryPrompt;
  });
}

function remove(userid: String): Promise<void> {
  return StoryPromptModel.findOneAndDelete({ _id: userid }).then(
    (deleted) => {
      if (!deleted) throw `${userid} not deleted`;
    }
  );
}

export default { index, get, create, update, remove };

// const storyPrompts: Record<string, StoryPrompt> = {
//   charactersMeetCreators: {
//     title: "What Happens When Fictional Characters Meet Their Creators?",
//     categories: "Fiction, Comedy, Adventure",
//     prompt: `A mysterious portal brings literary characters face-to-face with the authors who created them. 
//       Sherlock Holmes questions Sir Arthur Conan Doyle’s ending choices, a superhero confronts their creator 
//       about their tragic backstory, and villains protest their portrayal. Can these creators handle the criticism, 
//       or will the characters write a new chapter of their own?`,
//     datePosted: new Date("2024-10-18"),
//     actions: [
//       { label: "Plot Twist", emoji: "🌀" },
//       { label: "Brainstorm Fuel", emoji: "💡" },
//       { label: "Story Material", emoji: "🎬" },
//       { label: "Like", emoji: "👍" },
//       { label: "Dislike", emoji: "👎" },
//       { label: "Save", emoji: "⭐" },
//     ],
//     comments: {
//       icon: "/icons/responses.svg#icon-comment",
//       linkText: "View all comments",
//       linkHref: "comments.html",
//     },
//   },
//   pizzaCurrency: {
//     title: "What If Pizza Became the Currency of the World?",
//     categories: "Fiction, Comedy",
//     prompt: `When global economies collapse, society decides on a new currency: pizza. 
//       But soon, pepperoni becomes gold, pineapple is considered a high-risk investment, 
//       and pizza vaults replace banks. What happens when one pizza chain takes control 
//       of the world's supply—and what are the lengths people will go to for a slice?`,
//     datePosted: new Date("2024-10-12"),
//     actions: [
//       { label: "Plot Twist", emoji: "🌀" },
//       { label: "Brainstorm Fuel", emoji: "💡" },
//       { label: "Story Material", emoji: "🎬" },
//       { label: "Like", emoji: "👍" },
//       { label: "Dislike", emoji: "👎" },
//       { label: "Save", emoji: "⭐" },
//     ],
//     comments: {
//       icon: "/icons/responses.svg#icon-comment",
//       linkText: "View all comments",
//     },
//   },
// };

// export function getStoryPrompt(id: string): StoryPrompt {
//   // Return the story prompt matching the ID or default to the first one
//   return storyPrompts[id] || Object.values(storyPrompts)[0];
// }
